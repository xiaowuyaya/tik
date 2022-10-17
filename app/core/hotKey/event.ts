import iohook from 'iohook'
import { sendStringInProgress } from '../utils/win32'
const { Notification } = require('electron')

export async function panelEvent() {
  const orderKey: number[] = $store.appStore.get('app.keys.order')
  const chaosKey: number[] = $store.appStore.get('app.keys.chaos')

  iohook.registerShortcut(orderKey, async keys => {
    try {
      const enableSendHourse = $store.appStore.get('app.enableSendHourse')
      if (!enableSendHourse) return
      const gameStatus = await $api.getGameStatus()
      if (gameStatus == 'ChampSelect' || gameStatus == 'InProgress') {
        const data = $utils.cache.get('panelData')
        const count = $store.appStore.get('app.matchCount')
        for (let i = 0; i < data.orderList.length; i++) {
          let player = data.orderList[i]

          // 拼接历史对局KDA
          let matchHistoryStr = ''
          // 判断历史对局是否存在
          if (player.matches.data) {
            for (let j = 0; j < count; j++) {
              let historyMatche = player.matches.data[j]
              const temp = `(${historyMatche.kills},${historyMatche.deaths},${historyMatche.assists}) `
              matchHistoryStr += temp
            }
          }

          const textTemplate: string = $store.appStore.get('app.sendTextTemplate')
          const msg = textTemplate.replace('{称号}', player.type).replace('{玩家名}', player.summonerName).replace('{kda}', player.matches.kda || '0.0').replace('{胜率}', player.matches.winRate || '00.0%').replace('{对局}', matchHistoryStr)

          if (gameStatus === 'ChampSelect') {
            // 通过api发送
            await $api.sendMsgInChampSelect('ALL', msg)
          }
          if (gameStatus === 'InProgress') {
            // 通过hook模拟发送
            sendStringInProgress(msg)
          }
        }
      }
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
      $tools.log.error(`[hot key] panel for order hot key throw an error:${err}`)
    }
  })

  iohook.registerShortcut(chaosKey, async keys => {
    try {
      const enableSendHourse = $store.appStore.get('app.enableSendHourse')
      if (!enableSendHourse) return
      const gameStatus = await $api.getGameStatus()
      if (gameStatus != 'InProgress') {
        new Notification({
          title: '面板数据发送失败',
          body: `当前暂未进入游戏对局,不支持发送敌军面板信息`,
          silent: true,
        }).show()
        return
      }
      const data = $utils.cache.get('panelData')
      const count = $store.appStore.get('app.matchCount')
      for (let i = 0; i < data.chaosList.length; i++) {
        let player = data.chaosList[i]
        // 拼接历史对局KDA
        let matchHistoryStr = ''
        // 判断历史对局是否存在
        if (player.matches.data) {
          for (let j = 0; j < count; j++) {
            let historyMatche = player.matches.data[j]
            const temp = `(${historyMatche.kills}.${historyMatche.deaths}.${historyMatche.assists}) `
            matchHistoryStr += temp
          }
        }

        const textTemplate: string = $store.appStore.get('app.sendTextTemplate')
        const msg = textTemplate.replace('{称号}', player.type).replace('{玩家名}', player.summonerName).replace('{kda}', player.matches.kda || '0.0').replace('{胜率}', player.matches.winRate || '00.0%').replace('{对局}', matchHistoryStr)
        // 通过hook模拟发送
        sendStringInProgress(msg)
      }
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
      $tools.log.error(`[hot key] panel for chaos hot key throw an error:${err}`)
    }
  })
  $tools.log.info('[hot key] hot key for panel event is register')
}

export async function muteAllEvent() {
  const muteAllKey: number[] = $store.appStore.get('app.keys.muteAll')
  iohook.registerShortcut(muteAllKey, async keys => {
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
      sendStringInProgress('/mute all')
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
      $tools.log.error(`[hot key] muteAll hot key throw an error:${err}`)
    }
  })
  $tools.log.info(`[hot key] muteAll hot key is register`)
}