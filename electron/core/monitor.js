const { Storage, Utils } = require('ee-core');
const { Notification, BrowserWindow } = require('electron');
const { getClient, getWs } = require('../utils/league-connect');
const c = require('../utils/cache');
const _ = require('lodash');
const GameEventListen = require('./GameEventListen');

/**
 * 客户端监听
 */
exports.registerClient = (eeApp) => {
  eeApp.logger.info(`[monitor] 正在注册客户端监听`);

  let c = getClient();
  if (!c) {
    eeApp.logger.error('[monitor] 客户端监听注册失败');
    return;
  }

  c.on('disconnect', () => {
    // 客户端退出则也退出;
    eeApp.logger.info('[monitor] 检测到游戏退出，应用程序也即将关闭。');
    eeApp.appQuit();
  });

  c.start();
};

/**
 * 客户端ws监听
 */
exports.registerWebsocket = async (eeApp) => {
  eeApp.logger.info(`[monitor] 正在注册客户端Websocket监听`);

  const ws = await getWs();
  if (!ws) {
    eeApp.logger.error('[monitor] 客户端Websocket监听注册失败');
    return;
  }

  const SUMMONER = await eeApp.service.lcu.getSummonerInfo();
  eeApp.logger.info(`当前登入账号为:${SUMMONER.displayName}, 所在大区:${SUMMONER.environment}`);
  // 获取玩家id
  const { summonerId } = SUMMONER;
  const gameEventListen = new GameEventListen(eeApp);
  // 玩家状态订阅
  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, event) => {
    // 状态转发到渲染进程
    eeApp.electron.mainWindow.webContents.send('controller.lcu.listenPlayerStatus', data);
    eeApp.logger.info(`[lcuMonitor] STATUS: ${data}`);
    handleStatus(data, eeApp, gameEventListen, SUMMONER.displayName);
  });
  // 玩家actions订阅
  ws.subscribe('/lol-champ-select/v1/session', async (data, event) => {
    // 当session变化时发生数据变化,英雄数据展示
    showDataInChampionToolWindow(data, summonerId);

    const db = Storage.JsonDB.connection('settings').db;
    const appSettings = db.get('app').value();
    if (!appSettings.rankAuto.pick.enable && !appSettings.rankAuto.ban.enable) return;

    let cellId, position;
    for (let i = 0; i < data.myTeam.length; i++) {
      const order = data.myTeam[i];
      if (order.summonerId == summonerId) {
        cellId = order.cellId;
        position = order.assignedPosition;
        break;
      }
    }

    if (!position) return;

    const actions = data.actions;

    if (data.timer.phase == 'PLANNING') return;

    if (data.timer.phase == 'BAN_PICK') {
      if (appSettings.rankAuto.ban.enable) {
        let banActionId;
        for (let i = 0; i < actions[0].length; i++) {
          const action = actions[0][i];
          if (action.actorCellId == cellId) {
            banActionId = action.id;
            if (!action.completed) {
              for (let i = 0; i < appSettings.rankAuto.ban[position].length; i++) {
                const select = appSettings.rankAuto.ban[position][i];
                const res = await eeApp.service.lcu.confirmChampionByAction(banActionId, select, appSettings.confirm);
                if (res.errorCode != 'RPC_ERROR') {
                  // eeApp.logger.info(`[monitor] 排位秒禁用成功`);
                  break;
                }
              }
              return;
            }
          }
        }
      }

      if (appSettings.rankAuto.pick.enable) {
        let pickActionId;
        for (let i = 2; i < actions.length; i++) {
          const actionItem = actions[i];
          for (let j = 0; j < actionItem.length; j++) {
            const action = actionItem[j];
            if (action.actorCellId == cellId) {
              pickActionId = action.id;
              if (!action.completed) {
                for (let i = 0; i < appSettings.rankAuto.pick[position].length; i++) {
                  const select = appSettings.rankAuto.pick[position][i];
                  const res = await eeApp.service.lcu.confirmChampionByAction(pickActionId, select, appSettings.confirm);
                  if (res.errorCode != 'RPC_ERROR') {
                    // eeApp.logger.info(`[monitor] 排位选用成功`);
                    break;
                  }
                }
                return;
              }
            }
          }
        }
      }
    }
  });
};

