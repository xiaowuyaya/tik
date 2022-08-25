import { createClient, createWebSocket } from '../utils/net'
import { panelData, appConfig } from '../utils/config'
import * as lcuApi from './api'
import { confirmChampionById } from './handle'
import { app, BrowserWindow } from 'electron'



export const createClientListen = () => {
  const client = createClient()
  if (!client) {
    return
  }
  client.on('disconnect', () => {
    app.quit()
  })
  client.start()
}

export const createWebsocketListen = async (mainWindow: BrowserWindow, spellsWindow: BrowserWindow) => {
  const ws = await createWebSocket();
  if (!ws) return

  const summonerInfo = await lcuApi.getCurrentSummoner()
  const { summonerId, displayName } = summonerInfo



  // 玩家状态订阅
  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, event) => {
    // 状态转发到渲染进程主窗口
    mainWindow.webContents.send('playerStatus', data);
    spellsWindow.webContents.send('playerStatus', data);

    statusHandle(data, displayName)
  });
}


const statusHandle = async (status: string, summonerName: string) => {
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
      const pickList: string[] = appConfig.get('normalAutoPB.pickSelect')
      for (let i = 0; i < pickList.length; i++) {
        const res = await confirmChampionById(pickList[i], appConfig.get('confirmSelect'))
        if (res.errorCode != 'RPC_ERROR') {
          break;
        }
      }
    }

    if (appConfig.get('normalAutoPB.enableBan')) {
      const banList: string[] = appConfig.get('normalAutoPB.banSelect')
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
    // await ctx.service.opgg.showChampionToolWindow({ show: false });
  }

  if (status == 'PreEndOfGame') {}
}