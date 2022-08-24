import { app, BrowserWindow, shell, ipcMain } from 'electron'
import path from 'path'


/* 主进程窗口 */
export const createMainWindow = async (preload: string) => {
  const win = new BrowserWindow({
    title: 'Eko 英雄联盟工具箱',
    center: true,
    show: false,
    frame: false,
    resizable: false,
    width: 1200,
    height: 720,
    transparent: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
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

export const createMainWindowIpcListen = (mainWindow: BrowserWindow) => {
  // 关闭窗口
  ipcMain.on('mainWin.close', ()=> {
    app.quit()
  })

  // 最小化窗口
  ipcMain.on('mainWin.minisize', ()=> {
    mainWindow.minimize()
  })
}
