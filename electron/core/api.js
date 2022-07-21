const { http2Request, request } = require('../utils/league-connect');

/* LCU API */

/**
 * 当前客户端登入账号信息
 */
exports.getSummonerData = async () => {
  return await http2Request('/lol-summoner/v1/current-summoner');
};

/**
 * 根据puuid排位状态信息
 */
exports.getRankedStatusInfoByPuuid = async (puuid) => {
  return await http2Request(`/lol-ranked/v1/ranked-stats/${puuid}`);
};

/**
 * 根据puuid排位状态信息
 */
exports.getRankedStatusInfoByPuuid = async (puuid) => {
  return await http2Request(`/lol-ranked/v1/ranked-stats/${puuid}`);
};

/**
 * 获取当前房间id （选择英雄时）
 */
exports.getConversationsId = async () => {
  // 在状态刚刚发生改变的时候去获取数据会返回空数组或者不存在房间id的信息，直接给他走个循环
  while (true) {
    const data = await http2Request(`/lol-chat/v1/conversations`);
    if (data != []) {
      for (var i = 0; i < data.length; i++) {
        // 并且存在"type": "championSelect"的房间
        if (data[i].type == 'championSelect') {
          const roomChat = data[i];
          return roomChat.id;
        }
      }
    }
  }
};

/**
 * 返回当前房间所有队友的summonerId
 */
exports.getRoomPlayerIdList = async () => {
  const cId = await this.getConversationsId();
  const data = await http2Request(`/lol-chat/v1/conversations/${cId}/messages`);
  let list = [];
  data.forEach((item) => {
    list.push(item.fromSummonerId);
  });
  return list;
};

/**
 * 获取玩家游戏状态
 */
exports.getGameStatus = async () => {
  return await http2Request(`/lol-gameflow/v1/gameflow-phase`);
};

/**
 * 获取当前客户端所在大区
 */
exports.getEnvironment = async () => {
  return await http2Request(`/riotclient/v1/crash-reporting/environment`);
};

/**
 * 根据profile_icon_id获取头像base64
 */
exports.getLcuImgBase64 = async (imgUrl) => {
  const data = await http2Request(imgUrl);
  return 'data:image/png;base64,' + Buffer.from(data, 'utf8').toString('base64');
};

/**
 * 根据profile_icon_id获取头像base64
 */
exports.getSummonerAvatarBase64 = async (profileIconId) => {
  return await this.getLcuImgBase64(`/lol-game-data/assets/v1/profile-icons/${profileIconId}.jpg`);
};

/**
 * 根据昵称获取puuid
 */
exports.getPuuidBySummonerName = async (summonerName) => {
  const data = await http2Request(`/lol-summoner/v1/summoners?name=${encodeURI(summonerName)}`);
  return data.puuid;
};

/**
 * 根据summonerId获取用户信息
 */
exports.getSummonerBySummonerId = async (summonerId) => {
  return await http2Request(`/lol-summoner/v1/summoners/${summonerId}`);
};

/**
 * 在选人界面聊天框中发送消息(all, self)
 */
exports.sendMsgInChampSelect = async (type, msg) => {
  const chatId = await this.getConversationsId();
  const summoner = await this.getSummonerData();
  let req;
  if (type === 'all') {
    req = {
      body: msg,
      fromId: summoner.summonerId.toString(),
      fromSummonerId: summoner.summonerId,
      isHistorical: false,
      type: 'chat',
    };
  }
  if (type === 'self') {
    req = {
      body: msg,
      type: 'celebration',
    };
  }
  return await http2Request(`/lol-chat/v1/conversations/${chatId}/messages`, 'POST', req);
};

/**
 * 获取puuid玩家的历史20局比赛记录
 */
exports.getHistoryMatchesByPuuid = async (puuid, begin = 0, end = 20) => {
  return await http2Request(`/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begin}&endIndex=${end}`);
};

/**
 * 根据gameId获取对局详情
 */
exports.getHistoryDetailByGameId = async (gameid) => {
  return await http2Request(`/lol-match-history/v1/games/${gameid}`);
};

/**
 * 创建房间
 */
exports.createCustomLobby = async (gameMode, mapId, lobbyName) => {
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
  };
  return await http2Request(`/lol-lobby/v2/lobby`, 'POST', req);
};

/**
 * 发送客户端提醒
 */
exports.sendNotifications = async (title, details) => {
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
  };
  return await http2Request(`/player-notifications/v1/notifications`, 'POST', req);
};

/**
 * 获取当前玩家聊天信息
 */
exports.getPlayerChatInfo = async () => {
  return await http2Request(`/lol-chat/v1/me`);
};

/**
 * 修改当前玩家聊天信息
 */
exports.putPlayerChatInfo = async (info) => {
  return await http2Request(`/lol-chat/v1/me`, 'PUT', info);
};

/**
 * 接受对局
 */
exports.acceptMatchmaking = async () => {
  return await http2Request(`/lol-matchmaking/v1/ready-check/accept`, 'POST');
};

/**
 * 接受对局
 */
exports.spectatorLaunchByName = async (summonerName, gameQueueType) => {
  const req = {
    allowObserveMode: 'ALL',
    dropInSpectateGameId: summonerName,
    gameQueueType: gameQueueType,
  };
  return await http2Request(`/lol-spectator/v1/spectate/launch`, 'POST', req);
};

/**
 * 获取玩家列表（当游戏状态处于inProgress）
 */
exports.getPlayerListInGame = async () => {
  return await request(`https://127.0.0.1:2999/liveclientdata/playerlist`);
};

/**
 * 在选择英雄界面，根据ChampionId选择并确定英雄
 */
exports.selectChampionById = async (championId, cellId, confirm) => {
  const req = {
    championId: championId,
    completed: confirm,
  };
  return await http2Request(`/lol-champ-select/v1/session/actions/${cellId}`, 'PATCH', req);
};

/**
 * 获取选人时房间信息
 */
exports.getSessionInfo = async () => {
  return await http2Request(`/lol-champ-select/v1/session`);
};

/**
 * 获取当前所有的符文配置
 */
exports.getAllRunePage = async () => {
  return await http2Request(`/lol-perks/v1/pages`);
};

/**
 * 应用一套符文配置
 */
exports.postRunePage = async (data) => {
  return await http2Request(`/lol-perks/v1/pages`, 'POST', data);
};

/**
 * 删除一套符文配置
 */
exports.delRunePage = async (id) => {
  return await http2Request(`/lol-perks/v1/pages/${id}`, 'DELETE');
};

/**
 * 获取某英雄的信息（皮肤，台词等）
 * @param{ key: "backgroundSkinId", value: '皮肤id' }
 */
exports.getChampionSkinListById = async (championId) => {
  return await http2Request(`/lol-game-data/assets/v1/champions/${championId}.json`);
};

/**
 * 设置生涯背景
 */
exports.setBackgroundSkinId = async (param) => {
  return await http2Request(`/lol-summoner/v1/current-summoner/summoner-profile`, 'POST', param);
};
