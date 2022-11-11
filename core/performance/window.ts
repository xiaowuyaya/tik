import {app, BrowserWindow, ipcMain, shell} from "electron";
import {join} from "path";

const preload = join(__dirname, '../preload.js')
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(process.env.DIST as string, 'index.html')

const BROWSER_CONFIG = {
  icon: join(process.env.PUBLIC as string, 'icon_32.ico'),
  center: true,
  show: false,
  frame: false,
  resizable: false,
  transparent: false,
  hasShadow: true,
  backgroundColor: '#00000000',
  webPreferences: {
    preload,
    enableRemoteModule: true,
    plugins: true,
    nodeIntegration: true,
    contextIsolation: false,
    backgroundThrottling: false,
    nativeWindowOpen: false,
    webSecurity: false
  },
}

export function createAllWindow() {
  const mainWindow = createMainWindow()
  createCheckLaunchWindow()
  return mainWindow
}

export function createMainWindow() {
  let win = new BrowserWindow({
    ...BROWSER_CONFIG,
    title: $consts.APP_TITLE,
    width: 1320,
    height: 780,
  })

  /* 对当前窗口启用模块 electron remote */
  require("@electron/remote/main").enable(win.webContents)

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    win.webContents.openDevTools()
  }

  win.webContents.setWindowOpenHandler(({url}) => {
    if (url.startsWith('https://')) shell.openExternal(url)
    return {action: 'deny'}
  })

  ipcMain.on('app-quit', (_event, _args) => {
    app.quit()
    process.exit(0)
  })

  ipcMain.on('main-shrink', (_event, _args) => {
    win.minimize()
  })

  ipcMain.on('main-hide', (_event, _args) => {
    win.hide()
  })

  $cache.put('window:main', win.id)
  $log.info(`[window] createMainWindow done. id: ${win.id}`)

  return win
}

export function createCheckLaunchWindow() {
  let win = new BrowserWindow({
    ...BROWSER_CONFIG,
    title: $consts.APP_TITLE,
    show: true,
    transparent: true,
    width: 720,
    height: 400,
  })

  require("@electron/remote/main").enable(win.webContents)

  if (app.isPackaged) {
    win.loadFile(indexHtml, {
      hash: '/check_launch'
    })
  } else {
    win.loadURL(`${url}#/check_launch`)
    // win.webContents.openDevTools()
  }

  win.webContents.setWindowOpenHandler(({url}) => {
    if (url.startsWith('https://')) shell.openExternal(url)
    return {action: 'deny'}
  })

  $cache.put('window:check-launch', win.id)
  $log.info(`[window] checkLaunchWindow done. id: ${win.id}`)

  return win
}