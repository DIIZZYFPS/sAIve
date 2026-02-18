// electron.js
import { app, BrowserWindow, dialog, net, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- File Logging Setup ---
const logFilePath = path.join(app.getPath('userData'), 'app.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message.toString().trim()}\n`;
  logStream.write(logMessage);
  process.stdout.write(logMessage);
};

const error = (message) => {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${message.toString().trim()}\n`;
  logStream.write(errorMessage);
  process.stderr.write(errorMessage);
};

console.log = log;
console.error = error;
// --- End File Logging Setup ---

let pythonProcess = null;
let backendPort = null; // Dynamic port assigned by the backend

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../dist/vite.svg'),
  });

  mainWindow.maximize();

  const devUrl = 'http://localhost:5173/';
  const prodPath = path.join(__dirname, '../dist/index.html');

  if (app.isPackaged) {
    mainWindow.loadFile(prodPath);
  } else {
    mainWindow.loadURL(devUrl);
  }
}

// --- IPC handler so the renderer can Request the backend port ---
ipcMain.handle('get-backend-port', () => backendPort);

// --- IPC handler for renderer logs ---
ipcMain.on('console-log', (event, message) => {
  console.log(`[Renderer] ${message}`);
});

const startBackend = () => {
  return new Promise((resolve, reject) => {
    let executable;
    let args;
    let cwd;

    if (app.isPackaged) {
      // Production: run the PyInstaller-built binary
      const binaryName = process.platform === 'win32' ? 'sAIve-backend.exe' : 'sAIve-backend';
      executable = path.join(process.resourcesPath, 'backend', binaryName);
      args = [];
      cwd = path.join(process.resourcesPath, 'backend');

      if (!fs.existsSync(executable)) {
        const errorMessage = `Backend binary not found at: ${executable}`;
        console.error(errorMessage);
        dialog.showErrorBox('Backend Error', errorMessage);
        reject(new Error(errorMessage));
        return;
      }
    } else {
      // Development: run python main.py directly
      executable = 'python';
      args = ['main.py'];
      cwd = path.join(__dirname, '..', '..', 'Server');
    }

    console.log(`Starting backend: ${executable} ${args.join(' ')} in ${cwd}`);

    // Pass User Data path to backend for persistent DB storage only in production
    const env = { ...process.env };
    if (app.isPackaged) {
      env.SAIVE_USER_DATA = app.getPath('userData');
    }

    pythonProcess = spawn(executable, args, {
      cwd: cwd,
      stdio: 'pipe',
      env: env,
    });

    let portFound = false;

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Backend: ${output}`);

      // Parse the port from the backend's stdout
      if (!portFound) {
        const match = output.match(/PORT:(\d+)/);
        if (match) {
          backendPort = parseInt(match[1], 10);
          portFound = true;
          console.log(`Backend port discovered: ${backendPort}`);
          resolve(backendPort);
        }
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Backend: ${data}`);
    });

    pythonProcess.on('error', (err) => {
      console.error(`Failed to start backend process: ${err}`);
      dialog.showErrorBox('Backend Error', `Failed to start backend process: ${err.message}`);
      reject(err);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Backend process exited with code ${code}`);
      }
      if (!portFound) {
        reject(new Error(`Backend exited with code ${code} before reporting a port.`));
      }
    });

    // Timeout: if no port is found within 30 seconds, fail
    setTimeout(() => {
      if (!portFound) {
        console.error('Backend did not report a port within 30 seconds.');
        reject(new Error('Backend startup timeout.'));
      }
    }, 30000);
  });
};

const checkBackendReady = (callback) => {
  const request = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: backendPort,
    path: '/',
  });
  request.on('response', (response) => {
    callback(response.statusCode === 200);
  });
  request.on('error', () => {
    callback(false);
  });
  request.end();
};

const waitForBackend = (callback) => {
  let attempts = 0;
  const maxAttempts = 30;
  const interval = 1000; // 1 second (faster polling since we already know the port)

  const tryConnect = () => {
    checkBackendReady((ready) => {
      if (ready) {
        console.log('Backend is ready. Proceeding to create window.');
        callback();
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`Backend not ready, retrying in ${interval / 1000}s... (attempt ${attempts})`);
          setTimeout(tryConnect, interval);
        } else {
          const errorMessage = 'Backend did not start within the expected time.';
          console.error(errorMessage);
          dialog.showErrorBox('Backend Startup Error', errorMessage);
          app.quit();
        }
      }
    });
  };
  tryConnect();
};

// App lifecycle
app.whenReady().then(async () => {
  console.log('App is ready. Starting backend...');
  try {
    await startBackend();
    waitForBackend(() => {
      createWindow();
    });
  } catch (err) {
    console.error(`Fatal: ${err.message}`);
    dialog.showErrorBox('Backend Startup Error', err.message);
    app.quit();
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Check for updates after a short delay
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000);
});

// --- Auto-Updater Events ---
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = true;

autoUpdater.on('update-available', (info) => {
  log(`Update available: ${info.version}`);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: `A new version (${info.version}) of sAIve is available.`,
    detail: 'Click "Download" to view the release on GitHub.',
    buttons: ['Download', 'Later'],
    defaultId: 0,
    cancelId: 1
  }).then(({ response }) => {
    if (response === 0) {
      shell.openExternal('https://github.com/DIIZZYFPS/sAIve/releases/latest');
    }
  });
});

autoUpdater.on('error', (err) => {
  log(`Updater error: ${err}`);
});


app.on('will-quit', () => {
  if (pythonProcess) {
    console.log('Killing backend process...');
    pythonProcess.kill();
    pythonProcess = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
