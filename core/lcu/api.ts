import { http2Request, http1Request, superagentRequest } from "./connect"

/**
 * 获取当前登入账号信息
 */
export async function getCurrentSummoner() {
  return await http2Request(`/lol-summoner/v1/current-summoner`)
}

/**
 * 根据summonerName获取用户信息
 */
export async function getSummonerInfoBySummonerName(summonerName: string) {
  return await http2Request(`/lol-summoner/v1/summoners?name=${encodeURI(summonerName)}`)
}

/**
 * 根据summonerId获取用户信息
 */
export async function getSummonerInfoBySummonerId(summonerId: string | number) {
  return await http1Request(`/lol-summoner/v1/summoners/${summonerId}`)
}

/**
 * 获取玩家游戏状态
 */
export async function getGameStatus() {
  return await http2Request(`/lol-gameflow/v1/gameflow-phase`)
}

export async function getGameStatusHttp1() {
  return await http1Request(`/lol-gameflow/v1/gameflow-phase`)
}

/**
 * 获取当前客户端所在大区
 */
export async function getEnvironment() {
  return await http2Request(`/riotclient/v1/crash-reporting/environment`)
}

/**
 * 根据puuid排位状态信息
 */
export async function getRankedStatusInfoByPuuid(puuid: string | number) {
  return await http1Request(`/lol-ranked/v1/ranked-stats/${puuid}`)
}


export async function getConversationsId() {
  while (true) {
    const data: any | null = await http2Request(`/lol-chat/v1/conversations`)
    // if (data != []) {
    if (data) {
      for (var i = 0; i < data.length; i++) {
        // 并且存在"type": "championSelect"的房间
        if (data[i].type == 'championSelect') {
          return data[i].id
        }
      }
    }
  }
}

/**
 * 获取选人时房间队友的summonerId (已废弃)
 */
export async function getSummonerIdsInChampSelect() {
  const cId = await this.getConversationsId()
  const data: any = await http2Request(`/lol-chat/v1/conversations/${cId}/messages`)
  let list: any = []
  data.forEach(item => {
    list.push(item.fromSummonerId)
  })
  return list
}

/**
 * 获取英雄熟练度
 */
export async function getChampionMastery(summonerId: string, limit: number) {
  const data = await http2Request(`/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=${limit}`)
  return data
}

/**
 * 根据path获取base64图片
 */
export async function getLcuImgBase64(imgUrl: string) {
  // return `http://127.0.0.1:${$tools.HTTP_PROXY_PORT}${imgUrl}`
  const data = await http1Request(imgUrl, 'GET', null)
  return 'data:image/jpeg;base64,' + Buffer.from(data, 'binary').toString('base64')
}

/**
 * 根据profile_icon_id获取头像base64
 */
export async function getProfileIconBase64(profileIconId: string) {
  // return `http://127.0.0.1:${$tools.HTTP_PROXY_PORT}/lol-game-data/assets/v1/profile-icons/${profileIconId}.jpg`
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

export async function sendMsgInChampSelect(type: 'ALL' | 'SELF', msg: string) {
  const chatId = await getConversationsId()
  const summoner: any = await getCurrentSummoner()
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
  return await http1Request(`/lol-chat/v1/conversations/${chatId}/messages`, 'POST', postData)
}

/**
 * 获取puuid玩家的历史20局比赛记录
 */
export async function getHistoryMatchesByPuuid(puuid: string | number, begin: number = 0, end: number = 20) {
  return await http2Request(`/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begin}&endIndex=${end}`)
}

/**
 * 根据gameId获取对局详情
 */
export async function getHistoryDetailByGameId(gameid: string | number) {
  return await http2Request(`/lol-match-history/v1/games/${gameid}`)
}

/**
 * 创建房间
 */
export async function createCustomLobby(gameMode: string, mapId: string | number, lobbyName: string) {
  const req = {
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
  return await http1Request(`/lol-lobby/v2/lobby`, 'POST', req)
}

/**
 * 发送客户端提醒
 */
export async function sendNotifications(title: string, details: string) {
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
  return await http1Request(`/player-notifications/v1/notifications`, 'POST', req)
}


/**
 * 获取当前玩家聊天信息
 */
export async function getPlayerChatInfo() {
  return await http2Request(`/lol-chat/v1/me`)
}

/**
 * 修改当前玩家聊天信息
 */
export async function putPlayerChatInfo(info: any) {
  return await http1Request(`/lol-chat/v1/me`, 'PUT', info)
}

/**
 * 接受对局
 */
export async function acceptMatchmaking() {
  return await http1Request(`/lol-matchmaking/v1/ready-check/accept`, 'POST')
}

/**
 * 观战
 */
export async function spectatorLaunchByName(summonerName: string, gameQueueType: string) {
  const req = {
    allowObserveMode: 'ALL',
    dropInSpectateGameId: summonerName,
    gameQueueType: gameQueueType,
  }
  return await http1Request(`/lol-spectator/v1/spectate/launch`, 'POST', req)
}

/**
 * 在选择英雄界面，选择并确定英雄
 */
export async function selectChampionById(championId: string | number, cellId: string | number, confirm: boolean) {
  const req = {
    championId: championId,
    completed: confirm,
  }
  return await http1Request(`/lol-champ-select/v1/session/actions/${cellId}`, 'PATCH', req)
}

/**
 * 获取选人时房间信息
 */
export async function getSessionInfo() {
  return await http2Request(`/lol-champ-select/v1/session`)
}

/**
 * 获取当前所有的符文配置
 */
export async function getAllRunePage() {
  return await http2Request(`/lol-perks/v1/pages`)
}

/**
 * 应用一套符文配置
 */
export async function postRunePage(data: any) {
  return await http1Request(`/lol-perks/v1/pages`, 'POST', data)
}

/**
 * 删除一套符文配置
 */
export async function delRunePage(id: string | number) {
  return await http1Request(`/lol-perks/v1/pages/${id}`, 'DELETE')
}

/**
 * 获取某英雄的信息（皮肤，台词等）
 * @param{ key: "backgroundSkinId", value: '皮肤id' }
 */
export async function getChampionSkinListById(championId: string | number) {
  return await http2Request(`/lol-game-data/assets/v1/champions/${championId}.json`)
}

/**
 * 设置生涯背景
 */
export async function setBackgroundSkinId(param: any) {
  return await http1Request(`/lol-summoner/v1/current-summoner/summoner-profile`, 'POST', param)
}

/**
 * 用户资料更新（勋章 头衔）
 */
export async function updatePlayerPreferences(data:any) {
  return await http1Request(`/lol-challenges/v1/update-player-preferences`, 'POST', data)
}

export async function regalia(data:any) {
  return await http1Request(`/lol-regalia/v2/current-summoner/regalia`, 'PUT', data)
}

export async function updateIcon(data:any){
  return await http1Request(`/lol-summoner/v1/current-summoner/icon`, 'PUT', data)
}