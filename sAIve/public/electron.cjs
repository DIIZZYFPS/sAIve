// electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const url = require('url');

let pythonProcess = null;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional: if you need a preload script
      
    },
    autoHideMenuBar: true, // Optional: hide the menu bar
    icon: path.join(__dirname, 'vite.svg'), // Optional: set the window icon
  });

  // Determine the URL to load
  // In development, load from the React dev server.
  // In production, load the built index.html file.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
        //pathname: path.join(__dirname, '../build/index.html'), // CRA default build output
        pathname: path.join(__dirname, '../dist/index.html'), // Vite default build output
        protocol: 'file:',
        slashes: true
    });

  mainWindow.loadURL(startUrl);

  // Open the DevTools if not in production
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  // --Start the Python server--
  const serverPath = app.isPackaged
  ? path.join(process.resourcesPath, 'app', 'Server')
  : path.join(__dirname, '..', '..', 'Server');
  
  const pythonExecutable = process.platform === 'win32' ? 'python.exe' : 'python3';
  pythonProcess = spawn(pythonExecutable, [
    '-m', 
    'uvicorn',
    'main:app', 
    '--host', '127.0.0.1',
    '--port', '8000'
  ], {
    cwd: serverPath,
    stdio: 'pipe'
  });

  //Logging
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
  });
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Server Error: ${data}`);
  });
  // --End Python Server--

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  // Kill the Python process when the app is quitting
  if (pythonProcess) {
    console.log('Killing Python process...');
    pythonProcess.kill();
    pythonProcess = null;
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.