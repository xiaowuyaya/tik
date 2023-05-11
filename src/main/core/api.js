import { superagentHttp2Request, superagentHttp1Request, superagentRequest } from './net'

/**
 * 获取当前登入账号信息
 */
export async function getCurrentSummoner() {
  return await superagentHttp2Request(`/lol-summoner/v1/current-summoner`)
}

/**
 * 根据summonerName获取用户信息
 */
export async function getSummonerInfoBySummonerName(summonerName) {
  return await superagentHttp2Request(`/lol-summoner/v1/summoners?name=${encodeURI(summonerName)}`)
}

/**
 * 根据summonerId获取用户信息
 */
export async function getSummonerInfoBySummonerId(summonerId) {
  return await superagentHttp1Request(`/lol-summoner/v1/summoners/${summonerId}`)
}

/**
 * 获取玩家游戏状态
 */
export async function getGameStatus() {
  return await superagentHttp1Request(`/lol-gameflow/v1/gameflow-phase`)
}

/**
 * 获取当前客户端所在大区
 */
export async function getEnvironment() {
  return await superagentHttp2Request(`/riotclient/v1/crash-reporting/environment`)
}

/**
 * 根据puuid排位状态信息
 */
export async function getRankedStatusInfoByPuuid(puuid) {
  return await superagentHttp2Request(`/lol-ranked/v1/ranked-stats/${puuid}`)
}

export async function getConversationsId() {
  while (true) {
    const data = await superagentHttp2Request(`/lol-chat/v1/conversations`)
    // if (data != []) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        // 并且存在"type": "championSelect"的房间
        if (data[i].type == 'championSelect') {
          return data[i].id
        }
      }
    }
  }
}

export async function getChatRoomPlayerIdList() {
  const cId = await this.getConversationsId()
  const data = await superagentHttp2Request(`/lol-chat/v1/conversations/${cId}/messages`)
  let list = []
  data.forEach(item => {
    list.push(item.fromSummonerId)
  })
  // 这里返回的数组大概率会有重复值，需要进行去重
  list = [...new Set(list)] // 去重
  return list
}

/**
 * 获取选人时房间队友的summonerId (已废弃)
 */
export async function getSummonerIdsInChampSelect() {
  const cId = await this.getConversationsId()
  const data = await superagentHttp2Request(`/lol-chat/v1/conversations/${cId}/messages`)
  let list = []
  data.forEach(item => {
    list.push(item.fromSummonerId)
  })
  return list
}

/**
 * 获取英雄熟练度
 */
export async function getChampionMastery(summonerId, limit) {
  const data = await superagentHttp2Request(`/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=${limit}`)
  return data
}

/**
 * 根据path获取base64图片
 */
export async function getLcuImgBase64(imgUrl) {
  // const credentials = $cache.get('credentials')
  // const isTencent = credentials.region == 'TENCENT'
  // if (isTencent) return `http://127.0.0.1:${credentials.proxyPort}${imgUrl}`
  const data = await superagentHttp1Request(imgUrl, 'GET', null)
  return 'data:image/jpeg;base64,' + Buffer.from(data, 'binary').toString('base64')
}

/**
 * 根据profile_icon_id获取头像base64
 */
export async function getProfileIconBase64(profileIconId) {
  return await getLcuImgBase64(`/lol-game-data/assets/v1/profile-icons/${profileIconId}.jpg`)
}

/**
 * 获取玩家列表（当游戏状态处于inProgress）
 */
export async function getPlayerListInGame() {
  return await superagentRequest(`https://127.0.0.1:2999/liveclientdata/playerlist`)
}

/**
 * 获取游戏状态信息（当游戏状态处于inProgress）
 */
export async function getGameStatusInfo() {
  return await superagentRequest(`https://127.0.0.1:2999/liveclientdata/gamestats`)
}

/**
 * 获取游戏中状态信息（当游戏状态处于inProgress）
 */
export async function getGameEventdata() {
  return await superagentRequest(`https://127.0.0.1:2999/liveclientdata/eventdata`)
}

export async function sendMsgInChampSelect(type, msg) {
  const chatId = await getConversationsId()
  const summoner = await getCurrentSummoner()
  let postData = {}
  if (type === 'ALL') {
    postData = {
      body: msg,
      fromId: summoner.summonerId.toString(),
      fromSummonerId: summoner.summonerId,
      isHistorical: false,
      type: 'chat',
    }
  }
  if (type === 'SELF') {
    postData = {
      body: msg,
      type: 'celebration',
    }
  }
  return await superagentHttp1Request(`/lol-chat/v1/conversations/${chatId}/messages`, 'POST', postData)
}

