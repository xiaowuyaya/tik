import { windowList } from "../../service/utils/config";
import { BrowserWindow, screen, app, ipcMain } from "electron";
import path from 'path'
import { sendSpellsInfo } from "../../service/utils/win32_hook";
import { setHis } from "../../service/utils";
import * as api from '../../service/core/api'

export const createChampionRuneWindow = async (preload: string) => {
  let championRuneWindow = new BrowserWindow({
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
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });


  const dist = path.join(__dirname, '../..')


  const url = app.isPackaged ? `file://${path.join(dist, 'index.html')}#/champ-tool/rune` : `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/champ-tool/rune`

  championRuneWindow.loadURL(url)
  
  if (!app.isPackaged) {
    championRuneWindow.webContents.openDevTools()
  }
  
  createChampionRuneWindowIpcListen(championRuneWindow)

  windowList.set('windowList.championRuneWindow', championRuneWindow.id)

  return championRuneWindow
}

export const createSpellsWindow = async(preload: string) => {
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
  });

  const dist = path.join(__dirname, '../..')


  const url = app.isPackaged ? `file://${path.join(dist, 'index.html')}#/champ-tool/spells` : `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/champ-tool/spells`

  spellsWindow.loadURL(url)

  createSpellsWindowIpcListen(spellsWindow)
  
  if (!app.isPackaged) {
    spellsWindow.webContents.openDevTools()
  }

  windowList.set('windowList.spellsWindow', spellsWindow.id)

  return spellsWindow
}

export const createChampionRuneWindowIpcListen = (championRuneWindow: BrowserWindow) => {
  ipcMain.on('championRuneWindow.show', () => {
    championRuneWindow.show()
  })

  ipcMain.on('championRuneWindow.hide', () => {
    championRuneWindow.hide()
  })

  ipcMain.on('championRuneWindow.change', (event, data:any) => {
    championRuneWindow.webContents.send('championRuneWindow.changeData', data);
  })
}

export const createSpellsWindowIpcListen = (spellsWindow: BrowserWindow) => {
  ipcMain.on('spellsWindow.show', () => {
    spellsWindow.show()
  })

  ipcMain.on('spellsWindow.hide', () => {
    spellsWindow.hide()
  })

  ipcMain.on('spellsWindow.handleSpellsTime', async(event, data:any) => {
    const {cooldownBurn, championName, summonerName, spellName} = data
    const status = await api.getGameStatusInfo();
    const curTime = setHis(parseInt(status.gameTime) + cooldownBurn);
    await sendSpellsInfo(spellsWindow, championName, summonerName, spellName, cooldownBurn, curTime);
  })


}