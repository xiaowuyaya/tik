import * as api from './api'
import { translate } from '../utils/translate'
import { panelData, appConfig, blacklist } from '../utils/config'
import _ from 'loadsh'
import { getChampionAvatarByCnName, getProfileIcon } from '../utils'

export const lcuApi = api

export const currentSummonerInfo = async () => {
  let currentSummoner = {
    gameStatus: '',
    avatar: '',
    summonerLevel: '',
    displayName: '',
    summonerId: '',
    puuid: '',
    environment: '',
    rank: {
      rankedHighestTier: '',
      rankedHighest: '',
      rankedSoloTier: '',
      rankedSolo: '',
      rankedFlexTier: '',
      rankedFlex: '',
    },
    historyMatch: [],
    championMastery: {
      source: null,
      masteries: []
    },
    showData: {
      kda: '',
      damage: '',
      money: ''
    },
    rencentlyPosition: []
  }

  const gameStatus = await api.getGameStatus()
  currentSummoner.gameStatus = translate('status', gameStatus);

  const summoner = await api.getCurrentSummoner()

  currentSummoner.displayName = summoner.displayName
  currentSummoner.summonerId = summoner.summonerId
  currentSummoner.puuid = summoner.puuid
  currentSummoner.summonerLevel = summoner.summonerLevel
  currentSummoner.avatar = getProfileIcon(summoner.profileIconId)

  const environment = await api.getEnvironment();
  currentSummoner.environment = translate('environment', environment.environment)

  const rankStatus = await api.getRankedStatusInfoByPuuid(summoner.puuid);
  currentSummoner.rank.rankedHighestTier = rankStatus.highestPreviousSeasonEndTier
  currentSummoner.rank.rankedHighest = `${translate('rank', rankStatus.highestPreviousSeasonEndTier)} ${rankStatus.highestPreviousSeasonEndDivision}`
  currentSummoner.rank.rankedSoloTier = rankStatus.queueMap.RANKED_SOLO_5x5.tier
  currentSummoner.rank.rankedSolo = `${translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division} ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`
  currentSummoner.rank.rankedFlexTier = rankStatus.queueMap.RANKED_FLEX_SR.tier
  currentSummoner.rank.rankedFlex = `${translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division} ${rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints}`

  const hisotryMatch = await api.getHistoryMatchesByPuuid(summoner.puuid, 0, 40)
  currentSummoner.historyMatch = hisotryMatch.games.games

  let totalKill = 0
  let totalDeath = 0
  let totalAssist = 0
  let totalMoney = 0
  let totalDamage = 0
  let positions: any = []
  _.forEach(hisotryMatch.games.games, (match: any) => {
    totalKill += match.participants[0].stats.kills
    totalDeath += match.participants[0].stats.deaths
    totalAssist += match.participants[0].stats.assists
    totalMoney += match.participants[0].stats.goldEarned
    totalDamage += match.participants[0].stats.physicalDamageDealtToChampions
    const positon = match.participants[0].timeline.lane
    const isWin = match.participants[0].stats.win
    positon == 'NONE' ? () => { } : positions.push({ positon, isWin })
  })
  currentSummoner.showData.kda = ((totalKill + totalAssist) / totalDeath * 3).toFixed(2)
  currentSummoner.showData.damage = (totalDamage / 20).toFixed(0)
  currentSummoner.showData.money = (totalMoney / 20).toFixed(0)

  let rencentlyPositionTemp: any = {}
  let rencentlyPosition: any = {}
  _.forEach(positions, (data: any) => {
    if (!rencentlyPositionTemp[data.positon]) {
      rencentlyPositionTemp[data.positon] = []
    }
    rencentlyPositionTemp[data.positon].push(data.isWin)
  })


  _.forIn(rencentlyPositionTemp, (val: any, key: string) => {
    if (val.length > 2) {
      let wins = 0
      let total = val.length
      _.forEach(val, (isWin: boolean) => {
        if (isWin) wins += 1
      });
      rencentlyPosition[key] = { wins, total }
    }
  })

  currentSummoner.rencentlyPosition = rencentlyPosition

  const championMastery = await api.getChampionMastery(summoner.summonerId, 4)
  currentSummoner.championMastery = championMastery

  return currentSummoner
}

