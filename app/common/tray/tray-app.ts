import {nativeImage, Tray, app, Menu, BrowserWindow} from "electron";
import path from 'path'
import {trayMenus} from './tray-menu'

export async function createAppTray() {
  const title = $tools.APP_TITLE
  const iconPath = path.join(process.env.PUBLIC as string, 'tray.ico')

  const image = nativeImage.createFromPath(iconPath)
  image.isMacTemplateImage = true
  const tray = new Tray(image)
  tray.setToolTip(title)
  tray.setContextMenu(Menu.buildFromTemplate(trayMenus))

  tray.on('click', () => {
    const mainWindow = BrowserWindow.fromId($utils.cache.get('window:main'))
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  return tray
}