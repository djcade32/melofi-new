const { contextBridge, ipcRenderer } = require("electron");

// Expose authentication functions using IPC
contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message) => ipcRenderer.send("message", message),
  onReceiveMessage: (callback) => ipcRenderer.on("message-reply", callback),
  isElectron: true,
  saveAuthToken: (email, token) => ipcRenderer.invoke("saveAuthToken", email, token),
  getAuthToken: (email) => ipcRenderer.invoke("getAuthToken", email),
  clearAuthToken: (email) => ipcRenderer.invoke("clearAuthToken", email),
  saveUser: (email, user) => ipcRenderer.invoke("saveUser", email, user),
  getUser: (email) => ipcRenderer.invoke("getUser", email),
  clearAllAuthTokens: () => ipcRenderer.invoke("clearAllAuthTokens"),
  saveSettings: (settings) => ipcRenderer.invoke("saveSettings", settings),
  getSettings: () => ipcRenderer.invoke("getSettings"),
  saveUserStats: (email, stats) => ipcRenderer.invoke("saveUserStats", email, stats),
  getUserStats: (email) => ipcRenderer.invoke("getUserStats", email),
});
