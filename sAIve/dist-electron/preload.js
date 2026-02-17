const { contextBridge: t, ipcRenderer: o } = require("electron");
t.exposeInMainWorld("electronAPI", {
  // Get the dynamically assigned backend port
  getBackendPort: () => o.invoke("get-backend-port"),
  // Generic IPC helpers
  sendMessage: (e, n) => o.send(e, n),
  onMessage: (e, n) => {
    o.on(e, (s, ...r) => n(...r));
  }
});
