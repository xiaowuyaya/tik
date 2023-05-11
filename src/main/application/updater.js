import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

/**
 * 更新校验
 */
export function checkAppUpdater() {
  const mainWindow = $winManage.global.main

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.setFeedURL($constant.ROOT_URI)

  autoUpdater.on('checking-for-update', () => {
    $log.info('[autoUpdater] checking for update...')
    mainWindow.webContents.send('autoUpdater', { type: 'info', msg: '正在检查更新...' })
  })

  autoUpdater.on('update-available', info => {
    $log.info(`[autoUpdater] find new version ${info.version}`)
    mainWindow.webContents.send('autoUpdater', {
      type: 'success',
      msg: `发现新版本${info.version}，文件大小${(info.files[0].size / 1048576).toFixed(1)}mb`,
    })
    dialog
      .showMessageBox({
        type: 'info',
        title: '应用更新',
        message: `发现新版本${info.version}，文件大小${(info.files[0].size / 1048576).toFixed(1)}mb \r\n\r\n ${info.releaseNotes}`,
        buttons: ['这次算了', '立即更新'],
        defaultId: '1',
      })
      .then(btnIdx => {
        if (btnIdx.response === 1) {
          $log.info(`[autoUpdater] select: True, application is downloaded, ready to update ${info.version}`)
          //选择是，开始下载更新
          autoUpdater.downloadUpdate()
        } else {
          $log.info(`[autoUpdater] select: False, cancel update`)
        }
      })
      .catch(err => $log.error(`[autoUpdater] updater throw an error: ${err}`))
  })

  autoUpdater.on('error', err => {
    $log.error(`[autoUpdater] updater throw an error: ${err}`)
    mainWindow.webContents.send('autoUpdater', {
      type: 'error',
      msg: `检查更新过程中发生异常错误：${err}`,
    })
  })

  autoUpdater.on('update-downloaded', releaseName => {
    $log.info(`[autoUpdater] latest application downloading done`)
    dialog.showMessageBox({
      title: '应用升级完成',
      message: '已自动升级为最新版，请等待程序安装完成并重启应用！',
    })
    autoUpdater.quitAndInstall(true, true)
  })

  autoUpdater.checkForUpdatesAndNotify()
}
