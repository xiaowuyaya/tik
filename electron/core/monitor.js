const { createClient, createWebSocket } = require('../utils/net')
const { BrowserWindow } = require('electron')
const lcuApi = require('./api')
const { browserConfig, appConfig, ddragonConfig } = require('../store/index')
const _ = require('lodash')
const c = require('../utils/cache')

exports.createClientListen = ctx => {
  const client = createClient()
  if (!client) return
  client.on('disconnect', () => {
    ctx.logger.info('[monitor] check for game client is quit, application will be quit now.')
    ctx.appQuit()
  })
  client.start()
  ctx.logger.info('[monitor] create game client listen success')
}

exports.createWebsocketListen = async ctx => {
  const championRuneWindowId = browserConfig.get('browserWindows.championRuneWindow')
  const spellsWindowId = browserConfig.get('browserWindows.spellsWindow')
  const mainWindow = ctx.electron.mainWindow
  const championRuneWindow = BrowserWindow.fromId(championRuneWindowId)
  const spellsWindow = BrowserWindow.fromId(spellsWindowId)
  if (!mainWindow || !championRuneWindow || !spellsWindow) {
    ctx.logger.error(`[monitor] browser window object get null, createWebsocketListen fail`)
    return
  }
  const ws = await createWebSocket()
  if (!ws) return

  ctx.logger.info('[monitor]create websocket listen success')

  const summonerInfo = await lcuApi.getCurrentSummoner()
  const { summonerId, displayName } = summonerInfo

  // 玩家状态订阅
  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, event) => {
    // 状态转发到渲染进程主窗口
    mainWindow.webContents.send('playerStatus', data)
    spellsWindow.webContents.send('playerStatus', data)

    if (data === 'Matchmaking') return
    if (data === 'ReadyCheck') {
      c.del('panelData')
      if (appConfig.get('autoAccept')) await lcuApi.acceptMatchmaking()
      return
    }
    if (data === 'ChampSelect') {
      if (appConfig.get('normalAutoPB.enablePick')) {
        const pickList = appConfig.get('normalAutoPB.pickSelect')
        for (let i = 0; i < pickList.length; i++) {
          const res = await ctx.service.lcuHandle.confirmChampionById(pickList[i], appConfig.get('confirmSelect'))
          if (res.errorCode !== 'RPC_ERROR') break
        }
      }

      if (appConfig.get('normalAutoPB.enableBan')) {
        const banList = appConfig.get('normalAutoPB.banSelect')
        for (let i = 0; i < banList.length; i++) {
          const res = await ctx.service.lcuHandle.confirmChampionById(pickList[i], appConfig.get('confirmSelect'))
          if (res.errorCode !== 'RPC_ERROR') break
        }
      }
      return
    }

    if (data === 'InProgress') {
      // 隐藏符文导入窗口
      spellsWindow.hide()
    }

    if (data === 'PreEndOfGame') {
    }
  })

  // 玩家actions订阅
  ws.subscribe('/lol-champ-select/v1/session', async (data, event) => {
    // 当session变化时发生数据变化,英雄数据展示
    showDataInChampionToolRune(data, summonerId, championRuneWindow)
    if (!appConfig.get('rankAutoBP.pick.enable') && !appConfig.get('rankAutoBP.ban.enable')) return

    let cellId
    let position

    for (let i = 0; i < data.myTeam.length; i++) {
      const order = data.myTeam[i]
      if (order.summonerId == summonerId) {
        cellId = order.cellId
        position = order.assignedPosition
        break
      }
    }

    if (_.isEmpty(position)) return

    const actions = data.actions

    if (data.timer.phase == 'PLANNING') return

    if (data.timer.phase == 'BAN_PICK') {
      if (appConfig.get('rankAutoBP.ban.enable')) {
        let banActionId
        for (let i = 0; i < actions[0].length; i++) {
          const action = actions[0][i]
          if (action.actorCellId == cellId) {
            banActionId = action.id
            if (!action.completed) {
              const positionSelect = appConfig.get(`rankAutoBP.ban.${position}`)
              for (let i = 0; i < positionSelect.length; i++) {
                const select = positionSelect[i]
                const res = await lcuApi.selectChampionById(select, banActionId, appConfig.get('confirmSelect'))
                if (res.errorCode != 'RPC_ERROR') {
                  break
                }
              }
              return
            }
          }
        }
      }

      if (appConfig.get('rankAutoBP.pick.enable')) {
        let pickActionId

        for (let i = 2; i < actions.length; i++) {
          const actionItem = actions[i]
          for (let j = 0; j < actionItem.length; j++) {
            const action = actionItem[j]
            if (action.actorCellId == cellId) {
              pickActionId = action.id
              if (!action.completed) {
                const positionSelect = appConfig.get(`rankAutoBP.pick.${position}`)
                for (let i = 0; i < positionSelect.length; i++) {
                  const select = positionSelect[i]
                  const res = await lcuApi.selectChampionById(select, pickActionId, appConfig.get('confirmSelect'))
                  if (res.errorCode != 'RPC_ERROR') {
                    break
                  }
                }
                return
              }
            }
          }
        }
      }
    }
  })
}

let LAST_SELECT_CHAMPION_ID = 0
const showDataInChampionToolRune = (data, summonerId, champToolWin) => {
  if (data.timer.phase != 'BAN_PICK' || !appConfig.get('showChampTool')) return

  let cellId
  let position

  const championData = ddragonConfig.get('champions')

  for (let i = 0; i < data.myTeam.length; i++) {
    const order = data.myTeam[i]
    if (order.summonerId == summonerId) {
      cellId = order.cellId
      position = order.assignedPosition
      break
    }
  }

  const actions = data.actions

  for (let i = 0; i < actions.length; i++) {
    const actionItem = actions[i]

    for (let j = 0; j < actionItem.length; j++) {
      const action = actionItem[j]

      if (action.type != 'pick') continue

      if (action.actorCellId == cellId) {
        if (action.championId != 0) {
          if (action.championId == LAST_SELECT_CHAMPION_ID) return

          LAST_SELECT_CHAMPION_ID = action.championId
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
        return
      }
    }
  }
}
