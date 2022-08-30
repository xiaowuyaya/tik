import { appConfig, panelData } from './../utils/config';
import iohook from 'iohook'
import * as api from './api'
import { BrowserWindow, Notification } from 'electron'
import { sendStringInProgress, windowKeepTop } from '../utils/win32_hook';
import log from '../utils/log';

const logger = log.scope('shortcutkey')


export const createShortcutKeyListen = async (spellsWindow: BrowserWindow) => {
  await panelDataEvent()
  await muteAllEvent()
  await spellsWindowEvent(spellsWindow)
  iohook.start()
};

const panelDataEvent = async () => {
  const orderKey: number[] = appConfig.get('keys.order')
  const order = iohook.registerShortcut(orderKey, async (keys) => {
    try {
      const enableSendHourse: boolean = appConfig.get('enableSendHourse')
      if(!enableSendHourse) return
      const gameStatus = await api.getGameStatus();
      if (gameStatus == 'ChampSelect' || gameStatus == 'InProgress') {
        const data = panelData.get('panelData')
        const count = appConfig.get('matchCount')
        for (var i = 0; i < data.orderList.length; i++) {
          let player = data.orderList[i];

          // 拼接历史对局KDA
          let matchHistoryStr = '';
          // 判断历史对局是否存在
          if (player.matches.data) {
            for (var j = 0; j < count; j++) {
              let historyMatche = player.matches.data[j];
              const temp = `[${historyMatche.kills},${historyMatche.deaths},${historyMatche.assists}] `;
              matchHistoryStr += temp;
            }
          }

          const msg = `${player.type}:${player.summonerName},kda:${player.matches.kda || '0.0'},胜率:${player.matches.winRate || '00.0%'
            },最近对局:${matchHistoryStr}`;

          if (gameStatus === 'ChampSelect') {
            // 通过api发送
            api.sendMsgInChampSelect('all', msg);
            logger.info('msg')
          }
          if (gameStatus === 'InProgress') {
            // 通过hook模拟发送
            sendStringInProgress(msg);
            
          }
        }
      } else {
        new Notification({ title: '面板数据发送失败', body: `当前未在选人界面或游戏中,不支持发送面板信息`, silent: true }).show();
        return;
      }
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show();
      logger.info(`panel for order hot key throw an error:${err}`)
    }
  })
  logger.info('panel for order hot key is register')

  const chaosKey: number[] = appConfig.get('keys.chaos')
  const chaos = iohook.registerShortcut(chaosKey, async (keys) => {
    try {
      const enableSendHourse: boolean = appConfig.get('enableSendHourse')
      if(!enableSendHourse) return
      const gameStatus = await api.getGameStatus();
      if (gameStatus != 'InProgress') {
        new Notification({ title: '面板数据发送失败', body: `当前暂未进入游戏对局,不支持发送敌军面板信息`, silent: true }).show();
        return;
      }
      const data = panelData.get('panelData')
      const count = appConfig.get('matchCount')
      for (var i = 0; i < data.chaosList.length; i++) {
        let player = data.chaosList[i];

        // 拼接历史对局KDA
        let matchHistoryStr = '';
        // 判断历史对局是否存在
        if (player.matches.data) {
          for (var j = 0; j < count; j++) {
            let historyMatche = player.matches.data[j];
            const temp = `${historyMatche.kills}.${historyMatche.deaths}.${historyMatche.assists} `;
            matchHistoryStr += temp;
          }
        }

        const msg = `${player.type}:${player.summonerName},kda:${player.matches.kda || '0.0'},胜率:${player.matches.winRate || '00.0%'
          },最近对局:${matchHistoryStr}`;

        // 通过hook模拟发送
        sendStringInProgress(msg);
      }
    } catch (err) {

      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show();
      logger.info(`panel for chaos hot key throw an error:${err}`)
    }
  })
  logger.info('panel for chaos hot key is register')
}

const muteAllEvent = async () => { 
  const muteAllKey: number[] = appConfig.get('keys.muteAll')
  const muteAll = iohook.registerShortcut(muteAllKey, async (keys) => {
    try{
      const gameStatus = await api.getGameStatus();
      if (gameStatus != 'InProgress') {
        new Notification({ title: '快捷发送失败', body: `当前暂未进入游戏对局,不支持发禁言操作`, silent: true }).show();
        return;
      }
      sendStringInProgress('/mute all');
    }catch(err){
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show();
      logger.info(`muteAll hot key throw an error:${err}`)
    }
  })

  logger.info(' muteAll hot key is register')
}

const spellsWindowEvent = async (spellsWindow: BrowserWindow) => {
  const spellsWinKey: number[] = appConfig.get('spellsWin.key')
  const enable: boolean = appConfig.get('spellsWin.enable')

  if(!enable) return

  iohook.registerShortcut(spellsWinKey, async (keys) => {
    if(!spellsWindow.isVisible()){
      spellsWindow.show()
      windowKeepTop('TIK SPELLS')
    }else{
      spellsWindow.hide()
    }
  })

  logger.info('handle spells window hot key is register')
}
