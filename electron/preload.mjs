const { contextBridge, ipcRenderer } = require("electron");

// Expose authentication functions using IPC
contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message) => ipcRenderer.send("message", message),
  onReceiveMessage: (callback) => ipcRenderer.on("message-reply", callback),
  isElectron: true,
  saveUserAuth: (email, password, token) =>
    ipcRenderer.invoke("saveUserAuth", email, password, token),
  getUserAuth: (email) => ipcRenderer.invoke("getUserAuth", email),
  clearAuthToken: (email) => ipcRenderer.invoke("clearAuthToken", email),
  saveUser: (email, user) => ipcRenderer.invoke("saveUser", email, user),
  getUser: (email) => ipcRenderer.invoke("getUser", email),
  clearAllAuthTokens: () => ipcRenderer.invoke("clearAllAuthTokens"),
  saveUserStats: (email, stats) => ipcRenderer.invoke("saveUserStats", email, stats),
  getUserStats: (email) => ipcRenderer.invoke("getUserStats", email),
});
