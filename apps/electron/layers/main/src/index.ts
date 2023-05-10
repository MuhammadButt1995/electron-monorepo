import { app } from "electron";
import restoreOrCreateWindow from "@main/mainWindow";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import prepareNext from "electron-next";
import path from "path";

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on("second-instance", restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on("activate", restoreOrCreateWindow);

const dir = path.join(__dirname, "../../../../web");
console.log(`dirname is ${dir}`);

app.on("ready", async () => {
  await prepareNext(dir);
  try {
    restoreOrCreateWindow();
  } catch (e) {
    console.log("Failed create window:", e);
  }
});

/**
 * Create app window when background process will be ready
 
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error("Failed create window:", e));
  */

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  console.log("intsall devtools here");
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}
