import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { createMainWindow } from './browser/main'
import Store from 'electron-store'
import { createMainWindowIpcListen } from './browser/main.ipc'
Store.initRenderer()

// win7系统关闭app加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// win10+ 设置通知名
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// 单例启动
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}


let mainWindow

const initApp = async () => {
  mainWindow = await createMainWindow()
  createMainWindowIpcListen(mainWindow)
}

app.whenReady().then(async () => {
  await initApp()
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow()
    }
  })
})