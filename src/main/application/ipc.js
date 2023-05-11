import { ipcMain } from 'electron'
import startTikServer from '../core'
import { autoUpdater } from 'electron-updater'

export const mainIpc = () => {
  ipcMain.on('start_server', () => {
    startTikServer()
  })

  ipcMain.on('check_updater', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })
}

export const toosIpc = () => {}
