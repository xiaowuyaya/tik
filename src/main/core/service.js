import _ from 'lodash'
import { sendMsgInLeagueGame } from '../tools/dll'
import {getHistoryMatches, getHistoryMatchListByAccountId} from "./api";

export async function summonerHomePageData(summonerName, matchCount = 20) {
  let currentSummoner = {}
  let summonerInfo = {}

  if (summonerName) {
    summonerInfo = await $api.getSummonerInfoBySummonerName(summonerName)
    currentSummoner.gameStatus = null
  } else {
    summonerInfo = await $api.getCurrentSummoner()
    currentSummoner.gameStatus = $utils.translate('status', await $api.getGameStatus())
  }
  currentSummoner.environment = $utils.translate('environment', (await $api.getEnvironment()).environment)
  currentSummoner.summonerId = summonerInfo.summonerId
  currentSummoner.displayName = summonerInfo.displayName
  currentSummoner.summonerId = summonerInfo.summonerId
  currentSummoner.puuid = summonerInfo.puuid
  currentSummoner.profileIconId = summonerInfo.profileIconId
  currentSummoner.profileIcon = $utils.getProfileIcon(summonerInfo.profileIconId)
  currentSummoner.summonerLevel = summonerInfo.summonerLevel
  currentSummoner.xpSinceLastLevel = summonerInfo.xpSinceLastLevel
  currentSummoner.xpUntilNextLevel = summonerInfo.xpUntilNextLevel
  currentSummoner.progress = Math.round((summonerInfo.xpSinceLastLevel / summonerInfo.xpUntilNextLevel) * 100)

  const rankStatus = await $api.getRankedStatusInfoByPuuid(summonerInfo.puuid)
  currentSummoner.rank = {}
  currentSummoner.rank.rankedHighestTier = rankStatus.highestPreviousSeasonEndTier
  currentSummoner.rank.rankedHighest = `${$utils.translate('rank', rankStatus.highestPreviousSeasonEndTier)} ${rankStatus.highestPreviousSeasonEndDivision}`
  currentSummoner.rank.rankedSoloTier = rankStatus.queueMap.RANKED_SOLO_5x5.tier
  currentSummoner.rank.rankedSolo = `${$utils.translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division == 'NA' ? '' : rankStatus.queueMap.RANKED_SOLO_5x5.division} ${
    rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints
  }`
  currentSummoner.rank.rankedFlexTier = rankStatus.queueMap.RANKED_FLEX_SR.tier
  currentSummoner.rank.rankedFlex = `${$utils.translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division == 'NA' ? '' : rankStatus.queueMap.RANKED_FLEX_SR.division} ${
    rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints
  }`

  const credentials = $cache.get('credentials')
  const isTencent = credentials.region == 'TENCENT'

  // const hisotryMatch = await $api.getHistoryMatchesByPuuidV2(summonerInfo.puuid, 0, matchCount)
  const hisotryMatch = await $api.getHistoryMatches(summonerInfo.summonerId,summonerInfo.puuid, 0, matchCount)
  currentSummoner.hisotryMatch = isTencent ? hisotryMatch.games.games.reverse() || [] : hisotryMatch.games.games || []

  let totalKill = 0
  let totalDeath = 0
  let totalAssist = 0
  let totalMoney = 0
  let totalDamage = 0
  let positions = []

  for (let i = 0; i < hisotryMatch.games.games.length; i++) {
    const match = hisotryMatch.games.games[i]
    totalKill += match.participants[0].stats.kills
    totalDeath += match.participants[0].stats.deaths
    totalAssist += match.participants[0].stats.assists
    totalMoney += match.participants[0].stats.goldEarned
    totalDamage += match.participants[0].stats.physicalDamageDealtToChampions
    const position = match.participants[0].timeline.lane
    const isWin = match.participants[0].stats.win
    if (position != 'NONE') positions.push({ position, isWin })
  }

  let showData = {}

  showData.kda = (((totalKill + totalAssist) / totalDeath) * 3).toFixed(2)
  showData.damage = (totalDamage / matchCount).toFixed(0)
  showData.money = (totalMoney / matchCount).toFixed(0)

  currentSummoner.showData = showData

  let recentlyPositionTemp = {}
  let recentlyPosition = []

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
      recentlyPosition.push({ wins, total, position: key })
    }
  })

  currentSummoner.rencentlyPosition = recentlyPosition

  currentSummoner.championMastery = await $api.getChampionMastery(summonerInfo.summonerId, 5)
  return currentSummoner
}