export const checkSummonerExist = async (summonerName: string) => {
  const summoner = await api.getSummonerInfoBySummonerName(summonerName)
  if (summoner.errorCode && summoner.errorCode == 'RPC_ERROR') {
    return false
  }
  return true
}

export const searchSummonerInfo = async (summonerName: string) => {
  let currentSummoner = {
    avatar: '',
    summonerLevel: '',
    summonerId: '',
    puuid: '',
    displayName: '',
    environment: '',
    rank: {
      rankedHighestTier: '',
      rankedHighest: '',
      rankedSoloTier: '',
      rankedSolo: '',
      rankedFlexTier: '',
      rankedFlex: '',
    },
    historyMatch: [],
    championMastery: {
      source: null,
      masteries: []
    },
    showData: {
      kda: '',
      damage: '',
      money: ''
    },
    rencentlyPosition: []
  }
  const summoner = await api.getSummonerInfoBySummonerName(summonerName)
  console.log(summoner);

  currentSummoner.displayName = summoner.displayName
  currentSummoner.summonerId = summoner.summonerId
  currentSummoner.puuid = summoner.puuid
  currentSummoner.summonerLevel = summoner.summonerLevel
  currentSummoner.avatar = getProfileIcon(summoner.profileIconId)

  const environment = await api.getEnvironment();
  currentSummoner.environment = translate('environment', environment.environment)

  const rankStatus = await api.getRankedStatusInfoByPuuid(summoner.puuid);
  currentSummoner.rank.rankedHighestTier = rankStatus.highestPreviousSeasonEndTier
  currentSummoner.rank.rankedHighest = `${translate('rank', rankStatus.highestPreviousSeasonEndTier)} ${rankStatus.highestPreviousSeasonEndDivision}`
  currentSummoner.rank.rankedSoloTier = rankStatus.queueMap.RANKED_SOLO_5x5.tier
  currentSummoner.rank.rankedSolo = `${translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division} ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`
  currentSummoner.rank.rankedFlexTier = rankStatus.queueMap.RANKED_FLEX_SR.tier
  currentSummoner.rank.rankedFlex = `${translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division} ${rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints}`

  const hisotryMatch = await api.getHistoryMatchesByPuuid(summoner.puuid, 0, 21)
  currentSummoner.historyMatch = hisotryMatch.games.games

  let totalKill = 0
  let totalDeath = 0
  let totalAssist = 0
  let totalMoney = 0
  let totalDamage = 0
  let positions: any = []
  _.forEach(hisotryMatch.games.games, (match: any) => {
    totalKill += match.participants[0].stats.kills
    totalDeath += match.participants[0].stats.deaths
    totalAssist += match.participants[0].stats.assists
    totalMoney += match.participants[0].stats.goldEarned
    totalDamage += match.participants[0].stats.physicalDamageDealtToChampions
    const positon = match.participants[0].timeline.lane
    const isWin = match.participants[0].stats.win
    positon == 'NONE' ? () => { } : positions.push({ positon, isWin })
  })
  currentSummoner.showData.kda = ((totalKill + totalAssist) / totalDeath * 3).toFixed(2)
  currentSummoner.showData.damage = (totalDamage / 20).toFixed(0)
  currentSummoner.showData.money = (totalMoney / 20).toFixed(0)

  let rencentlyPositionTemp: any = {}
  let rencentlyPosition: any = {}
  _.forEach(positions, (data: any) => {
    if (!rencentlyPositionTemp[data.positon]) {
      rencentlyPositionTemp[data.positon] = []
    }
    rencentlyPositionTemp[data.positon].push(data.isWin)
  })


  _.forIn(rencentlyPositionTemp, (val: any, key: string) => {
    if (val.length > 2) {
      let wins = 0
      let total = val.length
      _.forEach(val, (isWin: boolean) => {
        if (isWin) wins += 1
      });
      rencentlyPosition[key] = { wins, total }
    }
  })

  currentSummoner.rencentlyPosition = rencentlyPosition

  const championMastery = await api.getChampionMastery(summoner.summonerId, 4)
  currentSummoner.championMastery = championMastery

  return currentSummoner
}

export const historyMatchesList = async (summonerName: string, page: number, limit: number = 7) => {

  const summoner = await api.getSummonerInfoBySummonerName(summonerName)
  const begin = (page - 1) * limit
  const end = begin + limit
  const matchList = await api.getHistoryMatchesByPuuid(summoner.puuid, begin, end)

  const data = {
    items: matchList.games.games.reverse(),
    total: matchList.games.games.length
  }
  return data
}

