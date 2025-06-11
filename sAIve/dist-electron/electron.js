import { app, BrowserWindow, dialog } from "electron";
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
  const devUrl = "http://localhost:5173/";
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
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
  pythonProcess.on("close", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
};
app.whenReady().then(() => {
  startBackend();
  createWindow();
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