export async function historyDetailInfo(gameId) {
  const data = await $api.getHistoryDetailByGameId(gameId)

  let team100 = {
    kills: 0,
    assists: 0,
    deaths: 0,
    gold: 0,
    players: [],
    team: {},
  }
  let team200 = {
    kills: 0,
    assists: 0,
    deaths: 0,
    gold: 0,
    players: [],
    team: {},
  }
  for (let i = 0; i < data.participantIdentities.length; i++) {
    let player = {}
    player.championId = data.participants[i].championId
    player.summonerName = data.participantIdentities[i].player.summonerName
    player.summonerId = data.participantIdentities[i].player.summonerId
    const summonerInfo = await $api.getSummonerInfoBySummonerId(player.summonerId)
    player.puuid = summonerInfo.puuid
    const rankStatus = await $api.getRankedStatusInfoByPuuid(player.puuid)
    player.rank = {
      rankedSoloTier: rankStatus.queueMap.RANKED_SOLO_5x5.tier,
      rankedSolo: `${$utils.translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division} ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`,
      rankedFlexTier: rankStatus.queueMap.RANKED_FLEX_SR.tier,
      rankedFlex: `${$utils.translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division} ${rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints}`,
    }
    player.assists = data.participants[i].stats.assists
    player.deaths = data.participants[i].stats.deaths
    player.kills = data.participants[i].stats.kills
    player.totalDamageDealtToChampions = data.participants[i].stats.totalDamageDealtToChampions
    player.goldEarned = data.participants[i].stats.goldEarned
    player.champLevel = data.participants[i].stats.champLevel
    player.perkPrimaryStyle = data.participants[i].stats.perkPrimaryStyle
    player.perkSubStyle = data.participants[i].stats.perkSubStyle
    player.totalMinionsKilled = data.participants[i].stats.totalMinionsKilled
    player.spells = [data.participants[i].spell1Id, data.participants[i].spell2Id]
    player.stats = data.participants[i].stats
    player.perk = [
      data.participants[i].stats.perk0,
      data.participants[i].stats.perk1,
      data.participants[i].stats.perk2,
      data.participants[i].stats.perk3,
      data.participants[i].stats.perk4,
      data.participants[i].stats.perk5,
    ]
    player.items = [
      data.participants[i].stats.item0,
      data.participants[i].stats.item1,
      data.participants[i].stats.item2,
      data.participants[i].stats.item3,
      data.participants[i].stats.item4,
      data.participants[i].stats.item5,
      data.participants[i].stats.item6,
    ]

    const currTeam = data.participants[i].teamId
    if (currTeam === 100) {
      team100.players.push(player)
      team100.gold += player.goldEarned
      team100.kills += player.kills
      team100.deaths += player.deaths
      team100.assists += player.assists
    } else {
      team200.players.push(player)
      team200.gold += player.goldEarned
      team200.kills += player.kills
      team200.deaths += player.deaths
      team200.assists += player.assists
    }
  }
  for (let j = 0; j < data.teams.length; j++) {
    const teamInfo = data.teams[j]
    if (teamInfo.teamId === 100) {
      team100.team = teamInfo
    } else {
      team200.team = teamInfo
    }
  }
  return {
    gameCreationDate: data.gameCreationDate,
    gameId: data.gameId,
    gameDuration: data.gameDuration,
    gameMode: data.gameMode,
    queueId: data.queueId,
    team: [team100, team200],
  }
}

export async function confirmChampionById(championId, confirm) {
  const player = await $api.getCurrentSummoner()
  const session = await $api.getSessionInfo()
  const actions = session.actions[0]
  const team = session.myTeam
  let cellId, id
  for (let i = 0; i < team.length; i++) {
    const order = team[i]
    if (order.summonerId === player.summonerId) {
      cellId = order.cellId
      break
    }
  }
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    if (action.actorCellId === cellId) {
      id = action.id
    }
  }
  return await $api.selectChampionById(championId, id, confirm)
}

