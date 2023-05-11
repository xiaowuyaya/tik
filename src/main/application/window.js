import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell, ipcMain, app } from 'electron'
import { join } from 'path'
import { BROWSER_VIEW_TEMPLATE } from '../tools/constant'
import log from '../tools/log'
import { mainIpc, toosIpc } from './ipc'
import {autoUpdater} from "electron-updater";

export const global = {}

export function initWindows() {
  create({ name: 'main', winOpt: { title: 'Tik 英雄联盟对局助手', width: 1320, height: 760 }, hash: '', show: true, skip: false, ipc: mainIpc })
  create({ name: 'tools', winOpt: { width: 368, height: 680, alwaysOnTop: true }, hash: 'ToolsLayout', show: false, skip: true, ipc: toosIpc })
  create({ name: 'ad', winOpt: { width: 800, height: 540, alwaysOnTop: true }, hash: 'ad', show: false, skip: true, ipc: () => {} })
}

/**
 * 创建窗口
 * @param {{name: string, show: boolean, skip: boolean, winOpt: {width: number, title: string, height: number}, ipc: ipc, hash: string}} options
 * @param {string} options.name 窗体名字
 * @param {Electron.BrowserWindow} options.winOpt BrowserWindow配置
 * @param {boolean} options.show 创建完显示窗体
 * @param {boolean} options.skip 是否显示在任务栏
 * @param {boolean} options.hash 加载路由 如果包含`@NET::`则打开外部链接
 * @param {function} options.ipc ipcMain相关方法
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
export function create(options) {
  const win = new BrowserWindow({ ...BROWSER_VIEW_TEMPLATE, ...options.winOpt })

  /* 对当前窗口启用模块 electron remote */
  require('@electron/remote/main').enable(win.webContents)

  /* 窗体中链接通过浏览器打开 */
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (options.show) {
    win.on('ready-to-show', () => {
      win.show()
    })
  }

  const _URL = process.env['ELECTRON_RENDERER_URL']
  const _indexHtml = join(__dirname, '../renderer/index.html')

  if (options.hash.includes('@NET::')) {
    win.loadURL(options.hash.replace('@NET::', ''))
  } else {
    is.dev ? win.loadURL(options.hash ? `${_URL}#/${options.hash}` : _URL) : win.loadFile(_indexHtml, options.hash ? { hash: options.hash } : {})
  }

  win.setSkipTaskbar(options.skip)

  ipcMain.on('exit-app', () => {
    app.quit()
    process.exit(0)
  })

  ipcMain.on('check-updater', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

  ipcMain.on(`${options.name}-show`, () => {
    win.show()
  })

  ipcMain.on(`${options.name}-hide`, () => {
    win.hide()
  })

  ipcMain.on(`${options.name}-minimize`, () => {
    win.minimize()
  })

  options.ipc()

  global[options.name] = win

  log.info(`createWindow: ${options.name}, done.`)

  return win
}
