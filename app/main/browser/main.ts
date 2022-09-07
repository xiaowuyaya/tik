import {appConfig, blacklist, windowList} from '../../service/utils/config'
import {app, BrowserWindow, shell, ipcMain, dialog} from 'electron'
import path from 'path'
import {changeSkinConfig, injectSkin} from "../inject";
import fs from 'fs'
import _ from 'loadsh'


/* 主进程窗口 */
export const createMainWindow = async (preload: string) => {
  const win = new BrowserWindow({
    title: 'Tik 英雄联盟对局助手',
    center: true,
    show: false,
    frame: false,
    resizable: false,
    width: 1200,
    height: 720,
    transparent: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })


  const dist = path.join(__dirname, '../..')

  const url = app.isPackaged ? `file://${path.join(dist, 'index.html')}` : `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

  win.loadURL(url)

  if (!app.isPackaged) {
    win.webContents.openDevTools()
  }

  createMainWindowIpcListen(win)

  windowList.set('windowList.mainWindow', win.id)

  return win
}

const createMainWindowIpcListen = (mainWindow: BrowserWindow) => {
  // 关闭窗口
  ipcMain.on('mainWin.close', () => {
    const type = appConfig.get('quitMethod')
    if(type == 0){
      app.exit(0)
    }else if(type == 1){
      mainWindow.hide()
    }

  })

  // 最小化窗口
  ipcMain.on('mainWin.minisize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('mainWin.importBlacklistData', (event, data:any) => {
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
      });
      const res = fs.readFileSync(file[0], 'utf-8');
      const bakData = JSON.parse(res)
      let bakList = []
      _.forOwn(bakData, (list, key) => {
        for (let i = 0; i < list.length; i++) {

          if(!list[i].summonerName || !list[i].environment) {
            continue
          }

          let flag = false
          if(bakList.length == 0) {
            bakList.push(list[i])
            continue
          }

          for (let j = 0; j < bakList.length; j++) {
            const element = bakList[j];
            if(element.blackName == list[i].blackName){
              flag = true
              break
            }
          }
          if (flag) {
            break
          }else{
            bakList.push(list[i])
          }
        }
      })
      for (let k = 0; k < bakList.length; k++) {
        const item = bakList[k];
        if(!item.blackName){
          throw new Error('备份文件格式有误')
        }
      }
      event.reply('importBlacklistData.reply', {code: 200, msg: null, data: bakList})
    } catch (err) {
      event.reply('importBlacklistData.reply', {code: 500, msg: err, data: null})
    }
  })

  ipcMain.handle('injectSkin', async () => {
    injectSkin()
  })

  ipcMain.on('changeSkinConfig', (event, data:any)=> {
    changeSkinConfig(data)
  })
}