export async function autoAcceptMatchReadyCheck() {
  if ($store.appConfigStore.get('autoAccept.enable')) {
    const delayTIme = $store.appConfigStore.get('autoAccept.delay') || 0
    setTimeout(async () => {
      try {
        const res = await $api.acceptMatchmaking()
        if (!res) {
          $log.error(`$api.acceptMatchmaking() failed: ${res}`)
          throw '$api.acceptMatchmaking() failed'
        }
      } catch (err) {
        await $api.acceptMatchmaking2()
      }
    }, delayTIme * 1000)
  }
}

export async function selectChampNormal() {
  if ($store.appConfigStore.get('autoBanPick.pick.enable')) {
    const normalPickList = $store.appConfigStore.get('autoBanPick.pick.normal')
    for (let i = 0; i < normalPickList.length; i++) {
      const res = await confirmChampionById(normalPickList[i], $store.appConfigStore.get('autoBanPick.confirmSelect') || false)
      if (res.errorCode !== 'RPC_ERROR') {
        await $api.sendMsgInChampSelect('SELF', `TikLeagueTool 自动选择英雄(普通模式): ${normalPickList[i]}`)
        return
      }
    }
  }
}

export async function selectChampByMode(actions, cellId, position) {
  if ($store.appConfigStore.get('autoBanPick.ban.enable')) {
    let banActionId
    for (let i = 0; i < actions[0].length; i++) {
      const action = actions[0][i]
      if (action.actorCellId === cellId) {
        banActionId = action.id
        if (!action.completed) {
          const positionSelect = $store.appConfigStore.get(`autoBanPick.ban.${position}`)
          for (let i = 0; i < positionSelect.length; i++) {
            const select = positionSelect[i]
            const res = await $api.selectChampionById(select, banActionId, $store.appConfigStore.get('autoBanPick.confirmSelect') || false)
            if (res.errorCode != 'RPC_ERROR') {
              await $api.sendMsgInChampSelect('SELF', `TikLeagueTool 自动禁用英雄(${position}): ${select}`)
              return
            }
          }
          return
        }
      }
    }
  }
  if ($store.appConfigStore.get('autoBanPick.pick.enable')) {
    let pickActionId
    for (let i = 2; i < actions.length; i++) {
      // 从第三个开始是pick阶段
      const actionItem = actions[i]
      for (let j = 0; j < actionItem.length; j++) {
        const action = actionItem[j]
        if (action.actorCellId === cellId) {
          pickActionId = action.id
          if (!action.completed) {
            const positionSelect = $store.appConfigStore.get(`autoBanPick.pick.${position}`)
            for (let i = 0; i < positionSelect.length; i++) {
              const select = positionSelect[i]
              const res = await $api.selectChampionById(select, pickActionId, $store.appConfigStore.get('autoBanPick.confirmSelect') || false)
              if (res.errorCode != 'RPC_ERROR') {
                await $api.sendMsgInChampSelect('SELF', `TikLeagueTool 自动选择英雄(${position}): ${select}`)
                return
              }
            }
            return
          }
        }
      }
    }
  }
}

/**
 * 黑名单提醒
 */
async function blacklistNotice(summonerName, mode) {
  const blackList = $store.blacklistStore.get('list') || []
  const blackNoticeToAll = $store.appConfigStore.get('blacklistNotice')
  for (let i = 0; i < blackList.length; i++) {
    if (blackList[i].banName === summonerName) {
      if (mode === 'champSelect') await $api.sendMsgInChampSelect(blackNoticeToAll ? 'ALL' : 'SELF', `TikLeagueTool 玩家[${summonerName}] 在黑名单中, 原因：${blackList[i].reason}`)
      if (mode == 'inGame') {
        new Promise(() => {
          setTimeout(reject => {
            sendMsgInLeagueGame(`TikLeagueTool 玩家[${summonerName}] 在黑名单中, 原因：${blackList[i].reason}`)
            reject()
          }, 2 * 60 * 1000)
        })
      }
      break
    }
  }
}

/**
 * 战绩处理相关
 * @param historyMatches getHistoryMatchesByPuuidV2返回值
 * @return
 */
