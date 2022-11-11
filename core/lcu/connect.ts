/**
 * lcu请求链接相关
 */

import { spawn } from "child_process";
import { app } from "electron";
import request from 'superagent'
import path from "path";
import { ClientHttp2Session } from "http2";
import { createHttp2Request, createHttpSession } from "league-connect";


/**
 * 创建一个http代理服务，用于转发http1请求到lcu
 */
export async function createHttpProxyServer() {
  const credentials = $cache.get('credentials')
  const auth = "Basic " + Buffer.from(`riot:${credentials.password}`).toString("base64")
  const proxyChildProcess = spawn($consts.PROXY_EXE_PATH, ['-h', `https://127.0.0.1:${credentials.port}`, '-p', `${$consts.HTTP_PROXY_PORT}`, '-a', auth, '-pid', `process.pid`])
  proxyChildProcess.stdout.on('data', data => {
    // $tools.log.info(`[connect] createHttpProxyServer out: ${data}`)
  })
  proxyChildProcess.stderr.on('data', data => {
    // $tools.log.info(`[connect] createHttpProxyServer out: ${data}`)
  })
  proxyChildProcess.on('close', code => {
    // $tools.log.error(`[connect] createHttpProxyServer exit: ${code}`)
  })
  proxyChildProcess.on('error', code => {
    // $tools.log.error(`[connect] createHttpProxyServer error: ${code}`)
  })
  return proxyChildProcess
}

export async function http1Request(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = 'GET', data: any = null) {
  try {
    const r = await request(method, `http://127.0.0.1:${$consts.HTTP_PROXY_PORT}${url}`).send(data)
    return r.body
  } catch (err) {
    console.log(err);
    return null
  }
}

export async function http2Request(url: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = 'GET', data: any = null) {
  try {
    const credentials = $cache.get('credentials')
    let session: ClientHttp2Session = await createHttpSession(credentials)
    const response = await createHttp2Request(
      {
        url,
        method,
        body: data,
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
export async function superagentRequest(url: string, method = 'GET') {
  try {
    const credentials = $cache.get('credentials')
    const r = await request(method, url).set('Connection', 'keep-alive').ca(credentials.certificate)
    return r.body
  } catch (err) {
    return null
  }
}