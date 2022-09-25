const { app } = require('electron')
const { browserConfig } = require('../store/index')
const { BrowserWindow, screen } = require('electron')
const { Utils } = require('ee-core')

exports.createChampionRuneWindow = (ctx, preload) => {
  let championRuneWindow = new BrowserWindow({
    width: 320,
    height: 652, // 设置窗口位置在屏幕右下角
    x: screen.getPrimaryDisplay().workAreaSize.width - 320,
    y: screen.getPrimaryDisplay().workAreaSize.height - 652,
    show: false,
    resizable: false, // 大小调整
    fullscreenable: false, // 是否可以全屏
    transparent: true, // 透明背景
    frame: false, // 显示框体
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  })

  const eeConfig = Utils.getEeConfig()
  championRuneWindow.loadURL(`http://${eeConfig.mainServer.host}:${eeConfig.mainServer.port}/#/champ-tool/rune`)

  if (!app.isPackaged) {
    championRuneWindow.webContents.openDevTools()
  }

  browserConfig.set('browserWindows.championRuneWindow', championRuneWindow.id)

  ctx.logger.info(`[browser] createChampionRuneWindow done. id: ${championRuneWindow.id}`)
}

exports.createSpellsWindow = (ctx, preload) => {
  let spellsWindow = new BrowserWindow({
    width: 600,
    height: 120,
    show: false,
    x: 0 + screen.getPrimaryDisplay().workAreaSize.width * 0.15,
    y: 0,
    resizable: false, // 大小调整
    fullscreenable: false, // 是否可以全屏
    transparent: true, // 透明背景
    frame: false, // 显示框体
    webPreferences: {
      preload,
      contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
      nodeIntegration: true,
      allowRunningInsecureContent: true,
    },
  })

  const eeConfig = Utils.getEeConfig()
  spellsWindow.loadURL(`http://${eeConfig.mainServer.host}:${eeConfig.mainServer.port}/#/champ-tool/spells`)

  if (!app.isPackaged) {
    spellsWindow.webContents.openDevTools()
  }

  browserConfig.set('browserWindows.spellsWindow', spellsWindow.id)

  ctx.logger.info(`[browser] createSpellsWindow done. id: ${spellsWindow.id}`)
}
