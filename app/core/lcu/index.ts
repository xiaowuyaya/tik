import { BrowserWindow } from 'electron';
import os from 'os'
import { authenticate } from 'league-connect'
import { createClientListen, createWebsocketListen } from './monitor'

let AUTH_CONFIG: any = {
  awaitConnection: true,
  pollInterval: 500,
}

export async function createCredentialsService(mainWindow: BrowserWindow) {
  const isWin7 = os.release().startsWith('6.1')
  if (isWin7) {
    AUTH_CONFIG = {
      ...AUTH_CONFIG,
      windowsShell: 'cmd',
      useDeprecatedWmic: true
    }
  } else {
    AUTH_CONFIG = {
      ...AUTH_CONFIG,
      windowsShell: 'powershell',
      useDeprecatedWmic: false
    }
  }

  $tools.log.info(`[lcu] wait for league client launch...`)

  authenticate(AUTH_CONFIG).then(async credentials => {
    setTimeout(() => { }, 1000)
    $tools.log.info(`[lcu] createCredentialsService success, addr: https://riot:${credentials.password}@127.0.0.1:${credentials.port}`)
    $utils.cache.put('credentials', credentials)
    let isLaunch = false
    let keepAliveInterval = setInterval(async () => {
      const gameStatus = await $api.getGameStatus()
      const gameStatusH1 = await $api.getGameStatusHttp1()
      if (gameStatus && !isLaunch) {
        /* 创建客户端监听 */
        await createClientListen()
        /* 创建websocket监听 */
        await createWebsocketListen(mainWindow)

        isLaunch = true
        /* keep-alive */
        mainWindow.webContents.send('keep-alive', { isLaunch })
        clearInterval(keepAliveInterval)
      }
    }, 1500)
  }).catch(err => {
    $tools.log.error(`[lcu] createCredentialsService throw an error: ${err}`)
  })
}