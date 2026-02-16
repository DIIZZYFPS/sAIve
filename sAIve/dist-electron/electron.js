import { app, ipcMain, dialog, BrowserWindow, net } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(app.getPath("userData"), "app.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
const log = (message) => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logMessage = `[${timestamp}] ${message.toString().trim()}
`;
  logStream.write(logMessage);
  process.stdout.write(logMessage);
};
const error = (message) => {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${message.toString().trim()}
`;
  logStream.write(errorMessage);
  process.stderr.write(errorMessage);
};
console.log = log;
console.error = error;
let pythonProcess = null;
let backendPort = null;
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../dist/vite.svg")
  });
  mainWindow.maximize();
  const devUrl = "http://localhost:5173/";
  const prodPath = path.join(__dirname, "../dist/index.html");
  if (app.isPackaged) {
    mainWindow.loadFile(prodPath);
  } else {
    mainWindow.loadURL(devUrl);
  }
}
ipcMain.handle("get-backend-port", () => backendPort);
const startBackend = () => {
  return new Promise((resolve, reject) => {
    let executable;
    let args;
    let cwd;
    if (app.isPackaged) {
      const binaryName = process.platform === "win32" ? "sAIve-backend.exe" : "sAIve-backend";
      executable = path.join(process.resourcesPath, "backend", binaryName);
      args = [];
      cwd = path.join(process.resourcesPath, "backend");
      if (!fs.existsSync(executable)) {
        const errorMessage = `Backend binary not found at: ${executable}`;
        console.error(errorMessage);
        dialog.showErrorBox("Backend Error", errorMessage);
        reject(new Error(errorMessage));
        return;
      }
    } else {
      executable = "python";
      args = ["main.py"];
      cwd = path.join(__dirname, "..", "..", "Server");
    }
    console.log(`Starting backend: ${executable} ${args.join(" ")} in ${cwd}`);
    pythonProcess = spawn(executable, args, {
      cwd,
      stdio: "pipe"
    });
    let portFound = false;
    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(`Backend: ${output}`);
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
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Backend: ${data}`);
    });
    pythonProcess.on("error", (err) => {
      console.error(`Failed to start backend process: ${err}`);
      dialog.showErrorBox("Backend Error", `Failed to start backend process: ${err.message}`);
      reject(err);
    });
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Backend process exited with code ${code}`);
      }
      if (!portFound) {
        reject(new Error(`Backend exited with code ${code} before reporting a port.`));
      }
    });
    setTimeout(() => {
      if (!portFound) {
        console.error("Backend did not report a port within 30 seconds.");
        reject(new Error("Backend startup timeout."));
      }
    }, 3e4);
  });
};
const checkBackendReady = (callback) => {
  const request = net.request({
    method: "GET",
    protocol: "http:",
    hostname: "127.0.0.1",
    port: backendPort,
    path: "/"
  });
  request.on("response", (response) => {
    callback(response.statusCode === 200);
  });
  request.on("error", () => {
    callback(false);
  });
  request.end();
};
const waitForBackend = (callback) => {
  let attempts = 0;
  const maxAttempts = 30;
  const interval = 1e3;
  const tryConnect = () => {
    checkBackendReady((ready) => {
      if (ready) {
        console.log("Backend is ready. Proceeding to create window.");
        callback();
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`Backend not ready, retrying in ${interval / 1e3}s... (attempt ${attempts})`);
          setTimeout(tryConnect, interval);
        } else {
          const errorMessage = "Backend did not start within the expected time.";
          console.error(errorMessage);
          dialog.showErrorBox("Backend Startup Error", errorMessage);
          app.quit();
        }
      }
    });
  };
  tryConnect();
};
app.whenReady().then(async () => {
  console.log("App is ready. Starting backend...");
  try {
    await startBackend();
    waitForBackend(() => {
      createWindow();
    });
  } catch (err) {
    console.error(`Fatal: ${err.message}`);
    dialog.showErrorBox("Backend Startup Error", err.message);
    app.quit();
  }
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("will-quit", () => {
  if (pythonProcess) {
    console.log("Killing backend process...");
    pythonProcess.kill();
    pythonProcess = null;
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
