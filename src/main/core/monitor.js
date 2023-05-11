import { createLeagueWebSocket } from './net'
import * as api from './api'
import { appConfigStore } from '../tools/store'
import cache from '../tools/cache'
import log from '../tools/log'
import { global as globalWins } from '../application/window'
import { LeagueGameEvent } from './event'

/**
 * 发送校验状态信息
 * @param {number} code -1: err 0: loading 1: success
 * @param {string} msg 文本
 */
export function setCheckingStatus(code, msg) {
  const mainWin = globalWins.main
  code === -1 ? log.error(msg) : log.info(msg)
  mainWin.webContents.send('loading_launch_message', { code, msg })
}

export async function createWebsocketListen() {
  const mainWin = globalWins.main
  const toolsWin = globalWins.tools
  setCheckingStatus(0, '正在初始化游戏客户端websocket监听...')

  const ws = await createLeagueWebSocket()
  const leagueGameEvent = new LeagueGameEvent()

  const summonerInfo = await api.getCurrentSummoner()
  if (!summonerInfo) throw new Error(`未获取到客户端玩家信息`)
  const { summonerId, puuid } = summonerInfo

  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, _event) => {
    console.log('gameflow-phase', data)

    mainWin.webContents.send('player-status', data)
    mainWin.webContents.send('player-status-layout', data)

    handleToolsWinStatus(data)
    await handleAutoMatchingGame(data, puuid)

    if (data === 'None') return

    if (data === 'Lobby') return

    if (data === 'Matchmaking') return

    if (data === 'ReadyCheck') {
      cache.del('panel-data')
      await $service.autoAcceptMatchReadyCheck()
    }

    if (data === 'ChampSelect') {
      await $service.selectChampNormal()
      await $service.getPanelDataInChampSelect()
    }

    if (data === 'InProgress') {
      if ($store.paidDataStore.get('enable') && $store.paidDataStore.get('server') === '101') await $dll.call101ServerInject()
      await $service.getPanelDataInGame()
      await leagueGameEvent.start()
    }

    if (data === 'EndOfGame') return
  })

  ws.subscribe('/lol-champ-select/v1/session', async (data, _event) => {
    let cellId, position // 楼层 位置
    for (let i = 0; i < data.myTeam.length; i++) {
      const order = data.myTeam[i]
      if (order.summonerId === summonerId) {
        cellId = order.cellId
        position = order.assignedPosition
        break
      }
    }

    await currentSelectChampId(data, summonerId, cellId, position) // 发送当前选择的英雄

    if (data.timer.phase === 'PLANNING') return

    if (data.timer.phase === 'BAN_PICK') {
      await $service.selectChampByMode(data.actions, cellId, position)
    }
  })

  ws.subscribe('/lol-champ-select/v1/current-champion', async (champId, _event) => {
    console.log('current-champion', champId)
    toolsWin.webContents.send('tool-confirm-champ', champId)
  })

  setCheckingStatus(0, 'websocket监听初始化完成')
}

function handleToolsWinStatus(gameStatus) {
  const toolsWin = globalWins.tools
  if (gameStatus === 'ChampSelect') {
    if (appConfigStore.get('champToolWin.enable')) {
      toolsWin.reload()
      toolsWin.show()
    }
  }
  if (gameStatus === 'InProgress') toolsWin.hide()
  if (gameStatus === 'None') toolsWin.hide()
}

async function handleAutoMatchingGame(gameStatus, puuid) {
  if (!appConfigStore.get('autoMatchingGame.enable')) return

  async function reloadLobby() {
    const history = await api.getHistoryMatchesByPuuidV2(puuid, 0, 1) // 获取上一场对局的模式
    // const gameMode = history.games.games[0].gameMode
    // const gameType = history.games.games[0].gameType
    const queueId = history.games.games[0].queueId
    await api.createLobby(queueId === 0 ? 420 : queueId)
  }

  if (gameStatus === 'None') {
    await reloadLobby()
  }

  if (gameStatus === 'EndOfGame') {
    await reloadLobby()
  }

  if (gameStatus === 'Lobby') {
    const position = appConfigStore.get('autoMatchingGame.position') || []
    if (position.length !== 0) await api.changePosition(position[0], position[1])

    await api.searchGame()
  }
}

// 上个事件自己选择的英雄id
let LAST_SELECT_CHAMPION_ID = 0

/**
 * 在小窗口中展示数据
 * @param {*} data session
 * @param {*} summonerId
 * @param cellId
 * @param position
 * @returns
 */
async function currentSelectChampId(data, summonerId, cellId, position) {
  const toolsWin = globalWins.tools
  if (data.timer.phase !== 'BAN_PICK') {
    // 不处理非ban pick 阶段的事件
    return
  }
  const actions = data.actions // 获取事件数组

  for (let i = 0; i < actions.length; i++) {
    const actionItem = actions[i]

    for (let j = 0; j < actionItem.length; j++) {
      const action = actionItem[j]

      if (action.type !== 'pick') {
        // 如果当前事件类型不是pick就跳过，
        continue
      }

      if (action.actorCellId === cellId) {
        // 找到属于自己的pick actions
        if (action.championId !== 0) {
          // 判断是否有表明英雄
          // 与上次选择的英雄相同则跳过此次 防止重复请求
          if (action.championId === LAST_SELECT_CHAMPION_ID) return

          LAST_SELECT_CHAMPION_ID = action.championId
          if (appConfigStore.get(`champToolWin.enable`)) {
            toolsWin.show()
            toolsWin.webContents.send('tool-select-champ', action.championId)
          }
        }
        return
      }
    }
  }
}
