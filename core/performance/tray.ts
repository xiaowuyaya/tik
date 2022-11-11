import { app, BrowserWindow, Menu, MenuItemConstructorOptions, nativeImage, Tray } from "electron"
import path from "path"

export async function createAppTray() { 
  const title = $consts.APP_TITLE
  const iconPath = path.join(process.env.PUBLIC as string, 'icon_32.ico')
  const image = nativeImage.createFromPath(iconPath)
  image.isMacTemplateImage = true
  const tray = new Tray(image)
  tray.setToolTip(title)
  tray.setContextMenu(Menu.buildFromTemplate(trayMenus))

  tray.on('click', () => {
    const mainWindow = BrowserWindow.fromId($cache.get('window:main'))
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  return tray
}

const trayMenus: MenuItemConstructorOptions[] = [
  {
    label: `版本 ${$consts.APP_VERSION}`,
    click: (): void => { },
    type: 'normal'
  },

  { type: 'separator' },

  {
    label: `主窗口显示/隐藏`,
    click: (): void => {
      const mainWind = BrowserWindow.fromId($cache.get('window:main'))
      if (mainWind.isVisible()) {
        mainWind.hide()
      } else {
        mainWind.show()
      }
    }
  },

  { type: 'separator' },

  {
    label: '关于',
    click: (): void => {
    }
  },

  { type: 'separator' },

  {
    label: '退出', click: (): void => {
      app.quit()
      process.exit(0)
    }
  },
]