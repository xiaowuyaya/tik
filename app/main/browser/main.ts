import { appConfig, windowList } from '../../service/utils/config'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import path from 'path'
import {changeSkinConfig, injectSkin} from "../inject";


/* 主进程窗口 */
export const createMainWindow = async (preload: string) => {
  const win = new BrowserWindow({
    title: 'Tik 英雄联盟对局助手',
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


  const dist = path.join(__dirname, '../..')

  const url = app.isPackaged ? `file://${path.join(dist, 'index.html')}` : `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

  win.loadURL(url)

  if (!app.isPackaged) {
    win.webContents.openDevTools()
  }

  createMainWindowIpcListen(win)

  windowList.set('windowList.mainWindow', win.id)

  return win
}

const createMainWindowIpcListen = (mainWindow: BrowserWindow) => {
  // 关闭窗口
  ipcMain.on('mainWin.close', () => {
    const type = appConfig.get('quitMethod')
    if(type == 0){
      app.quit()
      app.exit()
    }else if(type == 1){
      mainWindow.hide()
    }

  })

  // 最小化窗口
  ipcMain.on('mainWin.minisize', () => {
    mainWindow.minimize()
  })

  ipcMain.handle('injectSkin', async () => {
    injectSkin()
  })

  ipcMain.on('changeSkinConfig', (event, data:any)=> {
    changeSkinConfig(data)
  })
}
