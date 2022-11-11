import {LeagueClient, createWebSocketConnection} from 'league-connect'
import {app, BrowserWindow} from "electron";
import {LeagueGameEvent} from "./event";
import * as service from './service'
import _ from 'lodash'

export async function createClientListen() {
  try {
    const credentials = $cache.get('credentials')
    const client = new LeagueClient(credentials, {pollInterval: 1000})
    if (!client || global.client) return
    global.client = client
    client.on('disconnect', () => {
      $log.info('[monitor] check for game client is quit, application will be quit now.')
      app.quit()
      process.exit(0)
    })
    client.start()
    $log.info('[monitor] create game client listen success')
  } catch (err) {
    $log.error(`[monitor] create client throw an error: ${err}`)
  }
}

export async function createWebsocketListen(mainWindow: BrowserWindow) {
  // const championRuneWindow = BrowserWindow.fromId($cache.get('window:rune'))

  // if (!mainWindow || !championRuneWindow) {
  //   $log.error(`[monitor] browser window object get null, createWebsocketListen fail`)
  //   return
  // }

  let ws = null

  try {
    const credentials = $cache.get('credentials')
    ws = await createWebSocketConnection(credentials)
  } catch (err) {
    $log.error(`[connect] create websocket throw an error: ${err}`)
  }

  if (!ws || global.ws) return
  global.ws = ws // 保持单例

  /* SERVICE BEGIN */
  const gameEvent = new LeagueGameEvent()
  const summonerInfo: any = await $api.getCurrentSummoner()
  if (!summonerInfo) {
    $log.error(`[monitor] get summoner info failed, createWebsocketListen fail`)
    return
  }
  const {summonerId, displayName} = summonerInfo

  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, _event) => {
    /* 状态转发到渲染进程 */
    mainWindow.webContents.send('player-status', data)
    // spellHandleWindow.webContents.send('player-status', data)

    if (data === 'Matchmaking') return

    if (data === 'ReadyCheck') {
      $cache.del("panelData")   // 清除面板数据缓存
      /* 自动接收对局 */
      if ($store.appStore.get('app.autoAccept.enable')) {
        let delayTime: number = $store.appStore.get('app.autoAccept.delay')
        if (!delayTime) delayTime = 0
        setTimeout(async () => {
          await $api.acceptMatchmaking()
        }, delayTime * 1000)
      }
      return
    }

    if (data === 'ChampSelect') {
      /* 匹配秒选 */
      if ($store.appStore.get('app.autoBP.pick.enable')) {
        const normalPickList: number[] = $store.appStore.get('app.autoBP.pick.normal')
        for (let i = 0; i < normalPickList.length; i++) {
          const res: any = await service.confirmChampionById(normalPickList[i], $store.appStore.get('app.confirmSelect'))
          if (res.errorCode !== 'RPC_ERROR') break
        }
      }
    }

    if (data === 'InProgress') {
      /* 隐藏符文导入窗口 */
      // championRuneWindow.hide()
      /* 自动禁言处理 */
      gameEvent.handleAutoMuteAll()
    }
  })

  ws.subscribe('/lol-champ-select/v1/session', async (data, _event) => {
    // 当session变化时发生数据变化,英雄数据展示
    // showDataInChampionToolRune(data, summonerId, championRuneWindow)
    /* 排位禁选业务 */
    if (!$store.appStore.get('app.autoBP.pick.enable') && !$store.appStore.get('app.autoBP.ban.enable')) return

    let cellId: number, position: string

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
      /* BAN */
      if ($store.appStore.get('app.autoBP.ban.enable')) {
        let banActionId: number
        for (let i = 0; i < actions[0].length; i++) {
          const action = actions[0][i]
          if (action.actorCellId == cellId) {
            banActionId = action.id
            if (!action.completed) {
              const positionSelect: number[] = $store.appStore.get(`app.autoBP.ban.${position}`)
              for (let i = 0; i < positionSelect.length; i++) {
                const select = positionSelect[i]
                const res: any = await $api.selectChampionById(select, banActionId, $store.appStore.get('app.confirmSelect'))
                if (res.errorCode != 'RPC_ERROR') break
              }
              return
            }
          }
        }
      }

      /* PICK */
      if ($store.appStore.get('app.autoBP.pick.enable')) {
        let pickActionId: number
        for (let i = 2; i < actions.length; i++) { // 从第三个开始是pick阶段
          const actionItem = actions[i]
          for (let j = 0; j < actionItem.length; j++) {
            const action = actionItem[j]
            if (action.actorCellId == cellId) {
              pickActionId = action.id
              if (!action.completed) {
                const positionSelect: number[] = $store.appStore.get(`app.autoBP.pick.${position}`)
                for (let i = 0; i < positionSelect.length; i++) {
                  const select = positionSelect[i]
                  const res: any = await $api.selectChampionById(select, pickActionId, $store.appStore.get('app.confirmSelect'))
                  if (res.errorCode != 'RPC_ERROR') break
                }
                return
              }
            }
          }
        }
      }

    }

  })

  $log.info('[monitor]create websocket listen success')
}