export function historyMatchesHandle(historyMatches) {
  try {
    historyMatches = historyMatches.games.games || []
    // 仅显示排位数据
    if ($store.appConfigStore.get('onlyRankData')) {
      historyMatches = historyMatches.filter(item => {
        return item.queueId == 440 || item.queueId == 420
      })
    }
    // 计算用变量([击杀，死亡，助攻，胜场，多杀]分数)
    let k = 0
    let d = 0
    let a = 0
    let w = 0
    let killingSpreesSource = 0
    // 最近常用英雄记录
    let recentChampions = []
    // 近期对局id
    let gameIds = []
    let positions = []
    let data = []
    historyMatches.forEach(async match => {
      let temp = {}
      gameIds.push(match.gameId + match.participants[0].teamId)
      temp.gameMode = match.gameMode
      temp.gameType = match.gameType
      temp.gameCreationDate = match.gameCreationDate
      temp.championId = match.participants[0].championId
      temp.spell1 = match.participants[0].spell1Id
      temp.spell2 = match.participants[0].spell2Id
      temp.championId = match.participants[0].championId
      temp.queueId = match.queueId
      temp.champLevel = match.participants[0].stats.champLevel
      temp.kills = match.participants[0].stats.kills
      temp.deaths = match.participants[0].stats.deaths
      temp.assists = match.participants[0].stats.assists
      temp.win = match.participants[0].stats.win
      temp.killingSprees = match.participants[0].stats.killingSprees
      temp.position = match.participants[0].timeline.lane
      if (temp.position != 'NONE') positions.push({ position: temp.position, isWin: temp.win })

      data.push(temp)
      // 获取玩家最近英雄情况
      recentChampions.push(temp.championId)

      k += temp.kills
      d += temp.deaths
      a += temp.assists
      if (temp.win) w += 1
      if (temp.killingSprees == 3) {
        killingSpreesSource += 2
      } else if (temp.killingSprees == 4) {
        killingSpreesSource += 4
      } else if (temp.killingSprees == 5) {
        killingSpreesSource += 8
      }
    })

    // 计算分数
    let KDA = d == 0 ? k + a : (k + a) / d
    let WIN_RATE = w / historyMatches.length
    let SOURCE = (KDA * 10 * 0.4 + WIN_RATE * 100 * 0.4 + killingSpreesSource * 0.2) * 10

    // 获取最近常用英雄
    let recentChampionsCount = []
    recentChampions.sort()
    for (let i = 0; i < recentChampions.length; ) {
      let count = 0
      for (let j = 0; j < recentChampions.length; j++) {
        if (recentChampions[i] == recentChampions[j]) {
          count++
        }
      }
      recentChampionsCount.push({
        championId: recentChampions[i],
        count,
      })
      i += count
    }

    // 近期位置
    let recentlyPositionTemp = {}
    let recentlyPosition = []

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
        recentlyPosition.push({ wins, total, position: key })
      }
    })

    // 排序
    recentChampionsCount.sort((a, b) => {
      return a.count > b.count ? -1 : 1
    })
    // 切割
    recentChampionsCount = recentChampionsCount.slice(0, 3)

    return {
      gameIds,
      recentChampionsCount,
      recentlyPosition,
      source: SOURCE.toFixed(2),
      kda: KDA.toFixed(2),
      winRate: `${(WIN_RATE * 100).toFixed(2)}%`,
      // 战绩显示最近的十把，倒序排列
      data: data.slice(-10).reverse(),
    }
  } catch (err) {
    $log.error(`[historyMatchesHandle] ${err}`)
    return {
      gameIds: [],
      recentChampionsCount: [],
      source: 0,
      kda: 0,
      winRate: `00.0%`,
      data: [],
    }
  }
}

/**
 * 排序并定义称号（获取面板数据使用）
 * @param list
 * [{summonerId, position, summonerName, profileIcon,matches，rank }]
 */
function sortAndSetDesignation(list) {
  list.sort((a, b) => {
    if (a.matches.source > b.matches.source) {
      return -1
    } else if (a.matches.source < b.matches.source) {
      return 1
    } else {
      return 0
    }
  })
  const summonerTitle = $store.appConfigStore.get('sendPlayerLevelInfo.title')
  // 设置排名
  for (let i = 0; i < list.length; i++) {
    list[i].type = summonerTitle[i]
  }
  return list
}

/**
 * 组排提醒
 * together: {arr1: [], arr2: []}
 */
