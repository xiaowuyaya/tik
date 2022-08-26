import { createSpellsWindow } from './browser/championTool';
import { app, BrowserWindow, Tray } from 'electron'
import { release } from 'os'
import { createMainWindow } from './browser/main'
import { join } from 'path'
import ElectronStore from 'electron-store';
import { createCredentialsService } from '../service/core/credentials';
import { createChampionRuneWindow } from './browser/championTool';
import { createShortcutKeyListen } from '../service/core/shortcutKey';
import { createTray } from './tary';

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

let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null
let championRuneWindow: BrowserWindow | null = null
let spellsWindow: BrowserWindow | null = null

const initApp = async () => {
  mainWindow = await createMainWindow(preload)
  championRuneWindow = await createChampionRuneWindow(preload)
  spellsWindow = await createSpellsWindow(preload)
  await createCredentialsService(mainWindow, championRuneWindow, spellsWindow)
  await createShortcutKeyListen(spellsWindow)
}

app.whenReady().then(async () => {
  await initApp()
  tray = createTray(mainWindow, championRuneWindow, spellsWindow)

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = await createMainWindow(preload)
    }
  })
})