export const matchesDetail = async (gameId: string) => {
  const data = await api.getHistoryDetailByGameId(gameId)
  let killsOfTeam1 = 0;
  let killsOfTeam2 = 0;
  let goldOfTeam1 = 0;
  let goldOfTeam2 = 0;
  let players = [];
  for (let i = 0; i < data.participantIdentities.length; i++) {
    let player: any = {};
    player.championId = data.participants[i].championId;
    player.summonerName = data.participantIdentities[i].player.summonerName;
    player.summonerId = data.participantIdentities[i].player.summonerId;
    player.assists = data.participants[i].stats.assists;
    player.deaths = data.participants[i].stats.deaths;
    player.kills = data.participants[i].stats.kills;
    player.totalDamageDealtToChampions = data.participants[i].stats.totalDamageDealtToChampions;
    player.goldEarned = data.participants[i].stats.goldEarned;
    player.items = [
      data.participants[i].stats.item0,
      data.participants[i].stats.item1,
      data.participants[i].stats.item2,
      data.participants[i].stats.item3,
      data.participants[i].stats.item4,
      data.participants[i].stats.item5,
      data.participants[i].stats.item6,
    ];
    players.push(player);

    if (i <= 4) {
      killsOfTeam1 += player.kills;
    } else {
      killsOfTeam2 += player.kills;
    }

    if (i <= 4) {
      goldOfTeam1 += player.goldEarned;
    } else {
      goldOfTeam2 += player.goldEarned;
    }
  }

  let res = {
    gameCreationDate: data.gameCreationDate,
    gameId: data.gameId,
    gameDuration: data.gameDuration,
    gameMode: data.gameMode,
    queueId: data.queueId,
    killsOfTeam1,
    killsOfTeam2,
    goldOfTeam1,
    goldOfTeam2,
    players,
  };

  return res;
}

export const confirmChampionById = async (championId: string, confirm: boolean) => {
  const player = await api.getCurrentSummoner();
  const session = await api.getSessionInfo();
  const actions = session.actions[0];
  const team = session.myTeam;
  let cellId;
  for (let i = 0; i < team.length; i++) {
    const order = team[i];
    if (order.summonerId == player.summonerId) {
      cellId = order.cellId;
      break;
    }
  }
  let id;
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (action.actorCellId == cellId) {
      id = action.id;
    }
  }
  return await api.selectChampionById(championId, id, confirm);
}

export const getPanelData = async (status: string) => {

  let data = panelData.get('panelData')

  try {
    if (status == 'ChampSelect' && data.orderList.length < 5) {
      data = await getPanelDataInChampSelect() as any
      panelData.set('panelData', data)
      await api.sendMsgInChampSelect('me', `队友信息获取成功`)
    }
    if (status == 'InProgress' && data.chaosList.length == 0) {
      data = await getPanelDataInProgress();
      panelData.set('panelData', data)
    }
  } catch (err) { }

  return panelData.get('panelData')
}


