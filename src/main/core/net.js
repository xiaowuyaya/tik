import Websocket from 'ws'
import superagent from 'superagent'
import cache from '../tools/cache'
import log from '../tools/log'
import https from 'https'
import {getGameStatus} from './api'

export async function createLeagueWebSocket() {
  const credentials = cache.get('credentials')
  return await new Promise(async (resolve, reject) => {
    const ck = await getGameStatus()
    if (!ck) {
      log.error('checkConnection fail')
      reject('checkConnection fail')
    }

    try {
      const ws = new LeagueWebSocket(`wss://riot:${credentials.password}@127.0.0.1:${credentials.port}`, {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`riot:${credentials.password}`).toString('base64'),
        },
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      ws.on('error', err => {
        log.error(`createLeagueWebSocket err: ${err}`)
        reject(null)
      })
      ws.on('close', () => {
        $winManage.global.main.webContents.send('lcu-connection-close', new Date().getTime())
        log.error(`createLeagueWebSocket disconnect`)
      })
      resolve(ws)
    } catch (err) {
      log.error(`createLeagueWebSocket err: ${err}`)
      reject('websocket 链接创建失败')
    }
  })
}

export async function superagentHttp2Request(url, method = 'GET', data) {
  return leagueRequest(url, method, data, true)
}

export async function superagentHttp1Request(url, method = 'GET', data) {
  return leagueRequest(url, method, data)
}

export async function superagentRequest(url, method = 'GET') {
  try {
    const credentials = cache.get('credentials')
    const r = await superagent(method, url).ca(credentials.certificate)
    return r.body
  } catch (err) {
    // log.error(`superagentRequest err: ${err}`)
    return null
  }
}

async function leagueRequest(url, method, data, http2 = false) {
  try {
    const credentials = cache.get('credentials')
    url = `https://127.0.0.1:${credentials.port}${url}`
    let response = null

    if (http2) {
      if (method === 'GET') {
        response = await superagent(method, url).timeout(3000).set('user-agent', 'LeagueOfLegendsClient/13.8.504.8951 (rcp-be-lol-anti-addiction)').auth('riot', credentials.password).query(data).ca(credentials.certificate).http2()
      } else {
        response = await superagent(method, url).timeout(3000).set('user-agent', 'LeagueOfLegendsClient/13.8.504.8951 (rcp-be-lol-anti-addiction)').auth('riot', credentials.password).send(data).ca(credentials.certificate).http2()
      }
    } else {
      if (method === 'GET') {
        response = await superagent(method, url).timeout(3000).set('user-agent', 'LeagueOfLegendsClient/13.8.504.8951 (rcp-be-lol-anti-addiction)').auth('riot', credentials.password).query(data).ca(credentials.certificate)
      } else {
        response = await superagent(method, url).timeout(3000).set('user-agent', 'LeagueOfLegendsClient/13.8.504.8951 (rcp-be-lol-anti-addiction)').auth('riot', credentials.password).send(data).ca(credentials.certificate)
      }
    }

    return response.body
  } catch (err) {
    log.error(`leagueRequest err: ${url} - ${err}`)
    return null
  }
}

class LeagueWebSocket extends Websocket {
  constructor(address, options) {
    super(address, options)
    this.subscriptions = new Map()
    this.on('open', () => {
      this.send(JSON.stringify([5, 'OnJsonApiEvent']))
    })
    this.on('message', content => {
      var _a
      try {
        const json = JSON.parse(content)
        const [res] = json.slice(2)
        if (this.subscriptions.has(res.uri)) {
          ;(_a = this.subscriptions.get(res.uri)) === null || _a === void 0
            ? void 0
            : _a.forEach(cb => {
              cb(res.data, res)
            })
        }
      } catch (_b) {
        /* empty */
      }
    })
  }

  subscribe(path, effect) {
    var _a
    const p = `/${(0, trim)(path)}`
    if (this.subscriptions.has(p)) this.unsubscribe(p)
    if (!this.subscriptions.has(p)) {
      this.subscriptions.set(p, [effect])
    } else {
      ;(_a = this.subscriptions.get(p)) === null || _a === void 0 ? void 0 : _a.push(effect)
    }
  }

  unsubscribe(path) {
    const p = `/${(0, trim)(path)}`
    this.subscriptions.delete(p)
  }
}

function trim(s) {
  let r = s
  while (r.startsWith('/')) {
    r = r.substring(1)
  }
  return r
}
