const { createChampionRuneWindow, createSpellsWindow } = require('../core/browser')
const { join } = require('path')
const { authenticate } = require('league-connect')
const { createClientListen, createWebsocketListen } = require('../core/monitor')
const api = require('../core/api')
const { createShortcutKeyListen } = require('../core/shortcutKey')
const c = require('../utils/cache')

module.exports = {
  async install(ctx) {
    createBrowserWindow(ctx)
    await createCredentialsService(ctx)
    await createShortcutKeyListen(ctx)
  },
}

const createBrowserWindow = ctx => {
  const preload = join(__dirname, '../core/preload.js')

  createChampionRuneWindow(ctx, preload)
  createSpellsWindow(ctx, preload)
  ctx.logger.info(`[initialize] createBrowserWindow done.`)
}

const authenticationOptions = [
  {
    windowsShell: 'cmd',
    useDeprecatedWmic: true,
  },
  {
    windowsShell: 'powershell',
    useDeprecatedWmic: false,
  },
]

const createCredentialsService = async ctx => {
  let credentials
  try {
    try {
      credentials = await authenticate(authenticationOptions[0])
    } catch (error) {
      // 部分win7以上电脑没有wimc，采用pws方式获取凭证
      credentials = await authenticate(authenticationOptions[1])
    }
    ctx.logger.info(
      `[initialize] createCredentialsService success, addr: https://riot:${credentials.password}@127.0.0.1:${credentials.port}`,
    )
  } catch (err) {
    ctx.logger.error(`[initialize] createCredentialsService throw an error: ${err}`)
    return
  }

  c.put('credentials', credentials)

  if (credentials) {
    createClientListen(ctx)
    await createWebsocketListen(ctx)
  }

  await api.sendNotifications('Tik🎮', 'Tik英雄联盟对局助手已启动！💕')
}
