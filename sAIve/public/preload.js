// public/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Get the dynamically assigned backend port
  getBackendPort: () => ipcRenderer.invoke('get-backend-port'),

  // Show native Electron confirmation dialogs (non-blocking)
  showConfirmDialog: (options) => ipcRenderer.invoke('show-confirm-dialog', options),

  // Generic IPC helpers
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  onMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
