import { dialog } from "electron";
import { autoUpdater } from "electron-updater";

export async function checkUpdate() {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.setFeedURL($tools.UPDATE_SERVER)

  autoUpdater.on('checking-for-update', () => {
    $tools.log.info('[autoUpdater] checking for update...')
  })

  autoUpdater.on('update-available', info => {
    $tools.log.info(`[autoUpdater] find new version ${info.version}`)

    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message:
        `发现新版本${info.version}，文件大小${(info.files[0].size as number / 1048576).toFixed(1)}mb \r\n\r\n ` +
        info.releaseNotes,
      buttons: ['这次算了', '立即更新'],
    }).then(btnIdx => {
      if (btnIdx.response == 1) {
        $tools.log.info(`[autoUpdater] select: True, application is downloaded, ready to update ${info.version}`)
        //选择是，开始下载更新
        autoUpdater.downloadUpdate()
      } else {
        $tools.log.info(`[autoUpdater] select: False, cancel update`)
      }
    }).catch(err => $tools.log.error(`[autoUpdater] updater thorw an error: ${err}`))
  })

  autoUpdater.on('error', err => {
    $tools.log.error(`[autoUpdater] updater thorw an error: ${err}`)
  })

  autoUpdater.on('update-downloaded', releaseName => {
    $tools.log.info(`[autoUpdater] latest application downloading done`)
    dialog.showMessageBox({
      title: '应用升级完成',
      message: '已自动升级为最新版，请等待程序安装完成并重启应用！',
    })
    autoUpdater.quitAndInstall(true, true)
  })

  autoUpdater.checkForUpdatesAndNotify()
}