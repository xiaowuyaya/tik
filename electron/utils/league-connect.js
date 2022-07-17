const { createWebSocketConnection, createHttp1Request, createHttp2Request, createHttpSession, LeagueClient } = require('league-connect')
const req = require("superagent")
const c = require('../utils/cache')
/**
 * https://github.com/matsjla/league-connect
 */
// const credentials = c.get('credentials')

/* websocket */
exports.ws = async () => {
  const credentials = c.get('credentials')
  return await createWebSocketConnection(credentials)
}

/* client listen */
exports.client = () => {
  return new LeagueClient(credentials, {
    pollInterval: 1000 // Check every second
  })
}

// superagent request
exports.request = async (method, url, isLcu) => {
  try {
    const credentials = c.get('credentials')
    if (isLcu) {
      const resp = await req(method, `https://127.0.0.1:${credentials.port}${url}`)
        .auth("riot", credentials.password) // 认证
        .ca(credentials.certificate) // tls证书
        .http2() // 开启http2
      return resp.body
    } else {
      const r = await req(method, url).ca(credentials.certificate)
      return r.body
    }
  } catch (err) {
    return null
  }
}

/* http1 */
exports.http1Request = async (url, method = 'GET') => {
  const credentials = c.get('credentials')
  try {
    const resp = await createHttp1Request({
      method,
      url
    }, credentials)
    return resp.json()
  } catch (err) {
    return null
  }
}

/* http2 */
exports.http2Request = async (url, method = 'GET', data = null, jsontify = true) => {
  const credentials = c.get('credentials')
  try {
    const session = await createHttpSession(credentials)
    const resp = await createHttp2Request({
      method,
      url,
      body: data
    }, session, credentials)
    session.close()
    if (jsontify) {
      return resp.json()
    }
    return resp
  } catch (err) {
    return null
  }
}