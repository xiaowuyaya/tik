import initMain from './application/init'
import { release } from 'os'
import { app, BrowserWindow } from 'electron'
import { APP_ID } from './tools/constant'
import log from './tools/log'
import { optimizer } from '@electron-toolkit/utils'
import createTray from './application/tray'
import { initWindows } from './application/window'
import { checkAppUpdater } from './application/updater'
import { getLeagueClientWindowInfo } from './tools/dll'

initMain()

/* Windows 7 关闭GPU加速 */
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

/* 系统通知名称 */
if (process.platform === 'win32') app.setAppUserModelId(APP_ID)

// 单例启动应用
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// 记录程序奔溃日志
process.on('uncaughtException', err => {
  log.error(`crash reporter: ${err}`)
})

let tray = null

app.whenReady().then(async () => {
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  tray = createTray() // 创建托盘对象
  console.log(`tray status: `, !tray.isDestroyed() ? 'normal' : 'destroyed') // <-- dont remove!

  /* 创建主窗口 */
  initWindows()
  await checkAppUpdater() // 检查更新
  toolsFlowGame()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      initWindows()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function toolsFlowGame() {
  const toolsWin = $winManage.global.tools
  setInterval(() => {
    if (toolsWin.isVisible() && $store.appConfigStore.get('champToolWin.flowGameWin')) {
      const info = getLeagueClientWindowInfo()
      const winSize = toolsWin.getSize()
      toolsWin.setPosition(info.left + info.width, info.top + (info.height - winSize[1]))
    }
  }, 200)
}
