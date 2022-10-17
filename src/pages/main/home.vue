<template>
  <div id="content" class="h-full w-full flex">
    <div class="mr-1 w-full flex flex-col">
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <div class="flex justify-between">
          <!-- 常规信息 -->
          <div class="flex items-center">
            <a-badge :text="`Lv.${currentSummoner.summonerLevel}`">
              <a-avatar :size="86" shape="square">
                <img :src="currentSummoner.avatar" />
              </a-avatar>
            </a-badge>
            <div class="ml-4">
              <div class="text-xl font-bold text-gray-900">
                {{ currentSummoner.displayName }}
              </div>
              <div class="text-base text-gray-700">
                {{ currentSummoner.environment }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="flex flex-col items-center">
              <img class="w-22" :src="getRankdTigerImg(currentSummoner.rank.rankedSoloTier)" />
              <div class="">{{ currentSummoner.rank.rankedSolo }}</div>
              <div class="text-gray-600">单双排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-22" :src="getRankdTigerImg(currentSummoner.rank.rankedFlexTier)" />
              <div class="">{{ currentSummoner.rank.rankedFlex }}</div>
              <div class="text-gray-600">灵活组排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-22" :src="getRankdTigerImg(currentSummoner.rank.rankedHighestTier)" />
              <div class="">{{ currentSummoner.rank.rankedHighest }}</div>
              <div class="text-gray-600">历史最高</div>
            </div>
          </div>
        </div>
        <div class="px-1">
          当前游戏状态：
          <span class="text-blue-500 font-semibold">{{ currentSummoner.gameStatus }}</span>
        </div>
      </a-card>
      <div class="mt-2 w-full flex">
        <a-card class="h-full flex-1 !mr-1" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="text-base font-medium text-gray-500">
                近期20把对局
                <a-popover>
                  <icon-question-circle-fill class="mx-1" size="14px" />
                  <template #content>
                    <span>算法依照WeGame的KDA计算方式：(K + A) / D * 3</span>
                  </template>
                </a-popover>
              </div>
              <div class="mt-4 flex items-end">
                <span class="text-lg font-semibold text-gray-700">KDA</span>
                <span class="ml-3 text-4xl font-semibold text-black">{{ currentSummoner.showData.kda }}</span>
              </div>
            </div>
            <img class="w-28" src="../../assets/kda_banner.svg" />
          </div>
        </a-card>
        <a-card class="h-full flex-1 !ml-1" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="text-base font-medium text-gray-500">近期20把对局场均</div>
              <div class="mt-4 flex items-end">
                <span class="text-lg font-semibold text-gray-700">输出</span>
                <span class="ml-3 text-4xl font-semibold text-black">{{ currentSummoner.showData.damage }}</span>
              </div>
            </div>
            <img class="w-28" src="../../assets/damage_banner.svg" />
          </div>
        </a-card>
      </div>
      <div class="mt-2 w-full flex items-stretch">
        <a-card class="h-full flex-1 !mr-1" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="flex items-center justify-between h-full">
            <div class="flex flex-col h-full">
              <div class="text-base font-medium text-gray-500">近期20把对局场均</div>
              <div class="mt-4 flex items-end">
                <span class="text-lg font-semibold text-gray-700">经济</span>
                <span class="ml-3 text-4xl font-semibold text-black">{{ currentSummoner.showData.money }}</span>
              </div>
            </div>
            <img class="w-28" src="../../assets/money_banner.svg" />
          </div>
        </a-card>
        <a-card class="flex-1 ml-1" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="f-full flex flex-col !ml-1">
            <div class="text-base font-medium text-gray-500 mb-0.5">近期常用位置</div>
            <div class="flex items-center justify-around">
              <div class="mt-2 flex flex-col items-center justify-center"
                v-for="(obj, key, index) in (currentSummoner.rencentlyPosition as any)" :key="index">
                <img class="w-12" :src="positionIcon[key]" />
                <div :class="obj.wins / obj.total >= 0.5 ? '!bg-green-500' : '!bg-red-400'"
                  class="mt-1 px-2 rounded text-white">
                  {{ obj.wins }}胜 {{ obj.total - obj.wins }}负
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>
      <div class="!mt-2 flex-1">
        <a-card class="h-full" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="flex h-full items-center justify-between">
            <div class="flex h-full flex-col w-full">
              <div class="text-base font-medium text-gray-500 mb-0.5">常用英雄</div>
              <div class="mt-5 flex items-center justify-between w-full">
                <div class="w-full flex flex-col justify-center items-center mx-2"
                  v-for="(item, index) in (currentSummoner.championMastery.masteries as any)" :key="index">
                  <a-avatar class="shadow-light-hover" :size="68" shape="circle">
                    <img :src="utils.getChampionAvatarById(item.championId)" />
                  </a-avatar>

                  <div v-if="item.highestGrade" class="mt-4 !bg-red-400 px-2 rounded text-white flex items-center">
                    <div>成就等级：</div>
                    <div class="font-semibold text-xl">{{ item.highestGrade }}</div>
                  </div>
                  <div v-if="!item.highestGrade" class="mt-4 !bg-yellow-400 px-2 rounded text-white flex items-center">
                    <div>英雄荣誉：</div>
                    <div class="font-semibold text-xl">{{ item.championLevel }}级</div>
                  </div>
                  <div class="mt-2 !bg-green-500 px-2 rounded text-white flex items-center">
                    <div>熟练度：</div>
                    <div class="font-semibold">{{ item.championPoints }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </div>
    <div class="!w-[324px] h-full ml-1">
      <a-card class="h-full" :hoverable="true">

        <template #title>
          <span class="text-gray-500 text-base">历史战绩</span>
        </template>
        <template #extra>
          <a-link @click="toMatchesDetail">查看更多</a-link>
        </template>

        <block class="flex justify-between w-[188px] py-1.6 cursor-pointer"
          v-for="(item, index) in (currentSummoner.hisotryMatch.slice(0, 11) as any)" :key="index"
          @click="showGameHistoryDetail(item.gameId)">
          <a-tooltip content="点击查看当局详情">
            <a-avatar :size="46" shape="square">
              <img :src="utils.getChampionAvatarById(item.participants[0].championId)" />
            </a-avatar>
          </a-tooltip>
          <div class="w-[78px] flex flex-col px-[1px] items-start justify-center">
            <div :class="['text-[14px] font-bold', item.participants[0].stats.win ? 'text-green-500' : 'text-red-500']">
              {{ item.participants[0].stats.win ? '胜利' : '失败' }}
            </div>
            <div class="text-base mt-1">
              {{ utils.translate('queue', item.queueId) }}
            </div>
          </div>
          <div class="flex items-center justify-center text-base">
            {{ dayjs(item.gameCreationDate).format('MM-DD') }}
          </div>
        </block>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRankdTigerImg } from '../../assets/rank-tiger'
import dayjs from 'dayjs'
import { positionIcon } from '../../assets/rank-position'
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { ipcRenderer } from 'electron'
import _ from 'lodash'

const router = useRouter()
const userStore = useUserStore()
const utils = $utils
const loading = ref(false)
const currentSummoner = reactive({
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
})

ipcRenderer.on('player-status', (_event, data) => {
  currentSummoner.gameStatus = utils.translate('status', data)
  /* 当进入游戏时跳转到面板 */
  if (data === 'InProgress' || data === 'ChampSelect') {
    router.push({
      path: '/panel',
    })
  }
})

userStore.userInfo({
  mac: $tools.PC_MAC,
  clientVersion: $tools.APP_VERSION,
}, false);

onMounted(async () => {
  loading.value = true
  await summonerDataInit()
  console.log(currentSummoner);

  loading.value = false

  userStore.environment = currentSummoner.environment
  userStore.summonerId = currentSummoner.summonerId
  userStore.summonerName = currentSummoner.displayName

  await userStore.registerEnvironment()
})

async function summonerDataInit(summonerName?: string) {
  const gameStatus = await $api.getGameStatus()
  currentSummoner.gameStatus = utils.translate('status', gameStatus)

  let summoner: any
  if (summonerName) {
    summoner = await $api.getSummonerInfoBySummonerName(summonerName)
  } else {
    summoner = await $api.getCurrentSummoner()
  }

  currentSummoner.displayName = summoner.displayName
  currentSummoner.summonerId = summoner.summonerId
  currentSummoner.puuid = summoner.puuid
  currentSummoner.summonerLevel = summoner.summonerLevel
  currentSummoner.avatar = utils.getProfileIcon(summoner.profileIconId)
  userStore.gameAvatar = summoner.profileIconId

  const environment = await $api.getEnvironment()
  currentSummoner.environment = utils.translate('environment', environment.environment)

  const rankStatus = await $api.getRankedStatusInfoByPuuid(summoner.puuid)
  currentSummoner.rank.rankedHighestTier = rankStatus.highestPreviousSeasonEndTier
  currentSummoner.rank.rankedHighest = `${utils.translate('rank', rankStatus.highestPreviousSeasonEndTier)} ${rankStatus.highestPreviousSeasonEndDivision
    }`
  currentSummoner.rank.rankedSoloTier = rankStatus.queueMap.RANKED_SOLO_5x5.tier
  currentSummoner.rank.rankedSolo = `${utils.translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division
    } ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`
  currentSummoner.rank.rankedFlexTier = rankStatus.queueMap.RANKED_FLEX_SR.tier
  currentSummoner.rank.rankedFlex = `${utils.translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division
    } ${rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints}`

  const hisotryMatch = await $api.getHistoryMatchesByPuuid(summoner.puuid, 0, 40)
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
    const positon = match.participants[0].timeline.lane
    const isWin = match.participants[0].stats.win
    positon == 'NONE' ? () => { } : positions.push({ positon, isWin })
  })

  currentSummoner.showData.kda = (((totalKill + totalAssist) / totalDeath) * 3).toFixed(2)
  currentSummoner.showData.damage = (totalDamage / 20).toFixed(0)
  currentSummoner.showData.money = (totalMoney / 20).toFixed(0)

  let rencentlyPositionTemp: any = {}
  let rencentlyPosition: any = {}
  _.forEach(positions, data => {
    if (!rencentlyPositionTemp[data.positon]) {
      rencentlyPositionTemp[data.positon] = []
    }
    rencentlyPositionTemp[data.positon].push(data.isWin)
  })

  _.forIn(rencentlyPositionTemp, (val, key) => {
    if (val.length > 2) {
      let wins = 0
      let total = val.length
      _.forEach(val, isWin => {
        if (isWin) wins += 1
      })
      rencentlyPosition[key] = { wins, total }
    }
  })

  currentSummoner.rencentlyPosition = rencentlyPosition

  currentSummoner.championMastery = await $api.getChampionMastery(summoner.summonerId, 4)
}

const toMatchesDetail = () => {
  router.push({
    path: '/matches-datail',
    query: {
      summonerName: currentSummoner.displayName,
    },
  })
}

async function showGameHistoryDetail(gameId: number) {
  router.push({
    path: '/matches-datail',
    query: {
      summonerName: currentSummoner.displayName,
      gameId
    },
  })
}
</script>

<style lang="less">
.t-card__body {
  display: flow-root;
  padding: 12px 20px;
  line-height: 1.5;
}
</style>
