import _ from 'loadsh'

export async function confirmChampionById(championId: number, confirm: boolean) {
  const player: any = await $api.getCurrentSummoner()
  const session: any = await $api.getSessionInfo()
  const actions = session.actions[0]
  const team = session.myTeam
  let cellId, id
  for (let i = 0; i < team.length; i++) {
    const order = team[i]
    if (order.summonerId == player.summonerId) {
      cellId = order.cellId
      break
    }
  }
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    if (action.actorCellId == cellId) {
      id = action.id
    }
  }
  return await $api.selectChampionById(championId, id, confirm)
}

export async function summonerHomePageData(summonerName?: string, matchCount:number = 20) {
  let currentSummoner= {
    gameStatus: '',
    avatar: '',
    summonerLevel: '',
    profileIconId: '',
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
    hisotryMatch: [],
    rencentlyPosition: {},
    championMastery: {
      source: null,
      masteries: [],
    },
    showData: {
      kda: '',
      damage: '',
      money: '',
    },
  }
  let summoner: any
  if (summonerName) {
    summoner = await $api.getSummonerInfoBySummonerName(summonerName)
  } else {
    summoner = await $api.getCurrentSummoner()
    const environment = await $api.getEnvironment()
    currentSummoner.environment = $utils.translate('environment', environment.environment)
    const gameStatus = await $api.getGameStatus()
    currentSummoner.gameStatus = $utils.translate('status', gameStatus)
  }

  currentSummoner.displayName = summoner.displayName
  currentSummoner.summonerId = summoner.summonerId
  currentSummoner.puuid = summoner.puuid
  currentSummoner.summonerLevel = summoner.summonerLevel
  currentSummoner.profileIconId = summoner.profileIconId
  currentSummoner.avatar = $utils.getProfileIcon(summoner.profileIconId)
  /*TODO: */
  // userStore.gameAvatar = summoner.profileIconId

  const rankStatus: any = await $api.getRankedStatusInfoByPuuid(summoner.puuid)
  currentSummoner.rank.rankedHighestTier = rankStatus.highestPreviousSeasonEndTier
  currentSummoner.rank.rankedHighest = `${$utils.translate('rank', rankStatus.highestPreviousSeasonEndTier)} ${rankStatus.highestPreviousSeasonEndDivision
  }`
  currentSummoner.rank.rankedSoloTier = rankStatus.queueMap.RANKED_SOLO_5x5.tier
  currentSummoner.rank.rankedSolo = `${$utils.translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division
  } ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`
  currentSummoner.rank.rankedFlexTier = rankStatus.queueMap.RANKED_FLEX_SR.tier
  currentSummoner.rank.rankedFlex = `${$utils.translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division
  } ${rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints}`

  const hisotryMatch: any = await $api.getHistoryMatchesByPuuid(summoner.puuid, 0, matchCount)
  currentSummoner.hisotryMatch = hisotryMatch.games.games.reverse()

  let totalKill = 0
  let totalDeath = 0
  let totalAssist = 0
  let totalMoney = 0
  let totalDamage = 0
  let positions: any[] = []

  _.forEach(hisotryMatch.games.games, match => {
    totalKill += match.participants[0].stats.kills
    totalDeath += match.participants[0].stats.deaths
    totalAssist += match.participants[0].stats.assists
    totalMoney += match.participants[0].stats.goldEarned
    totalDamage += match.participants[0].stats.physicalDamageDealtToChampions
    const position = match.participants[0].timeline.lane
    const isWin = match.participants[0].stats.win
    if(position != 'NONE' ) positions.push({ position, isWin })
  })


  currentSummoner.showData.kda = ((totalKill + totalAssist) / totalDeath * 3).toFixed(2)
  currentSummoner.showData.damage = (totalDamage / matchCount).toFixed(0)
  currentSummoner.showData.money = (totalMoney / matchCount).toFixed(0)

  let recentlyPositionTemp: any = {}
  let recentlyPosition: any = {}
  _.forEach(positions, data => {
    if (!recentlyPositionTemp[data.position]) {
      recentlyPositionTemp[data.position] = []
    }
    recentlyPositionTemp[data.position].push(data.isWin)
  })
  _.forIn(recentlyPositionTemp, (val, key) => {
    if (val.length > 2) {
      let wins = 0
      let total = val.length
      _.forEach(val, isWin => {
        if (isWin) wins += 1
      })
      recentlyPosition[key] = { wins, total }
    }
  })

  currentSummoner.rencentlyPosition = recentlyPosition
  // @ts-ignore
  currentSummoner.championMastery = await $api.getChampionMastery(summoner.summonerId, 4)
  return currentSummoner
}

export async function getHistoryDetailByGameId(gameId: string){
  const data: any = await $api.getHistoryDetailByGameId(gameId)
  let killsOfTeam1 = 0
  let killsOfTeam2 = 0
  let goldOfTeam1 = 0
  let goldOfTeam2 = 0
  let players = []
  for (let i = 0; i < data.participantIdentities.length; i++) {
    let player: any = {}
    player.championId = data.participants[i].championId
    player.summonerName = data.participantIdentities[i].player.summonerName
    player.summonerId = data.participantIdentities[i].player.summonerId
    const summonerInfo = await $api.getSummonerInfoBySummonerId(player.summonerId)
    player.puuid = summonerInfo.puuid
    const rankStatus: any = await $api.getRankedStatusInfoByPuuid(player.puuid)
    player.rank = {
      rankedSoloTier: rankStatus.queueMap.RANKED_SOLO_5x5.tier,
      rankedSolo: `${$utils.translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division
      } ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`,
      rankedFlexTier: rankStatus.queueMap.RANKED_FLEX_SR.tier,
      rankedFlex: `${$utils.translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division
      } ${rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints}`
    }
    player.assists = data.participants[i].stats.assists
    player.deaths = data.participants[i].stats.deaths
    player.kills = data.participants[i].stats.kills
    player.totalDamageDealtToChampions = data.participants[i].stats.totalDamageDealtToChampions
    player.goldEarned = data.participants[i].stats.goldEarned
    player.items = [
      data.participants[i].stats.item0,
      data.participants[i].stats.item1,
      data.participants[i].stats.item2,
      data.participants[i].stats.item3,
      data.participants[i].stats.item4,
      data.participants[i].stats.item5,
      data.participants[i].stats.item6,
    ]
    players.push(player)
    if (i <= 4) {
      killsOfTeam1 += player.kills
    } else {
      killsOfTeam2 += player.kills
    }
    if (i <= 4) {
      goldOfTeam1 += player.goldEarned
    } else {
      goldOfTeam2 += player.goldEarned
    }
  }
  return {
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
  }
}