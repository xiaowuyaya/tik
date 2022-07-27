'use strict'
const { autoUpdater } = require("electron-updater")
const { dialog } = require("electron")

/**
 * 自动升级模块
 */
module.exports = {

  /**
   * 安装
   */
  install (eeApp) {
    eeApp.logger.info('[preload] load autoUpdater module')

    const SERVER_URL = eeApp.config.autoUpdate.options.url
    const mainWindow = eeApp.electron.mainWindow


    // 取消自动下载
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = false

    autoUpdater.setFeedURL(SERVER_URL)

    autoUpdater.on('checking-for-update', () => {
      eeApp.logger.info('[autoUpdater] 正在检查更新')
      // 转发到主窗口
      mainWindow.webContents.send(
        "controller.application.listenUpdateInfo",
        {
          type: "info",
          msg: `正在检查更新...`
        }
      )
    })

    autoUpdater.on('update-available', (info) => {
      eeApp.logger.info(`[autoUpdater] 发现新版本:${info.version}`)
      mainWindow.webContents.send(
        "controller.application.listenUpdateInfo",
        {
          type: "success",
          msg: `发现新版本${info.version}，文件大小${(info.files[0].size / 1048576).toFixed(1)}mb`
        }
      )
      dialog
        .showMessageBox({
          type: "info",
          title: "应用更新",
          message: `发现新版本${info.version}，文件大小${(info.files[0].size / 1048576).toFixed(1)}mb 是否现在更新？`,
          buttons: ['推迟', '立即更新']
        })
        .then((buttonIndex) => {
          if (buttonIndex.response == 1) {
            eeApp.logger.info(`[autoUpdater] 下载完成，正在准备安装版本${info.version}`)
            //选择是，开始下载更新
            autoUpdater.downloadUpdate()
          } else {
            eeApp.logger.info(`[autoUpdater] 用户取消了升级新版本${info.version}`)
          }
        })
    })

    autoUpdater.on('update-not-available', (info) => {
      eeApp.logger.info(`[autoUpdater] 当前已经是最新版本`)
      mainWindow.webContents.send(
        "controller.application.listenUpdateInfo",
        {
          type: "success",
          msg: `当前已经是最新版本`
        }
      )
    })

    autoUpdater.on('error', (err) => {
      eeApp.logger.error(`[autoUpdater] 检查更新过程中发生异常错误：${err}`)
      mainWindow.webContents.send(
        "controller.application.listenUpdateInfo",
        {
          type: "error",
          msg: `检查更新过程中发生异常错误：${err}`
        }
      )
    })

    //监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on("update-downloaded", (releaseName) => {
      eeApp.logger.info(`[autoUpdater] 更新下载完成。`)
      dialog.showMessageBox({
        title: '升级提示！',
        message: '已自动升级为最新版，请等待程序安装完成并重启应用！'
      })
      autoUpdater.quitAndInstall(true, true)
    })

    //检测更新
    autoUpdater.checkForUpdatesAndNotify()

  },
}
