import { app, BrowserWindow } from 'electron'
import { release } from 'os'
import { createMainWindow, createMainWindowIpcListen } from './browser/main'
import { join } from 'path'
import ElectronStore from 'electron-store';
import { createCredentialsService } from '../service/core/credentials';
import { appConfig } from '../service/utils/config';
import { createWebSocketConnection } from 'league-connect';

ElectronStore.initRenderer();


// win7系统关闭app加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// win10+ 设置通知名
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// 单例启动
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

const preload = join(__dirname, '../preload/index.js')

// ------------------ MAIN BEGIN ------------------

let mainWindow: BrowserWindow | null = null

const initApp = async () => {
  mainWindow = await createMainWindow(preload)
  createMainWindowIpcListen(mainWindow)
  await createCredentialsService(mainWindow)
}

app.whenReady().then(async () => {
  await initApp()


  const credentials = appConfig.get<any>('credentials');
  const r = await createWebSocketConnection(credentials);
  console.log(r);
  

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow(preload)
    }
  })
})
