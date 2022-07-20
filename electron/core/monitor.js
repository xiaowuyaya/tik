const { Storage } = require('ee-core');
const { Notification } = require('electron');
const { getClient, getWs } = require('../utils/league-connect');
const c = require('../utils/cache');

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

  const closeNotice = new Notification({
    title: '检测到游戏客户端退出',
    body: '应用程序也将在客户端进程结束后结束进程。',
  });

  client.on('disconnect', () => {
    // 客户端退出则也退出;
    logger.info('[monitor] 检测到游戏退出，应用程序也即将关闭。');
    closeNotice.show();
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
    eeApp.logger.info('[lcuMonitor] STATUS: data');

    if (_.has(handleStatus, data)) handleStatus[data]();
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
              try {
                _(appSettings.rankAuto.ban[position]).forEach(async function (banSelect) {
                  const res = await eeApp.service.lcu.confirmChampionByAction(banActionId, banSelect, appSettings.confirm);
                  if (res.errorCode != 'RPC_ERROR') throw new Error();
                });
              } catch (err) {}
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
                try {
                  _(appSettings.rankAuto.pick[position]).forEach(async function (pickSelect) {
                    const res = await eeApp.service.lcu.confirmChampionByAction(pickActionId, pickSelect, appSettings.confirm);
                    if (res.errorCode != 'RPC_ERROR') throw new Error();
                  });
                } catch (err) {}
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
const handleStatus = {
  Matchmaking: async (eeApp) => {
    return;
  },
  ReadyCheck: async (eeApp) => {
    c.del('panel-data');
    eeApp.logger.info('[monitor:ReadyCheck] 面板数据已清空');

    const db = Storage.JsonDB.connection('settings').db;
    const appSettings = db.get('app').value();
    if (appSettings.accept) await eeApp.service.acceptMatchmaking();

    return;
  },
  ChampSelect: async (eeApp) => {
    const db = Storage.JsonDB.connection('settings').db;
    const appSettings = db.get('app').value();
    eeApp.logger.info(`[monitor:ChampSelect] 匹配自动秒选 ${appSettings.normalAuto.pick}, 英雄设置为 ${appSettings.normalAuto.pickSelect}`);
    if (appSettings.normalAuto.pick) {
      try {
        _(appSettings.normalAuto.pickSelect).forEach(async function (pickSelect) {
          const res = await eeApp.service.lcu.confirmChampionById(pickSelect, appSettings.confirm);
          if (res.errorCode != 'RPC_ERROR') throw new Error();
        });
      } catch (err) {
        eeApp.logger.info(`[monitor:ChampSelect] 自动秒选成功`);
      }
    }
    eeApp.logger.info(`[monitor:ChampSelect] 征召自动禁用 ${appSettings.normalAuto.ban}, 英雄设置为 ${appSettings.normalAuto.banSelect}`);
    if (appSettings.normalAuto.ban) {
      try {
        _(appSettings.normalAuto.banSelect).forEach(async function (banSelect) {
          const res = await eeApp.service.lcu.confirmChampionById(banSelect, appSettings.confirm);
          if (res.errorCode != 'RPC_ERROR') throw new Error();
        });
      } catch (err) {
        eeApp.logger.info(`[monitor:ChampSelect] 自动秒禁用成功`);
      }
    }
  },
  InProgress: async () => {},
};
