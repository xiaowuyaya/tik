import _ from 'lodash'
import { sendMsgInLeagueGame } from './dll'
import { gameDataStore } from './store'
import { execSync } from 'child_process'
import { RIOT_GAMES_CERT } from './constant'
import superagent from 'superagent'
import { getGameStatus, sendMsgInChampSelect } from '../core/api'
import { clipboard } from 'electron'
import { setCheckingStatus } from '../core/monitor'
import cache from './cache'
import log from './log'

const iconv = require('iconv-lite')

export function leagueClientAuthenticate() {
  setCheckingStatus(0, '运行环境检查校验中')
  let cmd
  try {
    cmd = execSync(`wmic process where caption='LeagueClientUx.exe' get commandline`).toString()
  } catch (err) {
    cmd = execSync(`Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE 'LeagueClientUx.exe'" | Select-Object CommandLine | fl`, { shell: 'powershell' }).toString()
  }

  if (!cmd.includes('app-pid')) throw new Error('未获取到游戏客户端链接凭证，是否已启动游戏?')

  let stdout = cmd.replace(/\s/g, '')
  const [, port] = stdout.match(/--app-port=([0-9]+)/)
  const [, password] = stdout.match(/--remoting-auth-token=([\w-_]+)/)
  const [, pid] = stdout.match(/--app-pid=([0-9]+)/)
  const [, region] = stdout.match(/--region=([0-9A-Za-z]+)/)
  const certificate = RIOT_GAMES_CERT
  const credentials = { pid, port, password, certificate, region }

  cache.set('credentials', credentials)
  log.info(`createCredentialsService success, addr: https://riot:${credentials.password}@127.0.0.1:${credentials.port} (${credentials.region})`)
  setCheckingStatus(0, '客户端凭证获取成功')
  if (!password) throw new Error('未获取到游戏客户端链接凭证，是否已启动游戏?')

  return credentials
}

const htp1Get = async (url, data = false) => {
  try {
    const r = await superagent('GET', url).query(data)
    return JSON.parse(iconv.decode(r.body, 'gbk'))
  } catch (err) {
    $log.error('weGameApi htp1GetErr', url, err)
  }
}

// 获取游戏版本
export async function getGameClientVersionData() {
  const r = await htp1Get(`https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js`)
  return r.version
}
// 获取所有英雄列表
export async function getChampsData() {
  const r = await htp1Get(`https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js`)
  return r.hero
}

// 获取所有装备
export async function getItemsData() {
  const r = await htp1Get(`https://game.gtimg.cn/images/lol/act/img/js/items/items.js`)
  return r.items
}

// wegame 获取所有天赋列表
export async function getRunesData() {
  const r = await htp1Get(`https://game.gtimg.cn/images/lol/act/img/js/runeList/rune_list.js`)
  return r.rune
}

export function translate(type, key) {
  const gameConstant = gameDataStore.get('constant')
  const config = gameConstant[type]

  if (type === 'queue' && !hasChinese(config[key])) return '未知'

  if (type === 'environment') return config[key] || key

  return config[key] || '未知'
}

export async function sendMessage(str, type = 'SELF') {
  const gameStatus = await getGameStatus()
  if (gameStatus === 'ChampSelect') await sendMsgInChampSelect(type, str)

  if (gameStatus === 'InProgress') sendMsgInLeagueGame(str)
}

/**
 * 获取召唤师头像图片地址
 */
export function getProfileIcon(profileIcon) {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIcon}.png`
}

/**
 * 通过英雄id获取头像
 */
export function getChampionAvatarById(championId) {
  const champions = gameDataStore.get('champions')
  const alias = champions[championId].alias
  if (alias) return `https://game.gtimg.cn/images/lol/act/img/champion/${alias}.png`
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/29.png`
}

/**
 * 通过英雄id获取相关信息
 */
export function getChampionById(championId) {
  const champions = gameDataStore.get('champions')
  return champions[championId] || {}
}

/**
 * 通过英雄中文名获取头像
 */
export function getChampionAvatarByCnName(cnName) {
  const championDict = gameDataStore.get('championDict')
  const champ = _.find(championDict, { name: cnName })
  if (champ) return `https://game.gtimg.cn/images/lol/act/img/champion/${champ.alias}.png`
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/29.png`
}

/**
 * 通过召唤师技能id获取信息
 */
export function getSpellInfoById(spellId) {
  try {
    const spells = gameDataStore.get('spells')
    const key = _.findKey(spells, { key: `${spellId}` })
    return spells[key] || {}
  } catch (err) {
    return {}
  }
}

/**
 * 通过符文id获取信息
 */
export function getPerkInfoById(perkId) {
  const gameRunes = gameDataStore.get('runes')
  return gameRunes[perkId] || {}
}

/**
 * 获取装备图片
 */
export function getItemsImgById(id) {
  if (id === 7013) return `https://game.gtimg.cn/images/lol/act/img/item/3802.png`
  if (id === 7004) return `https://game.gtimg.cn/images/lol/act/img/item/3068.png`
  if (id === 0) return 'https://gw.alipayobjects.com/zos/rmsportal/wYnHWSXDmBhiEmuwXsym.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng'
  return `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`
}

export function copyText(str) {
  clipboard.writeText(str)
}

/**
 * 是否包含中文
 */
export function hasChinese(str) {
  return /[\u4E00-\u9FA5]+/g.test(str)
}
