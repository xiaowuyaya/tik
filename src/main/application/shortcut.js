import iohook from 'iohook'
import { Notification } from 'electron'
import _ from 'lodash'

export function registerGlobalShortcut() {
  panelEvent()
  muteEvent()
  iohook.stop()
  iohook.start()
}

function panelEvent() {
  const ODER_KEY = $store.appConfigStore.get('keys.order')
  const CHAOS_KEY = $store.appConfigStore.get('keys.chaos')

  if (ODER_KEY.length !== 0) {
    iohook.registerShortcut(ODER_KEY, async keys => {
      console.log(`press ${keys}, ORDER`)
      try {
        if (!$store.appConfigStore.get('sendPlayerLevelInfo.enable')) return
        const gameStatus = await $api.getGameStatus()
        if (!(gameStatus == 'ChampSelect' || gameStatus == 'InProgress')) return

        const data = $cache.get('panelData')
        const count = $store.appConfigStore.get('sendPlayerLevelInfo.matchNum')

        await $utils.sendMessage('【TikLeagueTool 对局助手】', 'ALL')

        for (let i = 0; i < data.orderList.length; i++) {
          let player = data.orderList[i]
          // 拼接历史对局KDA
          let matchHistoryStr = ''
          // 判断历史对局是否存在
          if (player.matches.data) {
            for (let j = 0; j < count; j++) {
              let historyMatche = player.matches.data[j]
              const temp = `(${historyMatche.kills || 0},${historyMatche.deaths || 0},${historyMatche.assists || 0} ) `
              matchHistoryStr += temp
            }
          }

          const textTemplate = $store.appConfigStore.get('sendPlayerLevelInfo.template')
          const msg = textTemplate
            .replace('{称号}', player.type)
            .replace('{玩家名}', player.summonerName)
            .replace('{kda}', player.matches.kda || '0.0')
            .replace('{胜率}', player.matches.winRate || '00.0%')
            .replace('{对局}', matchHistoryStr)

          await $utils.sendMessage(msg, 'ALL')
        }

        let groupPlayer_1 = ''
        let groupPlayer_2 = ''
        if (data.orderTogether.arr1.length > 1) {
          _.forEach(data.orderTogether.arr1, summonerName => {
            groupPlayer_1 += `${summonerName}, `
          })
        }
        if (data.orderTogether.arr2.length > 1) {
          _.forEach(data.orderTogether.arr2, summonerName => {
            groupPlayer_2 += `${summonerName}, `
          })
        }
        if (groupPlayer_1 || groupPlayer_2) {
          await $utils.sendMessage(`我方组队：${groupPlayer_1 ? `(${groupPlayer_1})` : ''} ${groupPlayer_2 ? `(${groupPlayer_2})` : ''}`, 'ALL')
        }
      } catch (err) {
        new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
        $log.error(`[shortcut] panel for order shortcut throw an error:${err}`)
      }
    })
  }

  if (CHAOS_KEY.length !== 0) {
    iohook.registerShortcut(CHAOS_KEY, async keys => {
      console.log(`press ${keys}, CHAOS`)
      try {
        if (!$store.appConfigStore.get('sendPlayerLevelInfo.enable')) return
        const gameStatus = await $api.getGameStatus()
        if (gameStatus !== 'InProgress') {
          new Notification({
            title: '面板数据发送失败',
            body: `当前暂未进入游戏对局,不支持发送敌军面板信息`,
            silent: true,
          }).show()
          return
        }

        const data = $cache.get('panelData')
        const count = $store.appConfigStore.get('sendPlayerLevelInfo.matchNum')
        await $utils.sendMessage('【TikLeagueTool 对局助手】', 'ALL')
        for (let i = 0; i < data.chaosList.length; i++) {
          let player = data.chaosList[i]
          // 拼接历史对局KDA
          let matchHistoryStr = ''
          // 判断历史对局是否存在
          if (player.matches.data) {
            for (let j = 0; j < count; j++) {
              let historyMatche = player.matches.data[j]
              const temp = `(${historyMatche.kills || 0},${historyMatche.deaths || 0},${historyMatche.assists || 0} ) `
              matchHistoryStr += temp
            }
          }

          const textTemplate = $store.appConfigStore.get('sendPlayerLevelInfo.template')
          const msg = textTemplate
            .replace('{称号}', player.type)
            .replace('{玩家名}', player.summonerName)
            .replace('{kda}', player.matches.kda || '0.0')
            .replace('{胜率}', player.matches.winRate || '00.0%')
            .replace('{对局}', matchHistoryStr)

          await $utils.sendMessage(msg, 'ALL')
        }

        let groupPlayer_1 = ''
        let groupPlayer_2 = ''
        if (data.chaosTogether.arr1.length > 1) {
          _.forEach(data.chaosTogether.arr1, summonerName => {
            groupPlayer_1 += `${summonerName}, `
          })
        }
        if (data.chaosTogether.arr2.length > 1) {
          _.forEach(data.chaosTogether.arr2, summonerName => {
            groupPlayer_2 += `${summonerName}, `
          })
        }
        if (groupPlayer_1 || groupPlayer_2) {
          await $utils.sendMessage(`敌方组队：${groupPlayer_1 ? `(${groupPlayer_1})` : ''} ${groupPlayer_2 ? `(${groupPlayer_2})` : ''}`, 'ALL')
        }
      } catch (err) {
        new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
        $log.error(`[shortcut] panel for order shortcut throw an error:${err}`)
      }
    })
  }
  $log.info('[shortcut] shortcut for panel event is register')
}

function muteEvent() {
  const MUTE_KEY = $store.appConfigStore.get('keys.mute')
  iohook.registerShortcut(MUTE_KEY, async keys => {
    console.log(`press ${keys}, ORDER`)
    try {
      const gameStatus = await $api.getGameStatus()
      if (gameStatus != 'InProgress') {
        new Notification({
          title: '快捷发送失败',
          body: `当前暂未进入游戏对局,不支持发禁言操作`,
          silent: true,
        }).show()
        return
      }
      await $utils.sendMessage(' /deafen', 'ALL')
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
      $log.error(`[shortcut] muteAll shortcut throw an error:${err}`)
    }
    $log.info(`[shortcut] muteAll shortcut is register`)
  })
}
