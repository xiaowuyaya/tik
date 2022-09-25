const api = require('./api')
const iohook = require('iohook')
const { Notification, BrowserWindow } = require('electron')
const { appConfig, browserConfig } = require('../store/index')
const { sendStringInProgress, windowKeepTop } = require('../utils/win32')
const c = require('../utils/cache')

exports.createShortcutKeyListen = async ctx => {
  await panelDataEvent(ctx)
  await muteAllEvent(ctx)
  await spellsWindowEvent(ctx)
  iohook.start()
}

const panelDataEvent = async ctx => {
  const orderKey = appConfig.get('keys.order')
  const chaosKey = appConfig.get('keys.chaos')
  iohook.registerShortcut(orderKey, async keys => {
    try {
      const enableSendHourse = appConfig.get('enableSendHourse')
      if (!enableSendHourse) return
      const gameStatus = await api.getGameStatus()
      if (gameStatus == 'ChampSelect' || gameStatus == 'InProgress') {
        const data = c.get('panelData')
        const count = appConfig.get('matchCount')
        for (let i = 0; i < data.orderList.length; i++) {
          let player = data.orderList[i]

          // 拼接历史对局KDA
          let matchHistoryStr = ''
          // 判断历史对局是否存在
          if (player.matches.data) {
            for (let j = 0; j < count; j++) {
              let historyMatche = player.matches.data[j]
              const temp = `[${historyMatche.kills},${historyMatche.deaths},${historyMatche.assists}] `
              matchHistoryStr += temp
            }
          }

          const msg = `${player.type}:${player.summonerName},kda:${player.matches.kda || '0.0'},胜率:${
            player.matches.winRate || '00.0%'
          },最近对局:${matchHistoryStr}`

          if (gameStatus === 'ChampSelect') {
            // 通过api发送
            await api.sendMsgInChampSelect('all', msg)
          }
          if (gameStatus === 'InProgress') {
            // 通过hook模拟发送
            sendStringInProgress(ctx, msg)
          }
        }
      } else {
        new Notification({
          title: '面板数据发送失败',
          body: `当前未在选人界面或游戏中,不支持发送面板信息`,
          silent: true,
        }).show()
      }
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
      ctx.logger.error(`[shortcutKey] panel for order hot key throw an error:${err}`)
    }
  })
  ctx.logger.info('[shortcutKey] panel for order hot key is register')

  iohook.registerShortcut(chaosKey, async keys => {
    try {
      const enableSendHourse = appConfig.get('enableSendHourse')
      if (!enableSendHourse) return
      const gameStatus = await api.getGameStatus()
      if (gameStatus != 'InProgress') {
        new Notification({
          title: '面板数据发送失败',
          body: `当前暂未进入游戏对局,不支持发送敌军面板信息`,
          silent: true,
        }).show()
        return
      }
      const data = c.get('panelData')
      const count = appConfig.get('matchCount')
      for (let i = 0; i < data.chaosList.length; i++) {
        let player = data.chaosList[i]

        // 拼接历史对局KDA
        let matchHistoryStr = ''
        // 判断历史对局是否存在
        if (player.matches.data) {
          for (let j = 0; j < count; j++) {
            let historyMatche = player.matches.data[j]
            const temp = `${historyMatche.kills}.${historyMatche.deaths}.${historyMatche.assists} `
            matchHistoryStr += temp
          }
        }

        const msg = `${player.type}:${player.summonerName},kda:${player.matches.kda || '0.0'},胜率:${
          player.matches.winRate || '00.0%'
        },最近对局:${matchHistoryStr}`

        // 通过hook模拟发送
        sendStringInProgress(ctx, msg)
      }
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
      ctx.logger.error(`[shortcutKey] panel for chaos hot key throw an error:${err}`)
    }
  })
  ctx.logger.info('[shortcutKey] panel for chaos hot key is register')
}

const muteAllEvent = async ctx => {
  const muteAllKey = appConfig.get('keys.muteAll')
  iohook.registerShortcut(muteAllKey, async keys => {
    try {
      const gameStatus = await api.getGameStatus()
      if (gameStatus != 'InProgress') {
        new Notification({
          title: '快捷发送失败',
          body: `当前暂未进入游戏对局,不支持发禁言操作`,
          silent: true,
        }).show()
        return
      }
      sendStringInProgress(ctx, '/mute all')
    } catch (err) {
      new Notification({ title: '快捷发送失败', body: `${err}`, silent: true }).show()
      ctx.logger.info(`[shortcutKey] muteAll hot key throw an error:${err}`)
    }
  })
  ctx.logger.info('[shortcutKey] muteAll hot key is register')
}

const spellsWindowEvent = async ctx => {
  const spellsWindowId = browserConfig.get('browserWindows.spellsWindow')
  const spellWindow = BrowserWindow.fromId(spellsWindowId)

  const spellsWinKey = appConfig.get('spellsWin.key')
  const enable = appConfig.get('spellsWin.enable')
  if (!enable) return
  iohook.registerShortcut(spellsWinKey, async keys => {
    if (!spellWindow.isVisible()) {
      spellWindow.show()
      windowKeepTop('TIK SPELLS')
    } else {
      spellWindow.hide()
    }
  })
  ctx.logger.info('[shortcutKey] handle spells window hot key is register')
}
