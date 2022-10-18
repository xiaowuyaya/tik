import { app, BrowserWindow, ipcMain, screen, shell } from "electron"
import { join } from "path"
import { sendSpellsInfo } from "../../core/utils/win32"

export async function createSpellHandleWindow() {
  const preload = join(__dirname, '../../preload/index.js')
  const url = `${process.env.VITE_DEV_SERVER_URL}#/champ-tool/spells`
  const indexHtml = join(process.env.DIST as string, 'index.html', '/#/champ-tool/spells')

  let win = new BrowserWindow({
    title: `${$tools.APP_NAME} 手动技能计时`,
    icon: join(process.env.PUBLIC as string, 'tray.ico'),
    width: 600,
    height: 120,
    // 设置窗口位置在屏幕右下角
    x: 0 + screen.getPrimaryDisplay().workAreaSize.width * 0.15,
    y: 0,
    show: true,
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

  ipcMain.on('spell-info-send', (_event, args) => {
    const {championName, summonerName, spellName, cooldownBurn, curTime} = args
    sendSpellsInfo(championName, summonerName, spellName, cooldownBurn, curTime)
  })

  $utils.cache.put('window:spell', win.id)
  $tools.log.info(`[window] createSpellHandleWindow done. id: ${win.id}`)

  return win
}