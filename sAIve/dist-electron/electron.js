import { app, dialog, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
const startBackend = () => new Promise((resolve, reject) => {
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
    return reject(new Error(errorMessage));
  }
  const startupTimeout = setTimeout(() => {
    reject(new Error("Backend startup timed out after 20 seconds."));
  }, 2e4);
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
  const onData = (data) => {
    const message = data.toString();
    console.log(`Backend: ${message}`);
    if (message.includes("Uvicorn running on")) {
      clearTimeout(startupTimeout);
      console.log("Backend is ready. Proceeding to create window.");
      resolve();
    }
  };
  pythonProcess.stdout.on("data", onData);
  pythonProcess.stderr.on("data", onData);
  pythonProcess.on("error", (err) => {
    clearTimeout(startupTimeout);
    console.error("Failed to start backend process.", err);
    reject(err);
  });
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Backend process exited with code ${code}`);
    }
  });
});
app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();
  } catch (error) {
    console.error("Failed to start backend, quitting application.", error);
    dialog.showErrorBox("Backend Startup Error", error.message);
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
