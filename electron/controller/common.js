'use strict'

const { appConfig, browserConfig } = require('../store')
const { autoUpdater } = require('electron-updater')
const { dialog, BrowserWindow, app } = require('electron')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const R = require('../utils/res')
const api = require('../core/api')
const { setHis } = require('../utils/index')
const getMac = require('getmac').default
const sendSpellsInfo = require('../utils/win32')
const Controller = require('ee-core').Controller
const Utils = require('ee-core').Utils
const c = require('../utils/cache')

class CommonController extends Controller {
  constructor(ctx) {
    super(ctx)
  }

  mainWindowClose(_args, _event) {
    const quitType = appConfig.get('quitMethod')
    if (quitType == 0) this.app.appQuit()
    if (quitType == 1) this.app.electron.mainWindow.hide()
  }

  mainWindowMinisize(_args, _event) {
    this.app.electron.mainWindow.minimize()
  }

  checkUpdate(_args, _event) {
    autoUpdater.checkForUpdatesAndNotify()
  }

  championRuneWindowHandle(args, _event) {
    const championRuneWindowId = browserConfig.get('browserWindows.championRuneWindow')
    const championRuneWindow = BrowserWindow.fromId(championRuneWindowId)
    if (args.type == 'show') championRuneWindow.show()
    if (args.type == 'hide') championRuneWindow.hide()
  }

  championRuneWindowChangeData(args, _event) {
    const championRuneWindowId = browserConfig.get('browserWindows.championRuneWindow')
    const championRuneWindow = BrowserWindow.fromId(championRuneWindowId)
    championRuneWindow.show()
    championRuneWindow.webContents.send('championRuneWindow.changeData', args)
  }

  spellsWindowHandle(args, _event) {
    const spellsWindowId = browserConfig.get('browserWindows.spellsWindow')
    const spellsWindow = BrowserWindow.fromId(spellsWindowId)
    if (args.type == 'show') spellsWindow.show()
    if (args.type == 'hide') spellsWindow.hide()
  }

  async spellsWindowHandleSpellsTime(args, _event) {
    const { cooldownBurn, championName, summonerName, spellName } = args
    const status = await api.getGameStatusInfo()
    const curTime = setHis(parseInt(status.gameTime) + cooldownBurn)
    sendSpellsInfo(this, championName, summonerName, spellName, cooldownBurn, curTime)
  }

  appConfig(_args, _event) {
    return {
      version: app.getVersion(),
      mac: getMac(),
      logDir: Utils.getLogDir(),
      configDir: path.join(app.getPath('userData'), 'config.json'),
    }
  }

  getCredentials(_args, _event) {
    return c.get('credentials')
  }

  getCache(args, _event) {
    return c.get(args.cache)
  }

  importBlacklistData(_args, _event) {
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
      return R.success(bakList)
    } catch (err) {
      return R.fail(null, err)
    }
  }
}

CommonController.toString = () => '[class CommonController]'
module.exports = CommonController