/**
 * 获取puuid玩家的历史20局比赛记录
 */
// export function getHistoryMatchesByPuuid(puuid, begin = 0, end = 20) {
//   return new Promise(async (resolve, reject)=>{
//     const res = await superagentHttp2Request(`/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begin}&endIndex=${end}`)
//     if (!res) reject(res)
//     resolve(res)
//   })
// }

export async function getHistoryMatchesByPuuidV2(puuid, begin = 0, end = 20) {
  // return reTry(getHistoryMatchesByPuuid(puuid, begin, end), 60)
  return await superagentHttp2Request(`/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begin}&endIndex=${end}`)
}

export async function getHistoryMatchListByAccountId(account, begin = 0, end = 20){
  return await superagentHttp2Request(`/lol-match-history/v3/matchlist/account/${account}?begIndex=${begin}&endIndex=${end}`)
}

export async function getHistoryMatches(account, puuid,  begin = 0, end = 20){
  let res = await superagentHttp2Request(`/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begin}&endIndex=${end}`)
  console.log(res)
  if (!res) {
    res = await superagentHttp2Request(`/lol-match-history/v3/matchlist/account/${account}?begIndex=${begin}&endIndex=${end}`)
  }
  return res
}

/**
 * 根据gameId获取对局详情
 */
export async function getHistoryDetailByGameId(gameid) {
  return await superagentHttp2Request(`/lol-match-history/v1/games/${gameid}`)
}

/**
 * 创建房间
 */
export async function createCustomLobby(gameMode, mapId, lobbyName) {
  let req = {
    customGameLobby: {
      configuration: {
        gameMode: gameMode,
        gameMutator: '',
        gameServerRegion: '',
        mapId: mapId,
        mutators: {
          id: 1,
        },
        spectatorPolicy: 'AllAllowed',
        teamSize: 5,
      },
      lobbyName: lobbyName,
      lobbyPassword: '',
    },
    isCustom: true,
  }
  return await superagentHttp1Request(`/lol-lobby/v2/lobby`, 'POST', req)
}

export async function createLobby(queueId) {
  return await superagentHttp1Request(`/lol-lobby/v2/lobby`, 'POST', { queueId })
}

export async function changePosition(first, second) {
  return await superagentHttp1Request(`/lol-lobby/v1/lobby/members/localMember/position-preferences`, 'PUT', {
    firstPreference: first,
    secondPreference: second,
  })
}

export async function searchGame() {
  return await superagentHttp1Request(`/lol-lobby/v2/lobby/matchmaking/search`, 'POST')
}

/**
 * 发送客户端提醒
 */
export async function sendNotifications(title, details) {
  const req = {
    backgroundUrl: '',
    created: '',
    critical: true,
    data: {
      details: details,
      title: title,
    },
    detailKey: 'pre_translated_details',
    dismissible: true,
    expires: '',
    iconUrl: '',
    id: 0,
    source: '',
    state: 'toast',
    titleKey: 'pre_translated_title',
    type: 'ranked_summary',
  }
  return await superagentHttp1Request(`/player-notifications/v1/notifications`, 'POST', req)
}

/**
 * 获取当前玩家聊天信息
 */
export async function getPlayerChatInfo() {
  return await superagentHttp2Request(`/lol-chat/v1/me`)
}

/**
 * 修改当前玩家聊天信息
 */
export async function putPlayerChatInfo(info) {
  return await superagentHttp1Request(`/lol-chat/v1/me`, 'PUT', info)
}

/**
 * 接受对局
 */
export async function acceptMatchmaking() {
  return await superagentHttp1Request(`/lol-matchmaking/v1/ready-check/accept`, 'POST')
}

/**
 * 接受对局
 */
export async function acceptMatchmaking2() {
  return await superagentHttp1Request(`/lol-matchmaking/v1/ready-check/accept`, 'POST')
}

/**
 * 观战
 */
export async function spectatorLaunchByName(summonerName, gameQueueType) {
  const data = await getSummonerInfoBySummonerName(summonerName)
  const req = {
    allowObserveMode: 'ALL',
    dropInSpectateGameId: summonerName,
    gameQueueType: gameQueueType,
    puuid: data.puuid,
  }
  return await superagentHttp1Request(`/lol-spectator/v1/spectate/launch`, 'POST', req)
}

