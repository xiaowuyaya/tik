'use strict'

const { Tray, Menu, app, BrowserWindow } = require('electron')
const path = require('path')
const { browserConfig } = require('../store/index')
const { Utils } = require('ee-core')

module.exports = {
  install(ctx) {
    ctx.logger.info('[preload] load tray module')
    const trayConfig = ctx.config.tray
    const mainWindow = ctx.electron.mainWindow

    const championRuneWindowId = browserConfig.get('browserWindows.championRuneWindow')
    const championRuneWindow = BrowserWindow.fromId(championRuneWindowId)

    const spellsWindowId = browserConfig.get('browserWindows.spellsWindow')
    const spellsWindow = BrowserWindow.fromId(spellsWindowId)

    // 托盘图标
    let iconPath = path.join(Utils.getExtraResourcesDir(), 'icons', 'tray.ico')

    // 托盘菜单功能列表
    let trayMenuTemplate = [
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
          ctx.appQuit()
        },
      },
    ]

    // 点击关闭，最小化到托盘
    mainWindow.on('close', event => {
      if (ctx.electron.extra.closeWindow == true) {
        return
      }
      mainWindow.hide()
      event.preventDefault()
    })

    // 测试发现：创建的Tray对象实例变量和app.whenReady()在同一模块中定义才行
    // 赋值给ctx.electron.tray，已在框架ee-core包中定义
    // 如果赋值给其它变量，可能出现异常，估计是electron的bug

    ctx.electron.tray = new Tray(iconPath)
    let appTray = ctx.electron.tray

    appTray.setToolTip(trayConfig.title) // 托盘标题
    appTray.on('click', function () {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    })
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    appTray.setContextMenu(contextMenu)
  },
}

const showWindow = Window => {
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
