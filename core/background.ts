import {app, BrowserWindow, Tray} from 'electron'
import {release} from 'os';
import {createAppTray} from './performance/tray';
import {createAllWindow, createMainWindow} from "./performance/window";
import {createCredentialsService} from './lcu'
/* electron remote 模块主进程初始化 */
require('@electron/remote/main').initialize()

/* Windows 7 关闭GPU加速 */
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

/* 系统通知名称 */
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

/* 保持应用程序单例执行  */
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let tray: Tray | null = null
let mainWin: BrowserWindow | null = null

app.on('ready', async () => {
  /* 创建托盘图标 */
  tray = await createAppTray()
  /* 创建窗口 */
  mainWin = createAllWindow()
  /* 启用lcu服务（当客户端启动时候在启用相关依赖服务） */
  await createCredentialsService(mainWin)
})

app.on('window-all-closed', () => {
  mainWin = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (mainWin) {
    // Focus on the main window if the user tried to open another
    if (mainWin.isMinimized()) mainWin.restore()
    mainWin.focus()
  }
})

app.on('activate', async () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    mainWin = await createMainWindow()
  }
})