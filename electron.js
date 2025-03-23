import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url"; // Needed to work with import.meta.url

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.disableHardwareAcceleration(); // Disable GPU acceleration to prevent rendering issues

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Use manually defined __dirname
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load your React app (usually the build folder if running in production)
  mainWindow.loadURL("http://localhost:3000"); // or load local HTML file for production

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

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
