const request = require('superagent')
const c = require('../utils/cache')
const { createWebSocketConnection, LeagueClient, createHttpSession, createHttp2Request } = require('league-connect')

exports.createWebSocket = async ctx => {
  try {
    const credentials = c.get('credentials')
    return await createWebSocketConnection(credentials)
  } catch (err) {
    ctx.logger.error(`[net] create websocket throw an error: ${err}`)
  }
}

exports.createClient = ctx => {
  try {
    const credentials = c.get('credentials')
    return new LeagueClient(credentials, {
      pollInterval: 1000,
    })
  } catch (err) {
    ctx.logger.error(`[net] create client throw an error: ${err}`)
  }
}

exports.http2Request = async (url, method = 'GET', postData = null) => {
  try {
    const credentials = c.get('credentials')
    const session = await createHttpSession(credentials)
    const response = await createHttp2Request(
      {
        method,
        url,
        body: postData,
      },
      session,
      credentials,
    )
    session.close()
    return response.json()
  } catch (err) {
    return null
  }
}

exports.superagentRequest = async (url, method = 'GET') => {
  try {
    const credentials = c.get('credentials')
    const r = await request(method, url)
      .set('Connection', 'keep-alive')
      .set('Sec-Fetch-Dest', 'empty')
      .set('Sec-Fetch-Mode', 'cors')
      .set('Sec-Fetch-Site', 'same-origin')
      .set('X-Riot-Source', 'rcp-fe-lol-profiles')
      .ca(credentials.certificate)
    return r.body
  } catch (err) {
    return null
  }
}

exports.superagentHttp2Request = async (url, method = 'GET', data = null) => {
  try {
    const credentials = c.get('credentials')
    const r = await request(method, `https://127.0.0.1:${credentials.port}${url}`)
      .set('Connection', 'keep-alive')
      .set('Sec-Fetch-Dest', 'empty')
      .set('Sec-Fetch-Mode', 'cors')
      .set('Sec-Fetch-Site', 'same-origin')
      .set('X-Riot-Source', 'rcp-fe-lol-profiles')
      .auth('riot', credentials.password) // 认证
      .send(data) //post请求参数
      .ca(credentials.certificate) // tls证书
      // r.http2() // 开启http2
      console.log(r.body);
    return r.body
  } catch (err) {
    return null
  }
}