async function togetherNotice(together, mode) {
  let groupPlayer_1 = ''
  let groupPlayer_2 = ''
  const sendTogetherGame = $store.appConfigStore.get('sendCoPlayer')
  if (mode == 'champSelect') {
    if (together.arr1.length > 1) {
      _.forEach(together.arr1, summonerName => {
        groupPlayer_1 += `${summonerName}, `
      })
    }
    if (together.arr2.length > 1) {
      _.forEach(together.arr2, summonerName => {
        groupPlayer_2 += `${summonerName}, `
      })
    }
    if (groupPlayer_1 || groupPlayer_2) {
      await $api.sendMsgInChampSelect(sendTogetherGame ? 'ALL' : 'SELF', `TikLeagueTool 我方组队：我方组队：${groupPlayer_1 ? `(${groupPlayer_1})` : ''} ${groupPlayer_2 ? `(${groupPlayer_2})` : ''}`)
    }
  }
}

export async function getPanelDataInChampSelect() {
  setTimeout(() => {
    $log.info('正在获取选人中面板信息')
  }, 1200) // 延迟获取 不然总是少人
  try {
    let playerList = []
    let idList = []
    for (let i = 0; i < 50; i++) {
      idList = await $api.getChatRoomPlayerIdList()
      if (idList.length == 5) break
    }
    idList = [...new Set(idList)] // 去重
    console.log(idList)

    for (let i = 0; i < idList.length; i++) {
      const summonerId = idList[i]
      let temp = {}
      temp.team = 'order'

      let summonerInfo = {}
      const isBot = summonerId === 0
      if (!isBot) summonerInfo = await $api.getSummonerInfoBySummonerId(summonerId)

      temp.summonerId = summonerId
      temp.position = 'UNKNOWN'
      temp.summonerName = isBot ? '电脑人(BOT)' : summonerInfo.displayName
      temp.profileIcon = isBot ? 'https://ddragon.leagueoflegends.com/cdn/12.5.1/img/profileicon/29.png' : $utils.getProfileIcon(summonerInfo.profileIconId)
      temp.matches = { source: '', kda: '', winRate: '', data: '' }
      temp.rank = { rankedSolo: '', rankedFlex: '' }
      if (!isBot) {
        // const historyMatches = await $api.getHistoryMatchesByPuuidV2(summonerInfo.puuid)
        const historyMatches = await $api.getHistoryMatches(summonerId ,summonerInfo.puuid)
        temp.matches = await historyMatchesHandle(historyMatches)

        const rank = await $api.getRankedStatusInfoByPuuid(summonerInfo.puuid)
        temp.rank = {
          rankedSolo: `${$utils.translate('rank', rank.queueMap.RANKED_SOLO_5x5.tier)} ${rank.queueMap.RANKED_SOLO_5x5.division}`,
          rankedFlex: `${$utils.translate('rank', rank.queueMap.RANKED_FLEX_SR.tier)} ${rank.queueMap.RANKED_FLEX_SR.division}`,
        }
      }
      playerList.push(temp)
    }

    playerList = sortAndSetDesignation(playerList)
    let tempArr = []
    playerList.forEach(player => {
      tempArr.push({ summonerName: player.summonerName, gameIds: player.matches.gameIds })
      blacklistNotice(player.summonerName, 'champSelect')
    })

    const orderTogether = checkTogether(tempArr)
    await togetherNotice(orderTogether, 'champSelect')

    $winManage.global.tools.webContents.send('tool-panel-data', new Date().getTime())
    await $api.sendMsgInChampSelect('SELF', `TikLeagueTool 友军面板数据已获取`)

    const data = {
      orderList: playerList,
      chaosList: [],
      orderTogether,
      chaosTogether: {
        arr1: [],
        arr2: [],
      },
    }
    console.log(data)
    $cache.set('panelData', data)
    $winManage.global.main.webContents.send('panel-data', new Date().getTime())
    return data
  } catch (err) {
    $log.error(`[getPanelDataInChampSelect] ${err}`)
    return null
  }
}

