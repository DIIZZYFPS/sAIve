// public/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Get the dynamically assigned backend port
  getBackendPort: () => ipcRenderer.invoke('get-backend-port'),

  // Generic IPC helpers
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  onMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
