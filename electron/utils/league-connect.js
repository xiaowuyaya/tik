const { authenticate, createWebSocketConnection, createHttp1Request, createHttp2Request, createHttpSession, LeagueClient } = require('league-connect')

/**
 * https://github.com/matsjla/league-connect
 */

let authenticationOptions = [{
  windowsShell: 'cmd',
  useDeprecatedWmic: true
}, {
  windowsShell: 'powershell',
  useDeprecatedWmic: false
}]

try {
  credentials = await authenticate(authenticationOptions[0])
} catch (error) {
  // 部分win7以上电脑没有wimc，采用pws方式获取凭证
  credentials = await authenticate(authenticationOptions[1])
}

/* websocket */
const ws = await createWebSocketConnection(credentials)

/* client listen */
const client = new LeagueClient(credentials, {
  pollInterval: 1000 // Check every second
})

/* http1 */
const http1Request = async (method = 'GET', url) => {
  const resp = await createHttp1Request({
    method,
    url
  }, credentials)
  return resp
}

/* http2 */
const http2Request = async (method = 'GET', url) => {
  const session = await createHttpSession(credentials)
  const resp = await createHttp2Request({
    method,
    url
  }, session, credentials)
  session.close()
  return resp
}

module.exports = {
  ws,
  client,
  http1Request,
  http2Request
}