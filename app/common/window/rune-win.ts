import { app, BrowserWindow, ipcMain, screen, shell } from "electron"
import { join } from "path"

export async function createChampionRuneWindow() {
  const preload = join(__dirname, '../../preload/index.js')
  const url = `${process.env.VITE_DEV_SERVER_URL}#/champ-tool/rune`
  const indexHtml = join(process.env.DIST as string, 'index.html', '/#/champ-tool/rune')

  let win = new BrowserWindow({
    title: $tools.APP_TITLE,
    icon: join(process.env.PUBLIC as string, 'tray.ico'),
    width: 320,
    height: 652,
    // 设置窗口位置在屏幕右下角
    x: screen.getPrimaryDisplay().workAreaSize.width - 320,
    y: screen.getPrimaryDisplay().workAreaSize.height - 652,
    show: false,
    resizable: false, // 大小调整
    fullscreenable: false, // 是否可以全屏
    transparent: true, // 透明背景
    frame: false, // 显示框体
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
  })

  /* 对当前窗口启用模块 electron remote */
  require("@electron/remote/main").enable(win.webContents)

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    win.webContents.openDevTools()
  }

  // 该窗口的链接都通过浏览器打开，而非在当前窗口
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url)
    return { action: 'deny' }
  })

  ipcMain.on('rune-show', (_event, _args) => {
    win.show()
  })

  ipcMain.on('rune-hide', (_event, _args) => {
    win.hide()
  })

  ipcMain.on('rune-change-data', (_event, args) => {
    win.webContents.send('championRuneWindow.changeData', args)
    win.show()
  })

  $utils.cache.put('window:rune', win.id)
  $tools.log.info(`[window] createChampionRuneWindow done. id: ${win.id}`)

  return win
}