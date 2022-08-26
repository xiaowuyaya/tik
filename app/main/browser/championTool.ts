import { BrowserWindow, screen, app, ipcMain } from "electron";
import path from 'path'

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

}