export async function getPanelDataInGame() {
  $log.info('正在获取对局中面板信息')
  try {
    let playerList
    let panelData = {
      orderList: [],
      chaosList: [],
      orderTogether: {},
      chaosTogether: {},
    }
    let curTeam = ''
    const curSummoner = await $api.getCurrentSummoner()
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // getPlayerListInGame这个接口在刚进入游戏时可能获取不到数据，直接走个死循环，有时候获取到了还是空数组
      playerList = (await $api.getPlayerListInGame()) || []
      if (playerList.length > 0) break
    }
    console.log(playerList)

    /* 组排检测用临时变量 */
    let tempOrderArr = []
    let tempChaosArr = []

    for (let i = 0; i < playerList.length; i++) {
      let temp = {}
      if (curSummoner.displayName === playerList[i].summonerName) curTeam = playerList[i].team

      temp.team = playerList[i].team
      temp.position = playerList[i].position
      temp.summonerName = playerList[i].summonerName
      temp.profileIcon = $utils.getChampionAvatarByCnName(playerList[i].championName)
      temp.summonerId = ''
      temp.matches = { gameIds: [], source: '', kda: '', winRate: '', data: '' }
      temp.rank = { rankedSolo: '', rankedFlex: '' }
      if (!playerList[i].isBot) {
        const summoner = await $api.getSummonerInfoBySummonerName(playerList[i].summonerName)
        // const historyMatches = await $api.getHistoryMatchesByPuuidV2(summoner.puuid)
        const historyMatches = await $api.getHistoryMatches(playerList[i].summonerId, summoner.puuid)
        const rank = await $api.getRankedStatusInfoByPuuid(summoner.puuid)
        temp.summonerId = summoner.summonerId
        temp.matches = await historyMatchesHandle(historyMatches)
        temp.rank = {
          rankedSolo: `${$utils.translate('rank', rank.queueMap.RANKED_SOLO_5x5.tier)} ${rank.queueMap.RANKED_SOLO_5x5.division}`,
          rankedFlex: `${$utils.translate('rank', rank.queueMap.RANKED_FLEX_SR.tier)} ${rank.queueMap.RANKED_FLEX_SR.division}`,
        }
      }

      if (playerList[i].team == 'ORDER') {
        panelData.orderList.push(temp)
        tempOrderArr.push({ summonerName: temp.summonerName, gameIds: temp.matches.gameIds })
      } else {
        panelData.chaosList.push(temp)
        tempChaosArr.push({ summonerName: temp.summonerName, gameIds: temp.matches.gameIds })
        // blacklistNotice(temp.summonerName, 'inGame')
      }
    }

    panelData.orderList = sortAndSetDesignation(panelData.orderList)
    panelData.chaosList = sortAndSetDesignation(panelData.chaosList)
    panelData.orderTogether = checkTogether(tempOrderArr)
    panelData.chaosTogether = checkTogether(tempChaosArr)

    $cache.set('panelData', panelData)
    $winManage.global.main.webContents.send('panel-data', new Date().getTime())
    return panelData
  } catch (err) {
    $log.error(`[getPanelDataInGame] ${err}`)
    return null
  }
}

/**
 * 多排检测
 * @param {*} checkArr [{summonerName: "", gameIds: []}]
 */
export function checkTogether(checkArr) {
  let arr1 = []
  let arr2 = []

  for (let i = 0; i < checkArr.length; i++) {
    for (let j = 0; j < checkArr.length; j++) {
      if (j <= i) continue
      const toggle = _.intersection(checkArr[i].gameIds, checkArr[j].gameIds)
      if (toggle.length >= 2) {
        // 说明是组队的
        // 只有当两个人都不在组队1时 才能将其放入
        if (!arr1.includes(checkArr[i].summonerName) && !arr1.includes(checkArr[j].summonerName)) {
          // 判断组队1有几个元素
          if (arr1.length == 0) {
            if (!arr1.includes(checkArr[i].summonerName)) {
              arr1.push(checkArr[i].summonerName)
            }
            if (!arr1.includes(checkArr[j].summonerName)) {
              arr1.push(checkArr[j].summonerName)
            }
          } else {
            if (!arr2.includes(checkArr[i].summonerName)) {
              arr2.push(checkArr[i].summonerName)
            }
            if (!arr2.includes(checkArr[j].summonerName)) {
              arr2.push(checkArr[j].summonerName)
            }
          }
        }
        if (arr1.includes(checkArr[i].summonerName) || arr1.includes(checkArr[j].summonerName)) {
          if (!arr1.includes(checkArr[i].summonerName)) {
            arr1.push(checkArr[i].summonerName)
          }
          if (!arr1.includes(checkArr[j].summonerName)) {
            arr1.push(checkArr[j].summonerName)
          }
        }
      }
    }
  }

  if (arr1.length == 1) arr1 = []
  if (arr2.length == 1) arr2 = []
  return { arr1, arr2 }
}
