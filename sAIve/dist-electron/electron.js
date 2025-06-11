import { app, BrowserWindow, dialog, net } from "electron";
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
const startBackend = () => {
  const serverPath = app.isPackaged ? path.join(process.resourcesPath, "app", "Server") : path.join(__dirname, "..", "..", "Server");
  const pythonExecutable = process.platform === "win32" ? path.join(serverPath, "venv", "Scripts", "python.exe") : path.join(serverPath, "venv", "bin", "python");
  console.log(`Attempting to start backend with: ${pythonExecutable}`);
  if (!fs.existsSync(pythonExecutable)) {
    const errorMessage = `Python executable not found at: ${pythonExecutable}

Please ensure the virtual environment is set up correctly in the "Server" directory by running:
cd Server
python -m venv venv`;
    console.error(errorMessage);
    dialog.showErrorBox("Backend Error", errorMessage);
    app.quit();
    return;
  }
  pythonProcess = spawn(pythonExecutable, [
    "-m",
    "uvicorn",
    "main:app",
    "--host",
    "127.0.0.1",
    "--port",
    "8000"
  ], {
    cwd: serverPath,
    stdio: "pipe"
  });
  pythonProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data}`);
  });
  pythonProcess.on("error", (err) => {
    console.error(`Failed to start backend process: ${err}`);
    dialog.showErrorBox("Backend Error", `Failed to start backend process: ${err.message}`);
    app.quit();
  });
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Backend process exited with code ${code}`);
    }
  });
};
const checkBackendReady = (callback) => {
  const request = net.request({
    method: "GET",
    protocol: "http:",
    hostname: "127.0.0.1",
    port: 8e3,
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
  const interval = 2e3;
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
app.whenReady().then(() => {
  console.log("App is ready. Starting backend...");
  startBackend();
  waitForBackend(() => {
    createWindow();
  });
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