// export async function getSpectatorLaunch() {
//   return await superagentHttp1Request(`/lol-spectator/v1/spectate`, 'GET')
// }

/**
 * 在选择英雄界面，选择并确定英雄
 */
export async function selectChampionById(championId, cellId, confirm) {
  const req = {
    championId: championId,
    completed: confirm,
  }
  return await superagentHttp1Request(`/lol-champ-select/v1/session/actions/${cellId}`, 'PATCH', req)
}

export async function getCurrentGameMode() {
  // 430 匹配 420 单双排位 440灵活 450 大乱斗 云顶匹配 1090  云顶排位 1100 云顶狂暴 1130 云顶双人作战 1160
  const res = await superagentHttp1Request(`/lol-gameflow/v1/session`, 'GET')
  if (!res) return 0
  return res.gameData.queue.id < 0 ? 430 : res.gameData.queue.id
}

/**
 * 获取选人时房间信息
 */
export async function getSessionInfo() {
  return await superagentHttp2Request(`/lol-champ-select/v1/session`)
}

/**
 * 获取当前所有的符文配置
 */
export async function getAllRunePage() {
  return await superagentHttp2Request(`/lol-perks/v1/pages`)
}

/**
 * 应用一套符文配置
 */
export async function postRunePage(data) {
  return await superagentHttp1Request(`/lol-perks/v1/pages`, 'POST', data)
}

/**
 * 删除一套符文配置
 */
export async function delRunePage(id) {
  return await superagentHttp1Request(`/lol-perks/v1/pages/${id}`, 'DELETE')
}

/**
 * 获取某英雄的信息（皮肤，台词等）
 * @param{ key: "backgroundSkinId", value: '皮肤id' }
 */
export async function getChampionSkinListById(championId) {
  return await superagentHttp2Request(`/lol-game-data/assets/v1/champions/${championId}.json`)
}

/**
 * 设置生涯背景
 */
export async function setBackgroundSkinId(param) {
  return await superagentHttp1Request(`/lol-summoner/v1/current-summoner/summoner-profile`, 'POST', param)
}

/**
 * 用户资料更新（勋章 头衔）
 */
export async function updatePlayerPreferences(data) {
  // TODO: 接口有更新_ https://www.mingweisamuel.com/lcu-schema/tool/#/Plugin%20lol-challenges/PostLolChallengesV1UpdatePlayerPreferencesByProduct
  return await superagentHttp2Request(`/lol-challenges/v1/update-player-preferences`, 'POST', data)
}

export async function regalia(data) {
  return await superagentHttp1Request(`/lol-regalia/v2/current-summoner/regalia`, 'PUT', data)
}

export async function updateIcon(data) {
  return await superagentHttp1Request(`/lol-summoner/v1/current-summoner/icon`, 'PUT', data)
}

export async function friendsRecord() {
  return await superagentHttp1Request(`/lol-store/v1/giftablefriends`, 'GET')
}

export async function mactchMakingSearch() {
  return await superagentHttp1Request('/lol-lobby/v2/lobby/matchmaking/search', 'POST')
}

export async function getCurrentChampion() {
  return await superagentHttp1Request('/lol-champ-select/v1/current-champion', 'GET')
}

export async function updateChatSettings(data) {
  return await superagentHttp1Request(`/lol-chat/v1/settings`, 'PUT', data)
}

export async function updateConversationsParticipants(id, data) {
  return await superagentHttp1Request(`/lol-chat/v1//conversations/${id}/participants`, 'PUT', data)
}

export async function getChatSettings() {
  return await superagentHttp1Request(`/lol-chat/v1/settings`, 'GET')
}

// 强制秒退
export async function quitSelectChamp() {
  return await superagentHttp1Request('/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=["","teambuilder-draft","quitV2",""]', 'POST', null)
}

function reTry(asyncFunction, times){
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    function reTryInside(times){
      console.log(`请求超时, 第${times}重试`);
      asyncFunction().then(res=>{resolve(res)})
        .catch(err=>{
          if (times > 0){
            console.log(`请求超时, 第${times}重试`);
            setTimeout(()=>{
              reTryInside(times -1)
            })
          }else {
            reject(err)
          }
        })
    }
    reTryInside(times)
  })
}