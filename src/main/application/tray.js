import { Menu, nativeImage, Tray, app, shell } from 'electron'
import { join } from 'path'
import * as winManage from './window'
import { HOME_URI } from '../tools/constant'
import log from '../tools/log'

export default function createTray() {
  const iconImage = nativeImage.createFromPath(join(process.env.RESOURCE, 'icon_32.ico'))
  const tray = new Tray(iconImage)

  tray.setToolTip('Tik 英雄联盟对局助手')
  tray.setContextMenu(Menu.buildFromTemplate(trayMenus))

  tray.on('click', () => {
    const mainWindow = winManage.global.main
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
  log.info(`createTray: done.`)
  return tray
}

const trayMenus = [
  {
    label: `版本: ${app.getVersion()}`,
    click: () => {},
    type: 'normal',
  },
  { type: 'separator' },
  {
    label: '英雄数据窗口',
    click: () => {
      const toolsWin = winManage.global.tools
      toolsWin.reload()
      toolsWin.show()
    },
  },
  { type: 'separator' },
  {
    label: '官网',
    click: () => {
      shell.openExternal(HOME_URI)
    },
  },
  { type: 'separator' },
  {
    label: '退出',
    click: () => {
      app.quit()
      process.exit(0)
    },
  },
]
