const { contextBridge: i, ipcRenderer: n } = require("electron");
i.exposeInMainWorld("electronAPI", {
  // Get the dynamically assigned backend port
  getBackendPort: () => n.invoke("get-backend-port"),
  // Show native Electron confirmation dialogs (non-blocking)
  showConfirmDialog: (e) => n.invoke("show-confirm-dialog", e),
  // Generic IPC helpers
  sendMessage: (e, o) => n.send(e, o),
  onMessage: (e, o) => {
    n.on(e, (s, ...r) => o(...r));
  }
});
