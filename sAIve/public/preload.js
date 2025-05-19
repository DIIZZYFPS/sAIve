// electron/preload.js (or public/preload.js)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Example: expose a function to send a message to the main process
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  // Example: expose a function to receive messages from the main process
  onMessage: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});
