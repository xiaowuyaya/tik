const { Storage, Utils } = require("ee-core")
const { app } = require('electron')
const _ = require("lodash")
const { authenticate } = require('league-connect')
const c = require('../utils/cache')


/* 项目初始化 */
module.exports = {

  /**
   * 安装
   * @param {*} eeApp
   */
  async install (eeApp) {
    await checkChampionsData(eeApp)
    checkSettings(eeApp)
    checkBlacklist(eeApp)
    clearnPanelData(eeApp)
    await checkCredentials(eeApp)
  }
}

async function checkChampionsData (eeApp) {
  try {
    const db = Storage.JsonDB.connection('champions').db
    const versions = await eeApp.curl('https://ddragon.leagueoflegends.com/api/versions.json', { method: "GET", dataType: 'json' })
    const latestVersion = versions.data[0]
    const championsDataReq = await eeApp.curl(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/zh_CN/champion.json`, { method: "GET", dataType: 'json' })
    const tempChampionsData = championsDataReq.data.data
    let champions = {}
    _.forIn(tempChampionsData, (data, enName) => {
      const championId = data.key
      const cnName = data.name
      const avatarUrl = `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championId}.png`
      const key = enName.toLocaleLowerCase()
      const res = { championId, avatarUrl, key }
      champions[cnName] = res
    })
    db.set('champions', champions).write()
    db.set('version', latestVersion).write()
    eeApp.logger.info(`[check:champions] 英雄数据更新成功，当前数据版本${latestVersion}`)
  } catch (err) {
    eeApp.logger.error(`[check:champions] 发生异常: ${err}`)
  }
}

function checkSettings (eeApp) {
  try {
    const db = Storage.JsonDB.connection('settings').db
    const settingVersion = db.get('version').value()
    if (_.isEmpty(settingVersion) || !_.isEqual(settingVersion, app.getVersion())) {
      const eeConfig = Utils.getEeConfig()
      const settings = eeConfig.settings
      db.set('version', settings.version)
        .set('send', settings.send)
        .set('app', settings.app)
        .write()
      eeApp.logger.info(`[check:settings] 设置配置版本: ${settingVersion}, 应用版本: ${app.getVersion()}, 已重置配置文件`)
    }
  } catch (err) {
    eeApp.logger.error(`[check:settings] 发生异常: ${err}`)
  }
}

function checkBlacklist (eeApp) {
  try {
    let isNone = false
    const db = Storage.JsonDB.connection('blacklist').db
    if (db.isEmpty().value()) {
      db.set('list', []).write()
      isNone = true
    }
    eeApp.logger.info(`[check:blacklist] 黑名单校验完成, 是否重置: ${isNone}`)
  } catch (err) {
    eeApp.logger.error(`[check:blacklist] 发生异常: ${err}`)
  }
}

async function checkCredentials (eeApp) {
  let credentials = null
  try {
    let authenticationOptions = [{
      windowsShell: 'cmd',
      useDeprecatedWmic: true
    }, {
      windowsShell: 'powershell',
      useDeprecatedWmic: false
    }]
    try {
      credentials = await authenticate(authenticationOptions[0])
    } catch (error) {
      // 部分win7以上电脑没有wimc，采用pws方式获取凭证
      credentials = await authenticate(authenticationOptions[1])
    }
    c.put('credentials', credentials)
    eeApp.logger.info(`[check:credentials] 获取credentials成功`)
  } catch (err) {
    eeApp.logger.info(`[check:credentials] 发送异常: ${err}`)
  }
  // 将结果装发给转发到渲染进程
  eeApp.electron.mainWindow.webContents.send(
    "controller.lcu.enable",
    credentials
  );
}

function clearnPanelData (eeApp) {
  try {
    const db = Storage.JsonDB.connection('panel-data').db
    db.set('orderList', []).set('chaosList', []).write()
    eeApp.logger.info(`[clearn:panel] 已重置面板配置文件`)
  } catch (err) {
    eeApp.logger.error(`[clearn:panel] 发生异常: ${err}`)
  }
}