// 处理玩家状态事件
const handleStatus = async (status, eeApp, gameEventListen, summonerName) => {
  if (status == 'Matchmaking') {
    return;
  }
  if (status == 'ReadyCheck') {
    c.del('panel-data');
    eeApp.logger.info('[monitor:ReadyCheck] 面板数据已清空');

    const db = Storage.JsonDB.connection('settings').db;
    const appSettings = db.get('app').value();
    if (appSettings.accept) await eeApp.service.lcu.acceptMatchmaking();
    return;
  }
  if (status == 'ChampSelect') {
    const db = Storage.JsonDB.connection('settings').db;
    const appSettings = db.get('app').value();
    eeApp.logger.info(`[monitor:ChampSelect] 匹配自动秒选 ${appSettings.normalAuto.pick}, 英雄设置为 ${appSettings.normalAuto.pickSelect}`);
    if (appSettings.normalAuto.pick) {
      for (var i = 0; i < appSettings.normalAuto.pickSelect.length; i++) {
        const res = await eeApp.service.lcu.confirmChampionById(appSettings.normalAuto.pickSelect[i], appSettings.confirm);
        if (res.errorCode != 'RPC_ERROR') {
          eeApp.logger.info(`[monitor:ChampSelect] 自动秒禁用成功`);
          break;
        }
      }
    }
    eeApp.logger.info(`[monitor:ChampSelect] 征召自动禁用 ${appSettings.normalAuto.ban}, 英雄设置为 ${appSettings.normalAuto.banSelect}`);
    if (appSettings.normalAuto.ban) {
      for (var i = 0; i < appSettings.normalAuto.banSelect.length; i++) {
        const res = await eeApp.service.lcu.confirmChampionById(appSettings.normalAuto.banSelect[i], appSettings.confirm);
        if (res.errorCode != 'RPC_ERROR') {
          eeApp.logger.info(`[monitor:ChampSelect] 自动秒禁用成功`);
          break;
        }
      }
    }
    return;
  }
  if (status == 'InProgress') {
    // 隐藏符文导入窗口
    await eeApp.service.opgg.showChampionToolWindow({ show: false })
    // 英雄时刻
    const enableHeroScreenshot = Utils.getEeConfig().settings.app.heroScreenshot;
    if (enableHeroScreenshot) await gameEventListen.eventListenStart(summonerName);
    // 召唤师技能监控
    await gameEventListen.spellListenStart();
  }
  if (status == 'PreEndOfGame') {
    // 英雄时刻
    const enableHeroScreenshot = Utils.getEeConfig().settings.app.heroScreenshot;
    if (enableHeroScreenshot) gameEventListen.stop();
  }
};

/**
 * 在小窗口中展示数据
 * @param {*} data session
 * @param {*} summonerId
 * @returns
 */
// 上个事件自己选择的英雄id
let LAST_SELECT_CHAMPION_ID = 0;
function showDataInChampionToolWindow(data, summonerId) {
  // 不处理非ban pick 阶段的事件
  if (data.timer.phase != 'BAN_PICK') {
    return;
  }

  const settingsDB = Storage.JsonDB.connection('settings').db;
  let appSetting = settingsDB.get('app').value();

  // 是否开启了小窗口
  if (!appSetting.showChampTool) {
    return;
  }

  let cellId; // 楼层
  let position; // 位置
  // let pickActionId // 选择事件的action id

  // 英雄配置信息
  const ddragonDB = Storage.JsonDB.connection('ddragon').db;
  let championData = ddragonDB.get('champions').value();
  // 窗口信息
  const windowId = ddragonDB.get('championToolWindowId').value();
  const win = BrowserWindow.fromId(windowId);

  for (let i = 0; i < data.myTeam.length; i++) {
    const order = data.myTeam[i];
    if (order.summonerId == summonerId) {
      cellId = order.cellId;
      position = order.assignedPosition;
      break;
    }
  }

  // 获取事件数组
  const actions = data.actions;

  for (let i = 0; i < actions.length; i++) {
    const actionItem = actions[i];

    for (let j = 0; j < actionItem.length; j++) {
      const action = actionItem[j];

      // 如果当前事件类型不是pick就跳过，
      if (action.type != 'pick') {
        continue;
      }

      // 找到属于自己的pick actions
      if (action.actorCellId == cellId) {
        // logger.info(`[lcuRegister] 获取到当前选择英雄的action`)
        // pickActionId = action.id;

        /** service begin */
        // 判断是否有表明英雄
        if (action.championId != 0) {
          // 与上次选择的英雄相同则跳过此次 防止重复请求
          if (action.championId == LAST_SELECT_CHAMPION_ID) {
            return;
          }

          LAST_SELECT_CHAMPION_ID = action.championId;
          // 判断是否已经确定
          if (!action.completed) {
            // 获取英雄Key 如 Akali
            for (let index in championData) {
              if (championData[index].championId == action.championId) {
                const championName = championData[index].key;
                // 转发参数
                win.webContents.send('controller.opgg.listenChampionChange', {
                  championName,
                  position: '', // 这里位置直接给空，因为如果是自动选择的话，位置是不可靠的
                });
                // 显示窗口
                win.show();
              }
            }
          }
        }
        /** service end */
        return;
      }
    }
  }
}
