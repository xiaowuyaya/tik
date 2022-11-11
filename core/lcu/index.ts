import {BrowserWindow} from 'electron';
import os from 'os'
import {authenticate} from 'league-connect'
import {createHttpProxyServer} from "./connect";
import {createClientListen, createWebsocketListen} from './monitor'
import {createHotKeyListen} from "../performance/hot_key";

let AUTH_CONFIG: any = {
  awaitConnection: true,
  pollInterval: 500,
}

export async function createCredentialsService(mainWindow: BrowserWindow) {
  const isWin7 = os.release().startsWith('6.1')
  if (isWin7) {
    AUTH_CONFIG = {
      ...AUTH_CONFIG,
      useDeprecatedWmic: true
    }
  } else {
    AUTH_CONFIG = {
      ...AUTH_CONFIG,
      windowsShell: 'powershell',
      useDeprecatedWmic: false
    }
  }

  $log.info(`[lcu] wait for league client launch...`)

  authenticate(AUTH_CONFIG).then(async credentials => {
    $log.info(`[lcu] createCredentialsService success, addr: https://riot:${credentials.password}@127.0.0.1:${credentials.port}`)
    $cache.put('credentials', credentials)

    /* 20221101 创建http1 proxy server */
    const proxyChildProcess = await createHttpProxyServer()

    setTimeout(() => {
    }, 1500)
    let isLaunch = false
    let keepAliveInterval = setInterval(async () => {
      const gameStatus = await $api.getGameStatusHttp1()
      if (gameStatus && !isLaunch) {
        /* 创建客户端监听 */
        await createClientListen()
        /* 创建websocket监听 */
        await createWebsocketListen(mainWindow)
        /* 创建快捷键监听 */
        await createHotKeyListen()

        isLaunch = true
        mainWindow.webContents.send('league-client-launch', {isLaunch})
        const checkWin = BrowserWindow.fromId($cache.get('window:check-launch'))
        setTimeout(() => {
          checkWin.hide()
          mainWindow.reload()
          mainWindow.show()
        }, 1000)

        clearInterval(keepAliveInterval)
      }
    }, 1500)
  }).catch(err => {
    $log.error(`[lcu] createCredentialsService throw an error: ${err}`)
  })
}