import { app, BrowserWindow, powerSaveBlocker, globalShortcut } from "electron"
import { WINDOW_OPTIONS } from "./window-options"

import { Logger } from "./logger"
const LOG = new Logger("MAIN")

const ENGINE = "https://localhost"
const ENGINE_APP =`${ENGINE}/app`

const VIEW_PORTS = [{
  id: "table",
  url: "table.html",
  x: 0,
},{
  id: "screen",
  url: "screen.html",
  x: 1920,
}]

const powerSaveID = powerSaveBlocker.start("prevent-display-sleep")

app.commandLine.appendSwitch("disable-http-cache")
app.commandLine.appendSwitch("disable-http2")
app.commandLine.appendSwitch("disable-renderer-backgrounding")
app.commandLine.appendSwitch("disk-cache-size","0")
app.commandLine.appendSwitch("force-device-scale-factor", "1")
app.commandLine.appendSwitch("high-dpi-support", "1")
app.commandLine.appendSwitch("ignore-certificate-errors")
app.commandLine.appendSwitch("ignore-connections-limit", `localhost`)
app.commandLine.appendSwitch("ignore-gpu-blacklist")
app.commandLine.appendSwitch("no-proxy-server")
app.commandLine.appendSwitch("remote-debugging-port", "1337")

app.on("ready", main)
app.on("window-all-closed", exit)

let windows: Array<BrowserWindow> = []

function exit() {
  windows.forEach(w => w.close())
  powerSaveBlocker.stop(powerSaveID)
  app.exit()
}

function reload() {
  windows.forEach(w => w.webContents.reloadIgnoringCache())
}

async function initViewPorts() {
  for (const {id, x, url} of VIEW_PORTS) {
    LOG.DEBUG(`Init display ${id}`)

    let win: BrowserWindow | null = new BrowserWindow({...WINDOW_OPTIONS, x})

    win.on("closed", () => {
      windows = windows.filter(w => w !== win)
      win = null
    })

    win.webContents.on("console-message", (_, level, message, line, file) => LOG.byLevel(level, `${message} (${file}:${line})`))

    win.removeMenu()

    const URL = `${ENGINE_APP}/${url}`
    LOG.DEBUG(`Display ${id}: ${URL}`)
    win.loadURL(URL)
    win.show()
  }
}

async function initGlobalShortcut() {
  globalShortcut.register("F5", reload)
  globalShortcut.register("CommandOrControl+Q", exit)
}

async function main() {
  await initViewPorts()
  await initGlobalShortcut()
}
