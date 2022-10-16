<template>
  <div class="h-full w-full" v-if="playerList.orderList">
    <a-space class="h-full w-full" size="mini" v-show="!showDetailData" direction="vertical">
      <!-- 友军信息 -->
      <div class="flex justify-between !h-full">
        <block class="text-gray-900 w-full px-1" v-for="(item, index) in playerList.orderList" :key="index">
          <a-card class="!h-full"
            :class="[playerList.orderTogether.arr1.includes(item.summonerName) ? '!border-2 !border-green-400':'', playerList.orderTogether.arr2.includes(item.summonerName) ? '!border-2 !border-blue-400':'']"
            :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '8px' }">
            <div class="flex flex-col items-center justify-center w-full h-full">
              <a-avatar class="rounded cursor-pointer" :size="42" shape="square"  @click="handleAddBlacklist(item.summonerName, item.summonerId)" trigger-type="mask">
                <img :src="item.profileIcon" />
                <template #trigger-icon >
                  <icon-stop />
                </template>
              </a-avatar>
              <div class="my-1 font-bold text-black cursor-pointer" @click="handlePlayerHistory(item.summonerName)">
                {{ item.summonerName }}
                <icon-search class="ml-1" />
              </div>
              <div class="my-1 flex items-center justify-between text-[0.85rem] w-full">
                <div class="text-gray-800 text-green">单双:{{ item.rank.rankedSolo }}</div>
                <div class="text-gray-800">灵活:{{ item.rank.rankedFlex }}</div>
              </div>
              <div class="my-2 flex items-center justify-between w-full">
                <div class="flex flex-col justify-between text-[0.8rem] text-yellow-600">
                  <div class="font-bold">{{ item.type }}</div>
                  <div class="mt-1">KDA:{{ item.matches.kda }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <block v-for="(imgItem, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[28px] ml-1" :src="utils.getChampionAvatarById(imgItem.championId)" alt="" />
                  </block>
                </div>
              </div>
              <c-scrollbar width="100%" height="204px" trigger="hover">
                <block v-for="(matcheItem, index) in item.matches.data" :key="index">
                  <div class="flex mb-1 items-center justify-between w-full text-[12.5px]">
                    <div class="flex items-center justify-start">
                      <img class="w-[24px]" :src="utils.getChampionAvatarById(matcheItem.championId)" alt="" />
                      <div class="ml-1">{{ utils.translate('queue', matcheItem.queueId).slice(0, 2) }}</div>
                    </div>
                    <div :class="[matcheItem.win ? 'text-green-500' : 'text-red-500']">
                      {{ matcheItem.kills }}/{{ matcheItem.deaths }}/{{ matcheItem.assists }}
                    </div>
                    <div class="">{{ dayjs(matcheItem.gameCreationDate).format('MM-DD') }}</div>
                  </div>
                </block>
              </c-scrollbar>
            </div>
          </a-card>
        </block>
      </div>
      <!-- <div class="border"></div> -->
      <div class="flex justify-between !h-full">
        <block class="text-gray-900 w-full px-1" v-for="(item, index) in playerList.chaosList" :key="index">
          <a-card class="!h-full"
            :class="[playerList.chaosTogether.arr1.includes(item.summonerName) ? '!border-2 !border-pink-400':'', playerList.chaosTogether.arr2.includes(item.summonerName) ? '!border-2 !border-purple-400':'']"
            :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '8px' }">
            <div class="flex flex-col items-center justify-center w-full h-full">
              <a-avatar class="rounded cursor-pointer" :size="42" shape="square"
                @click="handleAddBlacklist(item.summonerName, item.summonerId)" trigger-type="mask">
                <img :src="item.profileIcon" />
                <template #trigger-icon >
                  <icon-stop />
                </template>
              </a-avatar>
              <div class="my-1 font-bold text-black cursor-pointer" @click="handlePlayerHistory(item.summonerName)">
                {{ item.summonerName }}
                <icon-search class="ml-1" />
              </div>
              <div class="my-1 flex items-center justify-between text-[0.85rem] w-full">
                <div class="text-gray-800">单双:{{ item.rank.rankedSolo }}</div>
                <div class="text-gray-800">灵活:{{ item.rank.rankedFlex }}</div>
              </div>
              <div class="my-2 flex items-center justify-between w-full">
                <div class="flex flex-col justify-between text-[0.8rem] text-yellow-600">
                  <div class="font-bold">{{ item.type }}</div>
                  <div class="mt-1">KDA:{{ item.matches.kda }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <block v-for="(imgItem, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[28px] ml-1" :src="utils.getChampionAvatarById(imgItem.championId)" alt="" />
                  </block>
                </div>
              </div>
              <c-scrollbar width="100%" height="204px" trigger="hover">
                <block v-for="(matcheItem, index) in item.matches.data" :key="index">
                  <div class="flex mb-1 items-center justify-between w-full text-[12.5px]">
                    <div class="flex items-center justify-start">
                      <img class="w-[24px]" :src="utils.getChampionAvatarById(matcheItem.championId)" alt="" />
                      <div class="ml-1">{{ utils.translate('queue', matcheItem.queueId).slice(0, 2) }}</div>
                    </div>
                    <div :class="[matcheItem.win ? 'text-green-500' : 'text-red-500']">
                      {{ matcheItem.kills }}/{{ matcheItem.deaths }}/{{ matcheItem.assists }}
                    </div>
                    <div class="">{{ dayjs(matcheItem.gameCreationDate).format('MM-DD') }}</div>
                  </div>
                </block>
              </c-scrollbar>
            </div>
          </a-card>
        </block>
      </div>
    </a-space>

    <a-button v-show="playerList.orderList.length != 5 || playerList.chaosList.length != 5"
      class="!absolute bottom-8 right-6" type="primary" status="success" size="large" :loading="btnLoading"
      @click="getPanelData">
      <template #icon>
        <icon-loop />
      </template>
      重新获取
    </a-button>

    <!-- 拉黑对话框 -->
    <a-modal v-model:visible="blacklistModalState.show" :title="blacklistModalState.title" @ok="submitBlacklist">
      <a-form :model="blacklistModalState.form">
        <a-form-item class="!mb-0" field="name" label="拉黑原因">
          <a-textarea v-model="blacklistModalState.form.reason" placeholder="请输入拉黑原因，可空" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { copy, checkTogether } from '../../utils/'
import { useBlacklistStore } from '../../store/blacklist'
import { useUserStore } from '../../store/user'
import { ipcRenderer } from 'electron'
import _ from 'lodash'

const router = useRouter()
const blacklistStore = useBlacklistStore()
const userStore = useUserStore()
const btnLoading = ref(false)
// 面板数据
const playerList = ref<any>({
  orderList: [],
  chaosList: [],
})
// 玩家状态
const gameStatus = ref('')
// 显示详细数据
const showDetailData = ref(false)
// 拉黑对话框状态
const blacklistModalState = reactive({
  show: false,
  title: '',
  form: {
    banId: '',
    banName: '',
    reason: '',
  },
})

const utils = $utils

onMounted(async () => {
  await getPanelData()
})

ipcRenderer.on('player-status', async (event, data) => {
  gameStatus.value = data
  await getPlayerList(data)
})

const handlePlayerHistory = (summonerName: string) => {
  copy(summonerName)
  router.push({ path: '/search-content', query: { summonerName: summonerName } })
}

const handleAddBlacklist = (summonerName: string, summonerId: string) => {
  blacklistModalState.form.banId = summonerId
  blacklistModalState.form.banName = summonerName
  blacklistModalState.title = `将${summonerName}拉入黑名单`
  blacklistModalState.show = true
}

const submitBlacklist = async () => {
  await blacklistStore.add({
    environment: userStore.environment,
    summonerName: userStore.summonerName,
    summonerId: blacklistModalState.form.banId,
    banName: blacklistModalState.form.banName,
    reason: blacklistModalState.form.reason,
  })
}

const getPanelData = async () => {
  btnLoading.value = true
  // 获取当前玩家游戏状态
  gameStatus.value = await $api.getGameStatus()
  getPlayerList(gameStatus.value)
  // 如果没有加载到数据，从缓存中获取
  if (!playerList.value.orderList.lenth || playerList.value.orderList.lenth == 0) {
    playerList.value = utils.cache.get('panelData')
  }
  btnLoading.value = false
}

// 获取面板数据
const getPlayerList = async (status: string) => {
  if (status == 'InProgress' || status == 'ChampSelect') {
    /* getPanelData BEGIN */
    let data = utils.cache.get('panelData')
    if (!data) data = { orderList: [], chaosList: [] }
    try {
      const sendTogetherGame = $store.appStore.get('app.sendTogetherGame')
      if (status == 'ChampSelect' && data.orderList.length < 5) {
        data = await getPanelDataInChampSelect()
        utils.cache.put('panelData', data)
        await $api.sendMsgInChampSelect('SELF', `队友信息获取成功`)
        // 多排信息发送
        if (data.orderTogether.arr1.length > 1 && sendTogetherGame) {
          let msg = ''
          _.forEach(data.orderTogether.arr1, summonerName => {
            msg += `${summonerName}, `
          })
          await $api.sendMsgInChampSelect(sendTogetherGame ? 'ALL' : 'SELF', `[tik助手] ${msg} 为组队玩家`)
        }
        if (data.orderTogether.arr2.length > 1 && sendTogetherGame) {
          let msg = ''
          _.forEach(data.orderTogether.arr2, summonerName => {
            msg += `${summonerName}, `
          })
          await $api.sendMsgInChampSelect(sendTogetherGame ? 'ALL' : 'SELF', `[tik助手] ${msg} 为组队玩家`)
        }
      }
      if (status == 'InProgress' && data.chaosList.length == 0) {
        data = await getPanelDataInProgress()
        utils.cache.put('panelData', data)
      }
    } catch (err) {
      console.error('getPanelData', err);
    }
    /* getPanelData END */
    playerList.value = data
    console.log('panelData', playerList.value)
  }
}

async function getPanelDataInChampSelect() {
  const sessionRes = await $api.getSessionInfo()
  if (!sessionRes.myTeam) return null
  let playerList = []
  for (let i = 0; i < sessionRes.myTeam.length; i++) {
    let temp: any = {}
    temp.team = 'order'
    // 是否为机器人
    if (sessionRes.myTeam[i].summonerId != 0) {
      temp.summonerId = sessionRes.myTeam[i].summonerId
      temp.position = sessionRes.myTeam[i].assignedPosition
      const summonerInfo = await $api.getSummonerInfoBySummonerId(sessionRes.myTeam[i].summonerId)
      temp.summonerName = summonerInfo.displayName
      temp.profileIcon = utils.getProfileIcon(summonerInfo.profileIconId)

      const hisotryMatches = await $api.getHistoryMatchesByPuuid(summonerInfo.puuid)
      const matchesData = await sourcingRules(hisotryMatches)
      temp.matches = matchesData

      const rank = await $api.getRankedStatusInfoByPuuid(summonerInfo.puuid)
      temp.rank = {
        rankedSolo: `${utils.translate('rank', rank.queueMap.RANKED_SOLO_5x5.tier)} ${rank.queueMap.RANKED_SOLO_5x5.division
          }`,
        rankedFlex: `${utils.translate('rank', rank.queueMap.RANKED_FLEX_SR.tier)} ${rank.queueMap.RANKED_FLEX_SR.division
          }`,
      }
    } else {
      temp.summonerId = sessionRes.myTeam[i].summonerId
      temp.position = sessionRes.myTeam[i].assignedPosition
      temp.summonerName = 'BOT'
      temp.profileIcon = 'https://ddragon.leagueoflegends.com/cdn/12.5.1/img/profileicon/29.png'
      temp.matches = {
        source: '',
        kda: '',
        winRate: '',
        data: '',
      }
      temp.rank = {
        rankedSolo: '',
        rankedFlex: '',
      }
    }
    playerList.push(temp)
  }
  const res = sortAndSetDesignation(playerList)
  // 获取黑名单列表
  const blackList = $store.blacklistStore.get('blacklist')
  const blackNoticeToAll = $store.appStore.get('app.blacklistNoticeAll')
  for (let i = 0; i < blackList.length; i++) {
    const ban = blackList[i]
    for (let j = 0; j < res.length; j++) {
      const player = res[j]
      if (player.summonerName == ban.banName) {
        await $api.sendMsgInChampSelect(
          blackNoticeToAll ? 'ALL' : 'SELF',
          `[Tik 助手]：玩家 ${ban.banName} 在你的黑名单中, 原因：${ban.reason}`,
        )
        break
      }
    }
  }
  let tempOrderArr = []
  res.forEach(player => {
    tempOrderArr.push({ summonerName: player.summonerName, gameIds: player.matches.gameIds })
  })
  const orderTogether = checkTogether(tempOrderArr)
  return {
    orderList: res,
    chaosList: [],
    orderTogether,
    chaosTogether: {
      arr1: [],
      arr2: [],
    },
  }
}

async function getPanelDataInProgress() {
  let playerList
  let panelData = {
    orderList: [],
    chaosList: [],
    orderTogether: {},
    chaosTogether: {},
  }
  while (true) {
    try {
      /**
       * getPlayerListInGame这个接口在刚进入游戏时可能获取不到数据，直接走个死循环，有时候获取到了还是空数组
       */
      playerList = await $api.getPlayerListInGame()
      if (playerList.length > 0) break
    } catch (err) { }
  }
  for (let i = 0; i < playerList.length; i++) {
    if (!playerList[i].isBot) {
      let res: any = {}
      res.position = playerList[i].position
      res.summonerName = playerList[i].summonerName
      res.profileIcon = utils.getChampionAvatarByCnName(playerList[i].championName)
      const summoner = await $api.getSummonerInfoBySummonerName(playerList[i].summonerName)
      res.summonerId = summoner.summonerId
      const puuid = summoner.puuid
      const hisotryMatches = await $api.getHistoryMatchesByPuuid(puuid)
      const matchesData = await sourcingRules(hisotryMatches)
      res.matches = matchesData
      const rank = await $api.getRankedStatusInfoByPuuid(puuid)
      res.rank = {
        rankedSolo: `${utils.translate('rank', rank.queueMap.RANKED_SOLO_5x5.tier)} ${rank.queueMap.RANKED_SOLO_5x5.division
          }`,
        rankedFlex: `${utils.translate('rank', rank.queueMap.RANKED_FLEX_SR.tier)} ${rank.queueMap.RANKED_FLEX_SR.division
          }`,
      }
      if (playerList[i].team == 'ORDER') {
        panelData.orderList.push(res)
      } else {
        panelData.chaosList.push(res)
      }
    } else {
      let res: any = {}
      res.position = playerList[i].position
      res.summonerName = playerList[i].summonerName
      res.profileIcon = utils.getChampionAvatarByCnName(playerList[i].championName)
      res.matches = {
        source: '',
        kda: '',
        winRate: '',
        data: '',
      }
      res.rank = {
        rankedSolo: '',
        rankedFlex: '',
      }
      if (playerList[i].team == 'ORDER') {
        panelData.orderList.push(res)
      } else {
        panelData.chaosList.push(res)
      }
    }
  }
  panelData.orderList = sortAndSetDesignation(panelData.orderList)
  panelData.chaosList = sortAndSetDesignation(panelData.chaosList)

  let tempOrderArr = []
  let tempChaosArr = []

  panelData.orderList.forEach(player => {
    tempOrderArr.push({ summonerName: player.summonerName, gameIds: player.matches.gameIds })
  })

  panelData.chaosList.forEach(player => {
    tempChaosArr.push({ summonerName: player.summonerName, gameIds: player.matches.gameIds })
  })

  panelData.orderTogether = checkTogether(tempOrderArr)
  panelData.chaosTogether = checkTogether(tempChaosArr)

  return panelData
}

function sortAndSetDesignation(list: any[]) {
  list.sort((a, b) => {
    if (a.matches.source > b.matches.source) {
      return -1
    } else if (a.matches.source < b.matches.source) {
      return 1
    } else {
      return 0
    }
  })
  const summonerTitle = $store.appStore.get('app.typeTitle')
  // 设置排名
  for (let i = 0; i < list.length; i++) {
    // const str = `no${i + 1}`
    list[i].type = summonerTitle[i]
  }
  return list
}

async function sourcingRules(hisotryMatches: any) {
  hisotryMatches = hisotryMatches.games.games

  // 去除非排位赛对局数据
  if ($store.appStore.get('app.onlyRankData')) {
    hisotryMatches = hisotryMatches.filter(item => {
      return item.gameMode == 'CLASSIC'
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

  let data = []

  hisotryMatches.forEach(async match => {
    let temp: any = {}
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

    data.push(temp)

    // 获取玩家最近英雄情况
    recentChampions.push(temp.championId)

    k += temp.kills
    d += temp.deaths
    a += temp.assists

    if (temp.win) {
      w += 1
    }

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
  let WIN_RATE = w / hisotryMatches.length
  let SOURCE = (KDA * 10 * 0.4 + WIN_RATE * 100 * 0.4 + killingSpreesSource * 0.2) * 10

  // 获取最近常用英雄
  let recentChampionsCount = []
  recentChampions.sort()
  for (let i = 0; i < recentChampions.length;) {
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
  // 排序
  recentChampionsCount.sort((a, b) => {
    return a.count > b.count ? -1 : 1
  })
  // 切割
  recentChampionsCount = recentChampionsCount.slice(0, 3)

  const res = {
    gameIds,
    recentChampionsCount,
    source: SOURCE.toFixed(2),
    kda: KDA.toFixed(2),
    winRate: `${(WIN_RATE * 100).toFixed(2)}%`,
    // 战绩显示最近的十把，倒序排列
    data: data.slice(-10).reverse(),
  }
  return res
}
</script>
