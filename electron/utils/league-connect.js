const { createWebSocketConnection, createHttp1Request, createHttp2Request, createHttpSession, LeagueClient } = require('league-connect')
const request = require("superagent")
const c = require('../utils/cache')
/**
 * https://github.com/matsjla/league-connect
 */
const credentials = c.get('credentials')

/* websocket */
const ws = async () => {
  return await createWebSocketConnection(credentials)
}

/* client listen */
const client = new LeagueClient(credentials, {
  pollInterval: 1000 // Check every second
})

// superagent request
const request = async (method, url) => {
  try {
    const r = await request(method, url).ca(credentials.certificate) // tls证书
    return r.body
  } catch (err) {
    return null
  }
}

/* http1 */
const http1Request = async (url, method = 'GET') => {
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
const http2Request = async (url, method = 'GET', data = null) => {
  try {
    const session = await createHttpSession(credentials)
    const resp = await createHttp2Request({
      method,
      url,
      body: data
    }, session, credentials)
    session.close()
    return resp.json()
  } catch (err) {
    return null
  }
}

module.exports = {
  ws,
  client,
  request,
  http1Request,
  http2Request
}