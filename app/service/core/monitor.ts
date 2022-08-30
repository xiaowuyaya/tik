import { ddragonConfig } from './../utils/config';
import { createClient, createWebSocket } from '../utils/net'
import { panelData, appConfig } from '../utils/config'
import * as lcuApi from './api'
import { confirmChampionById } from './handle'
import { app, BrowserWindow } from 'electron'
import _ from 'lodash';
import log from '../utils/log';
import { sendStringInProgress } from '../utils/win32_hook';

const logger = log.scope('monitor')


export const createClientListen = () => {
  const client = createClient()
  if (!client) {
    return
  }
  client.on('disconnect', () => {
    logger.info('check for game client is quit, application will be quit now.')
    app.quit()
    app.exit()
  })
  client.start()
  logger.info('create game client listen success')
}

export const createWebsocketListen = async (mainWindow: BrowserWindow, championRuneWindow: BrowserWindow, spellsWindow: BrowserWindow) => {
  const ws = await createWebSocket();
  if (!ws) return
  logger.info('create websocket listen success')
  const summonerInfo = await lcuApi.getCurrentSummoner()
  const { summonerId, displayName } = summonerInfo

  // 玩家状态订阅
  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, event) => {
    // 状态转发到渲染进程主窗口
    mainWindow.webContents.send('playerStatus', data);
    spellsWindow.webContents.send('playerStatus', data);

    await statusHandle(data, displayName, spellsWindow)
  });

  // 玩家actions订阅
  ws.subscribe('/lol-champ-select/v1/session', async (data, event) => {
    // 当session变化时发生数据变化,英雄数据展示
    showDataInChampionToolRune(data, summonerId, championRuneWindow);
    
    if (!appConfig.get('rankAutoBP.pick.enable') && !appConfig.get('rankAutoBP.ban.enable')) return

    let cellId: string
    let position: string

    for (let i = 0; i < data.myTeam.length; i++) {
      const order = data.myTeam[i];
      if (order.summonerId == summonerId) {
        cellId = order.cellId;
        position = order.assignedPosition;
        break;
      }
    }


    if (_.isEmpty(position)) return;

    const actions = data.actions;


    if (data.timer.phase == 'PLANNING') return;

    if (data.timer.phase == 'BAN_PICK') {

      if (appConfig.get('rankAutoBP.ban.enable')) {

        let banActionId: string;
        for (let i = 0; i < actions[0].length; i++) {
          const action = actions[0][i];
          if (action.actorCellId == cellId) {
            banActionId = action.id;
            if (!action.completed) {
              const positionSelect: number[] = appConfig.get(`rankAutoBP.ban.${position}`)
              for (let i = 0; i < positionSelect.length; i++) {
                const select = positionSelect[i];
                const res = await lcuApi.selectChampionById(select, banActionId, appConfig.get('confirmSelect'))
                if (res.errorCode != 'RPC_ERROR') {
                  break;
                }
              }
              return;
            }
          }
        }

      }

      if (appConfig.get('rankAutoBP.pick.enable')) {
        let pickActionId: string;

        for (let i = 2; i < actions.length; i++) {
          const actionItem = actions[i];
          for (let j = 0; j < actionItem.length; j++) {
            const action = actionItem[j];
            if (action.actorCellId == cellId) {
              pickActionId = action.id;
              if (!action.completed) {
                const positionSelect: number[] = appConfig.get(`rankAutoBP.pick.${position}`)
                for (let i = 0; i < positionSelect.length; i++) {
                  const select = positionSelect[i];
                  const res = await lcuApi.selectChampionById(select, pickActionId, appConfig.get('confirmSelect'))
                  if (res.errorCode != 'RPC_ERROR') {
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

  })
}


const statusHandle = async (status: string, summonerName: string, spellsWindow: BrowserWindow) => {
  if (status == 'Matchmaking') {
    return;
  }
  if (status == 'ReadyCheck') {
    panelData.reset('panelData')
    if (appConfig.get('autoAccept')) await lcuApi.acceptMatchmaking()
    return;
  }
  if (status == 'ChampSelect') {
    
    if (appConfig.get('normalAutoPB.enablePick')) {
      const pickList: number[] = appConfig.get('normalAutoPB.pickSelect')
      for (let i = 0; i < pickList.length; i++) {
        const res = await confirmChampionById(pickList[i], appConfig.get('confirmSelect'))
        
        if (res.errorCode != 'RPC_ERROR') {
          break;
        }
      }
    }

    if (appConfig.get('normalAutoPB.enableBan')) {
      const banList: number[] = appConfig.get('normalAutoPB.banSelect')
      for (let i = 0; i < banList.length; i++) {
        const res = await confirmChampionById(banList[i], appConfig.get('confirmSelect'))
        if (res.errorCode != 'RPC_ERROR') {
          break;
        }
      }
    }
    return
  }

  if (status == 'InProgress') {
    // 隐藏符文导入窗口
    spellsWindow.hide()
    // 开局禁言
    const autoMuteAll = appConfig.get('autoMuteAll')
    if(autoMuteAll){
      setTimeout(()=>{
        sendStringInProgress('/mute all')
      }, 30000)
    }
  }

  if (status == 'PreEndOfGame') { }
}


let LAST_SELECT_CHAMPION_ID = 0;
const showDataInChampionToolRune = (data: any, summonerId: string, champToolWin: BrowserWindow) => {
  if (data.timer.phase != 'BAN_PICK' || !appConfig.get('showChampTool')) return

  let cellId: string
  let position: string

  const championData = ddragonConfig.get('champions')

  for (let i = 0; i < data.myTeam.length; i++) {
    const order = data.myTeam[i];
    if (order.summonerId == summonerId) {
      cellId = order.cellId;
      position = order.assignedPosition;
      break;
    }
  }

  const actions = data.actions;

  for (let i = 0; i < actions.length; i++) {
    const actionItem = actions[i];

    for (let j = 0; j < actionItem.length; j++) {
      const action = actionItem[j];

      if (action.type != 'pick') continue;

      if (action.actorCellId == cellId) {
        if (action.championId != 0) {
          if (action.championId == LAST_SELECT_CHAMPION_ID) return

          LAST_SELECT_CHAMPION_ID = action.championId;
          if (!action.completed) {
            const key = _.findKey(championData, { championId: `${action.championId}` })
            champToolWin.webContents.send('championRuneWindow.changeData', {
              /* TODO: 目前写死 */
              mode: 0,
              championName: championData[key].enName,
              position: '', // 通常位置都是比较傻逼的  直接不写，让程序自己查常用位置
            })
            champToolWin.show()
          }
        }
        return;
      }
    }
  }
}