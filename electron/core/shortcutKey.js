const { Storage } = require('ee-core');
const { Notification, BrowserWindow } = require('electron');
const ioHook = require('iohook');
const { sendStringInProgress, windowKeepTop } = require('../utils/win32-hook');
const c = require('../utils/cache');
const { translate } = require('../utils/translate');

exports.registerShortcutKey = async (eeApp) => {
  eeApp.logger.info(`[shortcutKey] 正在注册快捷键监听`);

  const db = Storage.JsonDB.connection('settings').db;
  const sendSettings = db.get('send').value();
  const appSettings = db.get('app').value();

  if (!sendSettings.enable) {
    eeApp.logger.info(`[shortcutKey] 当前设置已关闭快捷发送功能，停止注册`);
    return;
  }

  await setup(eeApp, sendSettings, appSettings);
};

async function setup(eeApp, sendSettings, appSettings) {
  await orderPanelInfo(eeApp, sendSettings);
  await chaosPanelInfo(eeApp, sendSettings);
  await muteAll(eeApp, sendSettings);
  await spellsWindow(eeApp, appSettings);
  ioHook.start();
}

/**
 * 友军面板信息快捷键监听
 */
async function orderPanelInfo(eeApp, sendSettings) {
  ioHook.registerShortcut(sendSettings.keys.order, async (keys) => {
    try {
      eeApp.logger.info(`[shortcutKey:orderPanelInfo] 监听到快捷键:${keys}`);

      const gameStatus = await eeApp.service.lcu.getGameStatus();
      eeApp.logger.info(`[shortcutKey:orderPanelInfo] 当前状态为:${gameStatus}`);

      if (gameStatus == 'ChampSelect' || gameStatus == 'InProgress') {
        const data = c.get('panel-data');
        for (var i = 0; i < data.orderList.length; i++) {
          let player = data.orderList[i];

          // 拼接历史对局KDA
          let matchHistoryStr = '';
          // 判断历史对局是否存在
          if (player.matches.data) {
            for (var j = 0; j < sendSettings.matchCount; j++) {
              let historyMatche = player.matches.data[j];
              const temp = `${historyMatche.kills}/${historyMatche.deaths}/${historyMatche.assists} `;
              matchHistoryStr += temp;
            }
          }

          const msg = `${player.type}:${player.summonerName},kda:${player.matches.kda || '0.0'},胜率:${
            player.matches.winRate || '00.0%'
          },最近对局:${matchHistoryStr}`;

          if (gameStatus === 'ChampSelect') {
            // 通过api发送
            eeApp.service.lcu.sendMsgInChampSelect('all', msg);
          }
          if (gameStatus === 'InProgress') {
            // 通过hook模拟发送
            sendStringInProgress(eeApp, msg);
          }
        }
      } else {
        eeApp.logger.info(`[shortcutKey:orderPanelInfo] 当前游戏状态: ${gameStatus}不支持发送友军面板信息`);
        new Notification({ title: '快捷发送失败', body: `当前玩家状态为${translate('status', gameStatus)},不支持发送面板信息`, silent: true }).show();
        return;
      }
    } catch (err) {
      eeApp.logger.error(`[shortcutKey:orderPanelInfo] 发生异常: ${err}`);
    }
  });
}

/**
 * 敌军面板信息快捷键监听
 */
async function chaosPanelInfo(eeApp, sendSettings) {
  ioHook.registerShortcut(sendSettings.keys.chaos, async (keys) => {
    try {
      eeApp.logger.info(`[shortcutKey:chaosPanelInfo] 监听到快捷键:${keys}`);

      const gameStatus = await eeApp.service.lcu.getGameStatus();
      eeApp.logger.info(`[shortcutKey:chaosPanelInfo] 当前状态为:${gameStatus}`);

      if (gameStatus != 'InProgress') {
        eeApp.logger.info(`[shortcutKey:chaosPanelInfo] 当前游戏状态: ${gameStatus}不支持发送敌军面板信息`);
        new Notification({ title: '快捷发送失败', body: `当前玩家状态为${translate('status', gameStatus)},不支持发送面板信息`, silent: true }).show();
        return;
      }

      const data = c.get('panel-data');
      for (var i = 0; i < data.chaosList.length; i++) {
        let player = data.chaosList[i];

        // 拼接历史对局KDA
        let matchHistoryStr = '';
        // 判断历史对局是否存在
        if (player.matches.data) {
          for (var j = 0; j < sendSettings.matchCount; j++) {
            let historyMatche = player.matches.data[j];
            const temp = `${historyMatche.kills}/${historyMatche.deaths}/${historyMatche.assists} `;
            matchHistoryStr += temp;
          }
        }

        const msg = `${player.type}:${player.summonerName},kda:${player.matches.kda || '0.0'},胜率:${
          player.matches.winRate || '00.0%'
        },最近对局:${matchHistoryStr}`;

        // 通过hook模拟发送
        sendStringInProgress(eeApp, msg);
      }
    } catch (err) {
      eeApp.logger.error(`[shortcutKey:chaosPanelInfo] 发生异常: ${err}`);
    }
  });
}

/**
 * 自动mute all
 */
async function muteAll(eeApp, sendSettings) {
  ioHook.registerShortcut(sendSettings.keys.muteAll, async (keys) => {
    try {
      eeApp.logger.info(`[shortcutKey:muteAll] 监听到快捷键:${keys}`);

      const gameStatus = await eeApp.service.lcu.getGameStatus();
      eeApp.logger.info(`[shortcutKey:muteAll] 当前状态为:${gameStatus}`);

      if (gameStatus != 'InProgress') {
        new Notification({ title: '快捷发送失败', body: `当前玩家状态为${translate('status', gameStatus)},不支持发禁言操作`, silent: true }).show();
        eeApp.logger.info(`[shortcutKey:muteAll] 当前游戏状态: ${gameStatus}不支持发禁言操作`);
        return;
      }

      sendStringInProgress(eeApp, '/mute all');
    } catch (err) {
      eeApp.logger.error(`[shortcutKey:muteAll] 发生异常: ${err}`);
    }
  });
}

async function spellsWindow(eeApp, appSettings){
  ioHook.registerShortcut(appSettings.spellsWinKey.key, async (keys) => {
    const db = Storage.JsonDB.connection('ddragon').db;
    const winId = db.get('spellsWindowId').value()
    const win = BrowserWindow.fromId(winId);
    if(!win.isVisible()){
      win.show()
      windowKeepTop(eeApp,'TIK SPELLS')
    }else{
      win.hide()
    }
  })
}
