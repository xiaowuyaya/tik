import { BrowserWindow, nativeImage, app, Tray, Menu } from 'electron';
import path from 'path';

export const createTray = (mainWindow: BrowserWindow, championRuneWindow: BrowserWindow, spellsWindow: BrowserWindow) => {
  const iconPath = app.isPackaged ? path.join(app.getPath('exe'), 'resources', 'extraResources', 'img', 'icon.ico') : path.join(__dirname, '../../../', 'resources', 'img', 'icon.ico')

  const icon = nativeImage.createFromPath(iconPath).resize({ width: 24, height: 24 })
  const tray = new Tray(icon)

  tray.setToolTip('Tik 英雄联盟对局助手')

  tray.on('click', () => { showWindow(mainWindow) })

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `版本号: ${app.getVersion()}`,
      enabled: true,
    },
    {
      label: `主界面`,
      click() {
        showWindow(mainWindow)
      },
    },

    {
      label: `符文导入窗口`,
      click() {
        showWindow(championRuneWindow)
        if (championRuneWindow.isVisible()) {
          championRuneWindow.setSkipTaskbar(true)
        }
      },
    },
    {
      label: `手动技能计时窗口`,
      click() {
        showWindow(spellsWindow)
      },
    },
    {
      label: `退出`,
      click() {
        app.quit()
        app.exit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)

  return tray
}


const showWindow = (Window: BrowserWindow) => {
  if (!Window) {
    return
  }
  const visible = Window.isVisible()
  if (!visible) {
    Window.show()
    Window.setSkipTaskbar(false)
  } else {
    Window.hide()
    Window.setSkipTaskbar(true)
  }
}