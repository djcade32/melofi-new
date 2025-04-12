// import { app, BrowserWindow } from "electron";
// import path from "path";
// import { fileURLToPath } from "url"; // Needed to work with import.meta.url

// // Manually define __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // app.disableHardwareAcceleration(); // Disable GPU acceleration to prevent rendering issues

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.mjs"), // Use manually defined __dirname
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   });

//   // Load your React app (usually the build folder if running in production)
//   mainWindow.loadURL("http://localhost:3000"); // or load local HTML file for production

//   mainWindow.on("closed", function () {
//     mainWindow = null;
//   });
// }

// app.on("ready", createWindow);

// app.on("window-all-closed", function () {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", function () {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import authStore.mjs
let authStore = null;

let mainWindow;

async function loadAuthStore() {
  console.log("Loading authStore...");
  try {
    authStore = await import(path.join(__dirname, "../authStore.mjs"));
    console.log("authStore loaded successfully.");
  } catch (error) {
    console.error("Failed to load authStore:", error);
  }
}

// Load authStore before the app is ready
await loadAuthStore();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"), // Point to your compiled preload file
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // Your Next.js frontend
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle authentication requests from preload
ipcMain.handle("saveUserAuth", (_, email, password, token) =>
  authStore?.saveUserAuth(email, password, token)
);
ipcMain.handle("getUserAuth", (_, email) => authStore?.getUserAuth(email));
ipcMain.handle("clearAuthToken", (_, email) => authStore?.clearAuthToken(email));
ipcMain.handle("saveUser", (_, email, user) => authStore?.saveUser(email, user));
ipcMain.handle("getUser", (_, email) => authStore?.getUser(email));
ipcMain.handle("clearAllAuthTokens", () => authStore?.clearAllAuthTokens());
ipcMain.handle("saveSettings", (_, settings) => authStore?.saveSettings(settings));
ipcMain.handle("getSettings", () => authStore?.getSettings());
ipcMain.handle("saveUserStats", (_, email, stats) => authStore?.saveUserStats(email, stats));
ipcMain.handle("getUserStats", (_, email) => authStore?.getUserStats(email));

app.whenReady().then(createWindow);
