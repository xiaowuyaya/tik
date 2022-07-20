const { Storage, Utils } = require('ee-core');
const { app } = require('electron');
const _ = require('lodash');

/* 项目初始化 */
module.exports = {
  async install(eeApp) {
    await checkChampionsData(eeApp);
    checkSettings(eeApp);
    checkBlacklist(eeApp);
  },
};

async function checkChampionsData(eeApp) {
  try {
    const db = Storage.JsonDB.connection('champions').db;
    const versions = await eeApp.curl('https://ddragon.leagueoflegends.com/api/versions.json', { method: 'GET', dataType: 'json' });
    const latestVersion = versions.data[0];
    const championsDataReq = await eeApp.curl(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/zh_CN/champion.json`, {
      method: 'GET',
      dataType: 'json',
    });
    const tempChampionsData = championsDataReq.data.data;
    let champions = {};
    _.forIn(tempChampionsData, (data, enName) => {
      const championId = data.key;
      const cnName = data.name;
      const avatarUrl = `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championId}.png`;
      const key = enName.toLocaleLowerCase();
      const res = { championId, avatarUrl, key };
      champions[cnName] = res;
    });
    db.set('champions', champions).write();
    db.set('version', latestVersion).write();
    eeApp.logger.info(`[check:champions] 英雄数据更新成功，当前数据版本${latestVersion}`);
  } catch (err) {
    eeApp.logger.error(`[check:champions] 发生异常: ${err}`);
  }
}

function checkSettings(eeApp) {
  try {
    const db = Storage.JsonDB.connection('settings').db;
    const settingVersion = db.get('version').value();
    if (_.isEmpty(settingVersion) || !_.isEqual(settingVersion, app.getVersion())) {
      const eeConfig = Utils.getEeConfig();
      const settings = eeConfig.settings;
      db.set('version', settings.version).set('send', settings.send).set('app', settings.app).write();
      eeApp.logger.info(`[check:settings] 设置配置版本: ${settingVersion}, 应用版本: ${app.getVersion()}, 已重置配置文件`);
    }
  } catch (err) {
    eeApp.logger.error(`[check:settings] 发生异常: ${err}`);
  }
}

function checkBlacklist(eeApp) {
  try {
    let isNone = false;
    const db = Storage.JsonDB.connection('blacklist').db;
    if (db.isEmpty().value()) {
      db.set('list', []).write();
      isNone = true;
    }
    eeApp.logger.info(`[check:blacklist] 黑名单校验完成, 是否重置: ${isNone}`);
  } catch (err) {
    eeApp.logger.error(`[check:blacklist] 发生异常: ${err}`);
  }
}