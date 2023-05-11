import ffi from 'ffi-napi'
import { DLL_PATH, ROOT_URI } from './constant'
import { resolve } from 'path'
import log from './log'
import superagent from 'superagent'
import { shell } from 'electron'
import { exec } from 'child_process'

const TOOLS_DLL_PATH = resolve(DLL_PATH, 'TIK_LIB.dll')

/**
 * 在游戏内发送文本内容
 * @param msg
 */
export function sendMsgInLeagueGame(msg) {
  const dll = new ffi.Library(TOOLS_DLL_PATH, {
    sendMsg: ['int', ['string']],
  })
  const execRes = dll.sendMsg(encodeURI(msg))
  if (execRes === 0) {
    log.error(`[utils] sendMsgInLeagueGame fail : ${msg}`)
    return execRes
  }
  log.info(`[utils] sendMsgInLeagueGame success: ${msg}`)
  return execRes
}

/**
 * 获取当前客户端窗口
 * @returns {*}
 */
export function getLeagueClientWindowInfo() {
  const dll = new ffi.Library(TOOLS_DLL_PATH, {
    getGameWindowInfo: ['string', []],
  })
  const execRes = dll.getGameWindowInfo()
  return JSON.parse(execRes)
}

/**
 * 更改101配置
 * @param config
 * @returns {Promise<*>}
 */
export function call101ServerConfig(config) {
 return null
}

export async function call101ServerInject(uid) {
  return null
}

export async function callBingxueServerInject() {
  return null
}

export function callBingxueServerUninstall() {
  return null
}
