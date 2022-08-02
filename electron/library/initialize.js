const { Storage, Utils } = require('ee-core');
const { app, BrowserWindow, screen } = require('electron');
const _ = require('lodash');
const c = require('../utils/cache');
const path = require('path');
const { registerShortcutKey } = require('../core/shortcutKey');

/* 项目初始化 */
module.exports = {
  async install(eeApp) {
    await checkDataDragon(eeApp);
    checkSettings(eeApp);
    checkBlacklist(eeApp);
    checkPanelData(eeApp);
    await registerShortcutKey(eeApp);
    await checkOpgg(eeApp);
    checkSpellsWin(eeApp)
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
        img: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${data.image.full}`,
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
    const data = {
      orderList: [],
      chaosList: [],
    };
    // 测试用数据 ./panelData.test.json
    // const json = require('./panelData.test.json');
    // const data = json;

    c.put('panel-data', data);
    eeApp.logger.info(`[check:panel-data] 面板数据重置完成`);
  } catch (err) {
    eeApp.logger.error(`[check:panel-data] 发生异常: ${err}`);
  }
}

async function checkOpgg(eeApp) {
  eeApp.logger.info(`[check:opgg] 正在初始化opgg相关数据`);
  const db = Storage.JsonDB.connection('ddragon').db;
  const opggWebRequest = await eeApp.curl('https://www.op.gg/champions', {
    method: 'GET',
    dataType: 'text',
    headers: {
      'accept-language': 'zh-CN,zh;q=0.9',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    },
  });
  const opggHtmlStr = opggWebRequest.data;
  const buildIdStr = opggHtmlStr.match(/\"buildId\":\"([^\"]*)\"/g)[0]; // "buildId":"QZI7BcDH28BxUKEq6HHGV"
  // 格式有问题 不能通过JSON.parse()转JSON，去除buildId
  const buildId = buildIdStr.replace(/\"buildId\":/g, '').replace(/\"/g, '');

  // 重置opggBuildId
  db.set('opgg', { buildId }).write();
  // 初始化 符文窗口
  let championToolWindow = new BrowserWindow({
    width: 320,
    height: 652,
    // 设置窗口位置在屏幕右下角
    x: screen.getPrimaryDisplay().workAreaSize.width - 300,
    y: screen.getPrimaryDisplay().workAreaSize.height - 610,
    show: false,
    resizable: false, // 大小调整
    fullscreenable: false, // 是否可以全屏
    transparent: true, // 透明背景
    frame: false, // 显示框体
    webPreferences: {
      contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
      nodeIntegration: true,
      allowRunningInsecureContent: true,
    },
  });

  // 获取配置
  const applicationConfig = Utils.getEeConfig();
  const URL = `http://${applicationConfig.mainServer.host}:${applicationConfig.mainServer.port}/#/tools/rune`;
  championToolWindow.loadURL(URL);

  // 开发者工具
  if (!app.isPackaged) {
    championToolWindow.webContents.openDevTools();
  }

  // championToolWindow.setAlwaysOnTop(true)

  db.set('championToolWindowId', championToolWindow.id).write();
  eeApp.logger.info(`[check:opgg] 窗口：championToolWindow 创建完成，id为：${championToolWindow.id}`);
}

function checkSpellsWin(eeApp) {
  eeApp.logger.info(`[check:opgg] 正在初始化召唤师技能提醒窗口`);

  // 初始化 符文窗口
  let spellsWindow = new BrowserWindow({
    width: 600,
    height: 120,
    show: true,
    x: 0,
    y: 0,
    resizable: false, // 大小调整
    fullscreenable: false, // 是否可以全屏
    webPreferences: {
      contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
      nodeIntegration: true,
      allowRunningInsecureContent: true,
    },
  });

  // 获取配置
  const applicationConfig = Utils.getEeConfig();
  const URL = `http://${applicationConfig.mainServer.host}:${applicationConfig.mainServer.port}/#/tools/spells`;
  spellsWindow.loadURL(URL);

  // 开发者工具
  if (!app.isPackaged) {
    spellsWindow.webContents.openDevTools();
  }

  const db = Storage.JsonDB.connection('ddragon').db;
  db.set('spellsWindowId', spellsWindow.id).write();
  eeApp.logger.info(`[check:opgg] spellsWindow 创建完成，id为：${spellsWindow.id}`);
}
