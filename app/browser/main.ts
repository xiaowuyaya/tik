import { app, BrowserWindow, shell, ipcMain } from 'electron'
import path from 'path'


/* 主进程窗口 */
export const createMainWindow = async () => {
  const win = new BrowserWindow({
    title: 'Tik 英雄联盟对局助手',
    center: true,
    show: false,
    frame: false,
    resizable: false,
    width: 1200,
    height: 720,
    // transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      // devTools:false
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })
  
  const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'index.html'))
  } else {
    win.loadURL(url)
    win.webContents.openDevTools()
  }
  
  return win
}
