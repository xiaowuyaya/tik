import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from '../service/utils/log'

const logger = log.scope('autoUpdater')
const SERVER_URL = 'http://qiniu.lol-tool.com/latest'

export const checkUpdater = (mainWindow: BrowserWindow) => {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.setFeedURL(SERVER_URL)

  autoUpdater.on('checking-for-update', () => {
    logger.info('checking for update')
    // 转发到主窗口
    mainWindow.webContents.send(
      "listenUpdateInfo",
      {
        type: "info",
        msg: `正在检查更新...`
      }
    )
  })

  autoUpdater.on('update-available', (info) => {
    logger.info(`find new version: ${info.version}`)
    mainWindow.webContents.send(
      "listenUpdateInfo",
      {
        type: "success",
        msg: `发现新版本${info.version}，文件大小${(info.files[0].size / 1048576).toFixed(1)}mb`
      }
    )
    dialog
      .showMessageBox({
        type: "info",
        title: "应用更新",
        message: `发现新版本${info.version}，文件大小${(info.files[0].size / 1048576).toFixed(1)}mb \r\n\r\n ${info.releaseNotes}`,
        buttons: ['推迟', '立即更新']
      })
      .then((buttonIndex) => {
        if (buttonIndex.response == 1) {
          logger.info(`application is downloaded, ready to update ${info.version}`)
          //选择是，开始下载更新
          autoUpdater.downloadUpdate()
        } else {
          logger.info(`user select cancel option, update failed`)
        }
      })
  })

  autoUpdater.on('error', (err) => {
    logger.error(`update thorw an error: ${err}`)
    mainWindow.webContents.send(
      "controller.application.listenUpdateInfo",
      {
        type: "error",
        msg: `检查更新过程中发生异常错误：${err}`
      }
    )
  })

  autoUpdater.on("update-downloaded", (releaseName) => {
    logger.info(`new version is downloaded.`)
    dialog.showMessageBox({
      title: '升级提示！',
      message: '已自动升级为最新版，请等待程序安装完成并重启应用！'
    })
    autoUpdater.quitAndInstall(true, true)
  })

  autoUpdater.checkForUpdatesAndNotify()
}