const getPanelDataInChampSelect = async () => {
  const sessionRes = await api.getSessionInfo();

  if (!sessionRes.myTeam) return null;

  let playerList = [];
  for (let i = 0; i < sessionRes.myTeam.length; i++) {

    let temp: any = {};
    temp.team = 'order';
    // 是否为机器人
    if (sessionRes.myTeam[i].summonerId != 0) {
      temp.summonerId = sessionRes.myTeam[i].summonerId;
      temp.position = sessionRes.myTeam[i].assignedPosition;
      const summonerInfo = await api.getSummonerInfoBySummonerId(sessionRes.myTeam[i].summonerId);
      temp.summonerName = summonerInfo.displayName;
      temp.profileIcon = getProfileIcon(summonerInfo.profileIconId);


      const historyMatches = await api.getHistoryMatchesByPuuid(summonerInfo.puuid);
      const matchesData = await sourcingRules(historyMatches);
      temp.matches = matchesData;

      const rank = await api.getRankedStatusInfoByPuuid(summonerInfo.puuid);
      temp.rank = {
        rankedSolo: `${translate('rank', rank.queueMap.RANKED_SOLO_5x5.tier)} ${rank.queueMap.RANKED_SOLO_5x5.division}`,
        rankedFlex: `${translate('rank', rank.queueMap.RANKED_FLEX_SR.tier)} ${rank.queueMap.RANKED_FLEX_SR.division}`,
      };
    } else {
      temp.summonerId = sessionRes.myTeam[i].summonerId;
      temp.position = sessionRes.myTeam[i].assignedPosition;
      temp.summonerName = 'BOT';
      temp.profileIcon = 'https://ddragon.leagueoflegends.com/cdn/12.5.1/img/profileicon/29.png';
      temp.matches = {
        source: '',
        kda: '',
        winRate: '',
        data: '',
      };
      temp.rank = {
        rankedSolo: '',
        rankedFlex: '',
      };
    }

    playerList.push(temp);
  }


  const res = sortAndSetDesignation(playerList);


  // 获取黑名单列表
  const blackList: any = blacklist.get('blacklist')

  // 黑名单信息是否发送所有人
  const blackNoticeToAll = appConfig.get('blacklistNoticeAll');

  // 判断玩家中是否有黑名单成员
  for (let i = 0; i < blackList.length; i++) {
    const ban = blackList[i];
    for (let j = 0; j < res.length; j++) {
      const player = res[j];
      if (player.summonerName == ban.banName) {
        await api.sendMsgInChampSelect(blackNoticeToAll ? 'all' : 'self', `[Tik对局助手]：玩家 ${ban.banName} 在你的黑名单中, 原因：${ban.reason}`);
        break;
      }
    }
  }

  const panelData = {
    orderList: res,
    chaosList: [],
  };

  return panelData;
}

const getPanelDataInProgress = async () => {
  let playerList;
  let panelData: any = {
    orderList: [],
    chaosList: [],
  };
  while (true) {
    try {
      /**
       * getPlayerListInGame这个接口在刚进入游戏时可能获取不到数据，直接走个死循环，有时候获取到了还是空数组
       */
      playerList = await api.getPlayerListInGame();
      if (playerList.length > 0) break;
    } catch (err) { }
  }
  for (let i = 0; i < playerList.length; i++) {
    if (!playerList[i].isBot) {
      let res: any = {};
      res.position = playerList[i].position;
      res.summonerName = playerList[i].summonerName;
      res.profileIcon = getChampionAvatarByCnName(playerList[i].championName);
      const summoner = await api.getSummonerInfoBySummonerName(playerList[i].summonerName);
      res.summonerId = summoner.summonerId;
      const puuid = summoner.puuid;
      const historyMatches = await api.getHistoryMatchesByPuuid(puuid);
      const matchesData = await sourcingRules(historyMatches);
      res.matches = matchesData;
      const rank = await api.getRankedStatusInfoByPuuid(puuid);
      res.rank = {
        rankedSolo: `${translate('rank', rank.queueMap.RANKED_SOLO_5x5.tier)} ${rank.queueMap.RANKED_SOLO_5x5.division}`,
        rankedFlex: `${translate('rank', rank.queueMap.RANKED_FLEX_SR.tier)} ${rank.queueMap.RANKED_FLEX_SR.division}`,
      };
      if (playerList[i].team == 'ORDER') {
        panelData.orderList.push(res);
      } else {
        panelData.chaosList.push(res);
      }
    } else {
      let res: any = {};
      res.position = playerList[i].position;
      res.summonerName = playerList[i].summonerName;
      res.profileIcon = getChampionAvatarByCnName(playerList[i].championName);
      res.matches = {
        source: '',
        kda: '',
        winRate: '',
        data: '',
      };
      res.rank = {
        rankedSolo: '',
        rankedFlex: '',
      };
      if (playerList[i].team == 'ORDER') {
        panelData.orderList.push(res);
      } else {
        panelData.chaosList.push(res);
      }
    }
  }
  panelData.orderList = sortAndSetDesignation(panelData.orderList);
  panelData.chaosList = sortAndSetDesignation(panelData.chaosList);
  return panelData;
}

