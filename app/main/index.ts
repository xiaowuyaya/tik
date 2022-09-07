import {createSpellsWindow} from './browser/championTool';
import {app, BrowserWindow, Tray} from 'electron'
import {release} from 'os'
import {createMainWindow} from './browser/main'
import {join} from 'path'
import ElectronStore from 'electron-store';
import {createCredentialsService} from '../service/core/credentials';
import {createChampionRuneWindow} from './browser/championTool';
import {createShortcutKeyListen} from '../service/core/shortcutKey';
import {createTray} from './tary';
import {checkUpdater} from './autoUpdater'
import { credentialsConfig, panelData} from "../service/utils/config";

ElectronStore.initRenderer();


// win7系统关闭app加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// win10+ 设置通知名
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

const preload = join(__dirname, '../preload/index.js')

// ------------------ MAIN BEGIN ------------------

let mainWindow: BrowserWindow | null = null
let championRuneWindow: BrowserWindow | null = null
let spellsWindow: BrowserWindow | null = null
let appTray: Tray

// 单例模式
if (!app.requestSingleInstanceLock()) {
  app.exit(0)
} else {
  app.on("second-instance", () => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}

const initApp = async () => {
  // clear all credentials
  credentialsConfig.reset('credentials')
  mainWindow = await createMainWindow(preload)
  championRuneWindow = await createChampionRuneWindow(preload)
  spellsWindow = await createSpellsWindow(preload)
  await createCredentialsService(mainWindow, championRuneWindow, spellsWindow)
  await createShortcutKeyListen(spellsWindow)
  appTray = await createTray(mainWindow, championRuneWindow, spellsWindow)
}

app.whenReady().then(async () => {
  await initApp()
  checkUpdater(mainWindow)

  console.log('tray.isDestroyed', appTray.isDestroyed()) // 这一行代码不能删，否则tray会在应用启动几秒内消失

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow(preload)
    }
  })

  app.on('before-quit', () => {
    panelData.reset('panelData')
    credentialsConfig.reset('credentials')
  })

})



