import { ClientHttp2Session } from 'http2'
import request from 'superagent'
import { createHttp2Request, createHttpSession, createWebSocketConnection, LeagueClient, createHttp1Request } from 'league-connect'

export async function createWebsocket() {
  try {
    const credentials = $utils.cache.get('credentials')
    return await createWebSocketConnection(credentials)
  } catch (err) {
    $tools.log.error(`[connect] create websocket throw an error: ${err}`)
  }
}

export function createClient() {
  try {
    const credentials = $utils.cache.get('credentials')
    return new LeagueClient(credentials, {
      pollInterval: 1000,
    })
  } catch (err) {
    $tools.log.error(`[connect] create client throw an error: ${err}`)
  }
}

export async function http1Request(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = 'GET', data: any = null) {
  try {
    const credentials = $utils.cache.get('credentials')
    const r = await request(method, `https://127.0.0.1:${credentials.port}${url}`)
      .auth('riot', credentials.password) // 认证
      .send(data) //post请求参数
      .ca(credentials.certificate) // tls证书
    return r.body
  } catch (err) {
    console.log(err);
    return null
  }
}

let session: ClientHttp2Session | null = null

export async function http2Request(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = 'GET', data: any = null, json: boolean = true) {
  try {
    const credentials = $utils.cache.get('credentials')
    if (!session) {
      session = await createHttpSession(credentials)
    }
    const response = await createHttp2Request(
      {
        url,
        method,
        body: data,
      },
      session,
      credentials,
    )
    // session.close()
    if (json) {
      return response.json()
    } else {
      return response.text()
    }
  } catch (err) {
    return null
  }
}


export async function superagentRequest(url, method = 'GET') {
  try {
    const credentials = $utils.cache.get('credentials')
    const r = await request(method, url).ca(credentials.certificate)
    return r.body
  } catch (err) {
    return null
  }
}