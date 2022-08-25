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
