const { contextBridge, ipcRenderer } = require("electron");

// Expose IPC renderer methods to the frontend safely
contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message) => ipcRenderer.send("message", message),
  onReceiveMessage: (callback) => ipcRenderer.on("message-reply", callback),
});
