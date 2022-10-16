import { join } from 'path';
import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import fs from 'fs'
import _ from 'lodash'

export async function createMainWindow() {

  const preload = join(__dirname, '../../preload/index.js')
  const url = process.env.VITE_DEV_SERVER_URL as string
  const indexHtml = join(process.env.DIST as string, 'index.html')

  let win = new BrowserWindow({
    title: $tools.APP_TITLE,
    icon: join(process.env.PUBLIC as string, 'tray.ico'),
    center: true,
    show: true,
    frame: false,
    resizable: false,
    width: 1320,
    height: 780,
    transparent: false,
    hasShadow: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload,
      enableRemoteModule: true,
      plugins: true,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      nativeWindowOpen: false,
      webSecurity: false
    },
  })

  /* 对当前窗口启用模块 electron remote */
  require("@electron/remote/main").enable(win.webContents)

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    win.webContents.openDevTools()
  }


  // 该窗口的链接都通过浏览器打开，而非在当前窗口
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url)
    return { action: 'deny' }
  })


  ipcMain.on('app-quit', (_event, _args) => {
    app.quit()
    process.exit(0)
  })

  ipcMain.on('main-shrink', (_event, _args) => {
    win.minimize()
  })

  ipcMain.on('main-hide', (_event, _args) => {
    win.hide()
  })

  /* 旧版本黑名单数据导入 */
  ipcMain.handle('main-import-blacklist', (_event, _args) => {
    try {
      const file = dialog.showOpenDialogSync({
        title: '读取旧版黑名单备份文件',
        buttonLabel: '确定',
        filters: [
          {
            // 只读取js文件
            name: 'bans.bak',
            extensions: ['json'],
          },
        ],
      })
      const res = fs.readFileSync(file[0], 'utf-8')
      const bakData = JSON.parse(res)
      let bakList = []
      _.forOwn(bakData, (list, key) => {
        for (let i = 0; i < list.length; i++) {
          if (!list[i].summonerName || !list[i].environment) {
            continue
          }

          let flag = false
          if (bakList.length == 0) {
            bakList.push(list[i])
            continue
          }

          for (let j = 0; j < bakList.length; j++) {
            const element = bakList[j]
            if (element.blackName == list[i].blackName) {
              flag = true
              break
            }
          }
          if (flag) {
            break
          } else {
            bakList.push(list[i])
          }
        }
      })
      for (let k = 0; k < bakList.length; k++) {
        const item = bakList[k]
        if (!item.blackName) {
          throw new Error('备份文件格式有误')
        }
      }
      return {
        code: 200,
        data: bakList
      }
    } catch (err) {
      return {
        code: 500,
        data: null,
        msg: err
      }
    }
  })

  $utils.cache.put('window:main', win.id)
  $tools.log.info(`[window] createChampionRuneWindow done. id: ${win.id}`)

  return win
}