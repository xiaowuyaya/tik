const { Storage, Utils } = require('ee-core');
const { Notification } = require('electron');
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
  // 玩家状态订阅
  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, event) => {
    // 状态转发到渲染进程
    eeApp.electron.mainWindow.webContents.send('controller.lcu.listenPlayerStatus', data);
    eeApp.logger.info(`[lcuMonitor] STATUS: ${data}`);

    const gameEventListen = new GameEventListen(eeApp);
    handleStatus(data, eeApp, gameEventListen, SUMMONER.displayName);
  });
  // 玩家actions订阅
  ws.subscribe('/lol-champ-select/v1/session', async (data, event) => {
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
    const enableHeroScreenshot = Utils.getEeConfig().settings.app.heroScreenshot;
    if (enableHeroScreenshot) await gameEventListen.eventListenStart(summonerName);
  }
  if (status == 'PreEndOfGame') {
    const enableHeroScreenshot = Utils.getEeConfig().settings.app.heroScreenshot;
    if (enableHeroScreenshot) gameEventListen.stop();
  }
};
