import { exec } from 'child_process'
import { app, BrowserWindow, Tray, dialog, nativeImage } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { checkUpdate, createAppTray, createChampionRuneWindow } from './common'
import { createMainWindow } from './common'
import { createCredentialsService } from './core/lcu'

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
  /* 检查游戏是否已启动 */
  // checkGameClient()
  /* 创建托盘图标 */
  tray = await createAppTray()
  /* 创建主窗口 */
  mainWin = await createMainWindow()
  /* 创建符文窗口 */
  await createChampionRuneWindow()
  /* 检查更新 */
  await checkUpdate()
  /* 启用lcu服务（当客户端启动时候在启用某些符文） */
  await createCredentialsService(mainWin)
  /* 创建快捷键监听 */
  const { createHotKeyListen } = require('./core/hotKey') // 延迟加载 防止dialog在app-ready前加载
  await createHotKeyListen()
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

function checkGameClient() {
  $tools.log.info('[checkGameClient] 正在检查游戏是否已经启动')
  exec(`tasklist | findstr "LeagueClient.exe"`, async function (err, stdout, stderr) {
    let processList = []
    if (!err) {
      stdout.split('\n').filter(line => {
        let processMessage = line.trim().split(/\s+/)
        processList.push(processMessage)
      })
    }
    if (processList.length != 0) {
      $tools.log.error('[checkGameClient] 游戏已启动，正在退出应用')
      const iconPath = join(process.env.PUBLIC as string, 'tray.ico')
      const image = nativeImage.createFromPath(iconPath)
      image.isMacTemplateImage = true

      dialog.showMessageBoxSync({
        // type: 'icon',
        icon: image,
        title: `启动失败`,
        message: `检测到游戏客户端已启动`,
        detail: `请先启动${$tools.APP_TITLE}到检查启动界面后再启动游戏`,
        defaultId: 0,
        cancelId: 0,
        buttons: ['确定并退出']
      })
      app.quit()
      process.exit(0)
    }
  })
}

// new window example arg: new windows url
// ipcMain.handle('open-mainWin', (event, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//     },
//   })

//   if (app.isPackaged) {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   } else {
//     childWindow.loadURL(`${url}/#${arg}`)
//     // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
//   }
// })