const sourcingRules = async (historyMatches: any) => {
  historyMatches = historyMatches.games.games;

  // 去除非排位赛对局数据
  if (appConfig.get('onlyRankData')) {
    historyMatches = historyMatches.filter((item: any) => {
      return item.gameMode == 'CLASSIC';
    });
  }

  // 计算用变量([击杀，死亡，助攻，胜场，多杀]分数)
  let k = 0;
  let d = 0;
  let a = 0;
  let w = 0;
  let killingSpreesSource = 0;

  // 最近常用英雄记录
  let recentChampions: any[] = [];

  let data: any[] = [];

  historyMatches.forEach(async (match: any) => {
    let temp: any = {};
    temp.gameMode = match.gameMode;
    temp.gameType = match.gameType;
    temp.gameCreationDate = match.gameCreationDate;
    temp.championId = match.participants[0].championId;
    temp.spell1 = match.participants[0].spell1Id;
    temp.spell2 = match.participants[0].spell2Id;
    temp.championId = match.participants[0].championId;
    temp.queueId = match.queueId
    temp.champLevel = match.participants[0].stats.champLevel;
    temp.kills = match.participants[0].stats.kills;
    temp.deaths = match.participants[0].stats.deaths;
    temp.assists = match.participants[0].stats.assists;
    temp.win = match.participants[0].stats.win;
    temp.killingSprees = match.participants[0].stats.killingSprees;

    data.push(temp);

    // 获取玩家最近英雄情况
    recentChampions.push(temp.championId);

    k += temp.kills;
    d += temp.deaths;
    a += temp.assists;

    if (temp.win) {
      w += 1;
    }

    if (temp.killingSprees == 3) {
      killingSpreesSource += 2;
    } else if (temp.killingSprees == 4) {
      killingSpreesSource += 4;
    } else if (temp.killingSprees == 5) {
      killingSpreesSource += 8;
    }
  });

  // 计算分数
  let KDA = d == 0 ? k + a : (k + a) / d;
  let WIN_RATE = w / historyMatches.length;
  let SOURCE = (KDA * 10 * 0.4 + WIN_RATE * 100 * 0.4 + killingSpreesSource * 0.2) * 10;

  // 获取最近常用英雄
  let recentChampionsCount = [];
  recentChampions.sort();
  for (let i = 0; i < recentChampions.length;) {
    let count = 0;
    for (let j = 0; j < recentChampions.length; j++) {
      if (recentChampions[i] == recentChampions[j]) {
        count++;
      }
    }
    recentChampionsCount.push({
      championId: recentChampions[i],
      count,
    });
    i += count;
  }
  // 排序
  recentChampionsCount.sort((a, b) => {
    return a.count > b.count ? -1 : 1;
  });
  // 切割
  recentChampionsCount = recentChampionsCount.slice(0, 3);

  const res = {
    recentChampionsCount,
    source: SOURCE.toFixed(2),
    kda: KDA.toFixed(2),
    winRate: `${(WIN_RATE * 100).toFixed(2)}%`,
    // 战绩显示最近的十把，倒序排列
    data: data.slice(-10).reverse(),
  };
  return res;
}

const sortAndSetDesignation = (list: any[]) => {
  list.sort((a, b) => {
    if (a.matches.source > b.matches.source) {
      return -1;
    } else if (a.matches.source < b.matches.source) {
      return 1;
    } else {
      return 0;
    }
  });
  const summonerTitle: string[] = appConfig.get('typeTitle')
  // 设置排名
  for (let i = 0; i < list.length; i++) {
    const str = `no${i + 1}`;
    list[i].type = summonerTitle[i];
  }
  return list;
}


export const changeTier = async (tiger: string) => {
  try {
    let r = await api.getPlayerChatInfo();
    r.lol.rankedLeagueDivision = 'I';
    r.lol.rankedLeagueQueue = 'RANKED_SOLO_5x5';
    r.lol.rankedLeagueTier = tiger;
    r.lol.rankedPrevSeasonDivision = 'I';
    return await api.putPlayerChatInfo(r);
  } catch (err) {
    return null;
  }
}

export const changeStatus = async (status: string) => {
  try {
    let r = await api.getPlayerChatInfo();
    r.availability = status;
    return await api.putPlayerChatInfo(r);
  } catch (err) {
    return null;
  }
}

export const useRunePage = async (data: any) => {
  try {
    // 获取所有符文
    let RunesPage = await api.getAllRunePage();
    // 删除最近的一个符文
    let del = await api.delRunePage(RunesPage[0].id);
    // 应用符文
    let r = await api.postRunePage(data);
    // 发送信息
    await api.sendMsgInChampSelect('all', `${data.name} OPGG符文应用成功！`);
    const parm = {
      code: 200,
      msg: r,
    };
    return parm;
  } catch (err: any) {
    const parm = {
      code: 500,
      msg: err.message,
    };
    return parm;
  }
}