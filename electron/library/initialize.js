const { Storage, Utils } = require('ee-core');
const { app } = require('electron');
const _ = require('lodash');
const c = require('../utils/cache');

/* 项目初始化 */
module.exports = {
  async install(eeApp) {
    await checkDataDragon(eeApp);
    checkSettings(eeApp);
    checkBlacklist(eeApp);
    checkPanelData(eeApp);
  },
};

async function checkDataDragon(eeApp) {
  try {
    const db = Storage.JsonDB.connection('ddragon').db;
    const versions = await eeApp.curl('https://ddragon.leagueoflegends.com/api/versions.json', { method: 'GET', dataType: 'json' });
    const latestVersion = versions.data[0];
    const championsDataReq = await eeApp.curl(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/zh_CN/champion.json`, {
      method: 'GET',
      dataType: 'json',
    });
    const tempChampionsData = championsDataReq.data.data;
    let champions = {};
    _.forIn(tempChampionsData, (data, enName) => {
      const cnName = data.name;
      champions[cnName] = {
        championId: data.key,
        avatarUrl: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${enName}.png`,
        key: enName.toLocaleLowerCase(),
      };
    });
    const summonerSpellsDataReq = await eeApp.curl(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/zh_CN/summoner.json`, {
      method: 'GET',
      dataType: 'json',
    });
    const summonerSpellsData = summonerSpellsDataReq.data.data;
    let summonerSpells = {};
    _.forIn(summonerSpellsData, (data, speelName) => {
      summonerSpells[speelName] = {
        id: data.id,
        name: data.name,
        description: data.description,
        img: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${data.img}.png`,
        tooltip: data.tooltip,
        cooldownBurn: data.cooldownBurn,
        key: data.key,
      };
    });

    db.set('champions', champions).write();
    db.set('summonerSpells', summonerSpells).write();
    db.set('version', latestVersion).write();
    eeApp.logger.info(`[check:ddragon] 数据龙更新成功，当前数据版本${latestVersion}`);
  } catch (err) {
    eeApp.logger.error(`[check:ddragon] 发生异常: ${err}`);
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

function checkPanelData(eeApp) {
  try {
    // const data = {
    //   orderList: [],
    //   chaosList: []
    // }
    const json = require('./test.json');
    const data = json;

    c.put('panel-data', data);
    eeApp.logger.info(`[check:panel-data] 面板数据重置完成`);
  } catch (err) {
    eeApp.logger.error(`[check:panel-data] 发生异常: ${err}`);
  }
}
