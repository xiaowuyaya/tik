import * as api from './api'
import { translate } from '../utils/translate'
import _ from 'loadsh'
import { getProfileIcon } from '../utils'

export const currentSummonerInfo = async () => {
  let currentSummoner = {
    gameStatus: '',
    avatar: '',
    summonerLevel: '',
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

  const gameStatus = await api.getGameStatus()
  currentSummoner.gameStatus = translate('status', gameStatus);

  const summoner = await api.getCurrentSummoner()

  currentSummoner.displayName = summoner.displayName
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

  const hisotryMatch = await api.getHistoryMatchesByPuuid(summoner.puuid, 0, 20)
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

  const championMastery = await api.getChampionMastery(summoner.summonerId, 3)
  currentSummoner.championMastery = championMastery

  return currentSummoner
}