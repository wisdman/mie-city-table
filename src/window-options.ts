import { BrowserWindowConstructorOptions } from "electron"

export const WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
  x: 0, y: 0,
  width: 1920,
  height: 1080,

  center: false,

  closable: false,
  frame: false,
  maximizable: false,
  minimizable: false,
  movable: false,
  resizable: false,
  thickFrame: false,

  autoHideMenuBar: true,
  enableLargerThanScreen: true,
  fullscreen: true,
  fullscreenable: true,
  kiosk: true,
  skipTaskbar: true,

  backgroundColor: "#000000",
  titleBarStyle: "hidden",

  webPreferences: {
    defaultEncoding: "utf8",

    devTools: false,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    enableRemoteModule: false,

    backgroundThrottling: false,
    spellcheck: false,
  },
}
