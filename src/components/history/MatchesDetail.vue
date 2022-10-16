<template>
  <div class="h-full w-full flex">
    <a-card class="w-[24%]" :hoverable="true" :header-style="{ border: 'none' }">
      <!-- 搜索框 -->
      <a-input-search v-model="summonerName" placeholder="请输入游戏名" size="small" button-text="查找" search-button
        @click="getHistory" />
      <!-- 历史列表 -->
      <div class="mt-4 border-t">
        <block class="flex cursor-pointer justify-around py-2 border-b hover:bg-light-400"
          :class="[inShowGameId == item.gameId ? 'bg-gradient-to-r from-green-100 ...' : '']"
          v-for="(item, index) in historyList" :key="index" @click="getHistoryDetail(item.gameId)">
          <div class="w-12">
            <img :src="utils.getChampionAvatarById(item.participants[0].championId)" />
          </div>
          <div class="w-[78px] flex flex-col px-[1px] items-start justify-center">
            <div
              :class="['text-base font-extrabold', item.participants[0].stats.win ? 'text-green-500' : 'text-red-500']">
              {{ item.participants[0].stats.win ? '胜利' : '失败' }}
            </div>
            <div class="text-base mt-1">
              {{ utils.translate('queue', item.queueId) }}
            </div>
          </div>
          <div class="flex items-center justify-center text-sm">
            {{ dayjs(item.gameCreationDate).format('MM-DD') }}
          </div>
        </block>
      </div>
      <a-pagination class="absolute bottom-2" :total="pagination.total" :current="pagination.page"
        :page-size="pagination.size" simple @change="changePage" />
    </a-card>
    <a-spin class="flex-1 ml-2" :loading="isLoading">
      <a-card  :hoverable="true" :header-style="{ border: 'none' }">
        <div class="flex items-center justify-between">
          <div class="flex flex-col items-center justify-center">
            <span class="text-gray-500">日期</span>
            <span class="mt-1 text-gray-900">{{ dayjs(matchesDetail.gameCreationDate).format('YYYY-MM-DD') }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="text-gray-500">类型</span>
            <span class="mt-1 text-gray-900">{{ matchesDetail.queueId }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="text-gray-500">开始时间</span>
            <span class="mt-1 text-gray-900">{{ dayjs(matchesDetail.gameCreationDate).format('HH:mm') }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="text-gray-500">人头比</span>
            <span class="mt-1 text-gray-900">{{ matchesDetail.killsOfTeam1 }} / {{ matchesDetail.killsOfTeam2 }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="text-gray-500">游戏时长</span>
            <span class="mt-1 text-gray-900">{{ (matchesDetail.gameDuration / 60).toFixed(0) }} 分钟</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span class="text-gray-500">经济比</span>
            <span class="mt-1 text-gray-900">{{ (matchesDetail.goldOfTeam1 / 1000).toFixed(1) }}k /
              {{ (matchesDetail.goldOfTeam2 / 1000).toFixed(1) }}k</span>
          </div>
        </div>
        <div>
          <a-row class="my-2 bg-light-900 py-1">
            <a-col :span="2"></a-col>
            <a-col :span="4"><span>玩家</span></a-col>
            <a-col :span="3"><span>单双</span></a-col>
            <a-col :span="3"><span>灵活</span></a-col>
            <a-col :span="2"><span>K/D/A</span></a-col>
            <a-col :span="2"><span>伤害</span></a-col>
            <a-col :span="2"><span>经济</span></a-col>
            <a-col :span="6"><span>出装</span></a-col>
          </a-row>
          <a-row class="border-b py-1.5 text-black first:border-t hover:bg-light-300" :class="[
            index == 4 ? 'border-gray-400' : '',
            item.summonerName == summonerName ? '!bg-blue-50 font-bold' : '',
          ]" v-for="(item, index) in matchesDetail.players" align="center" :key="index"
            @click="changeSummoner(item.summonerName)">
            <a-col :span="2">
              <img class="w-[40px]" :src="utils.getChampionAvatarById(item.championId)" />
            </a-col>
            <a-col :span="4">
              <span @click="copy(item.summonerName)">{{ item.summonerName }}</span>
              <icon-copy @click="copy(item.summonerName)" class="ml-1 !text-gray-500" />
            </a-col>
            <a-col class="flex flex-col items-center justify-center" :span="3">
              <img class="w-10" :src="getRankdTigerImg(item.rank.rankedSoloTier)" />
              <div class="text-sm mt-[-5px]">{{ item.rank.rankedSolo }}</div>
            </a-col>
            <a-col class="flex flex-col items-center justify-center" :span="3">
              <img class="w-10" :src="getRankdTigerImg(item.rank.rankedFlexTier)" />
              <div class="text-sm mt-[-5px]">{{ item.rank.rankedFlex }}</div>
            </a-col>
            <a-col :span="2">
              <span>{{ item.kills }}/{{ item.deaths }}/{{ item.assists }}</span>
            </a-col>
            <a-col :span="2">
              <span>{{ (item.totalDamageDealtToChampions / 1000).toFixed(1) }}k</span>
            </a-col>
            <a-col :span="2">
              <span>{{ (item.goldEarned / 1000).toFixed(1) }}k</span>
            </a-col>
            <a-col class="!h-full" :span="6">
              <div class="flex h-full">
                <block class="flex w-[30px] mx-[1px] bg-gray-700" v-for="(itemId, i) in item.items" :key="i">
                  <img class="w-[30px]" v-if="itemId != 0" :src="utils.getItemsAvatarById(itemId)" alt="" />
                </block>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { getRankdTigerImg } from '../../assets/rank-tiger'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { copy } from '../../utils/tools'

const utils = $utils
const route = useRoute()
const summonerName = ref('')
const isLoading = ref(false)
// 页码
const pagination = reactive({
  total: 999,
  page: 1,
  size: 10,
})

// 历史对局列表
const historyList = ref<any>([])
// 对局详情
const matchesDetail = ref<any>({})
// 当前显示的对局详情gameId
const inShowGameId = ref('')

summonerName.value = route.query.summonerName as string
const filterGameid = route.query.gameId as string

onMounted(async () => {
  await getHistory()
})

const getHistory = async () => {
  const summoner = await $api.getSummonerInfoBySummonerName(summonerName.value)
  const begin = (pagination.page - 1) * pagination.size
  const end = begin + pagination.size
  const matchList = await $api.getHistoryMatchesByPuuid(summoner.puuid, begin, end)

  historyList.value = matchList.games.games.reverse()
  
  // 获取最近一场的详情并展示
  getHistoryDetail(filterGameid ? filterGameid : historyList.value[0].gameId)
}

const getHistoryDetail = async (gameId: string) => {
  isLoading.value = true
  if (gameId == inShowGameId.value) return
  inShowGameId.value = gameId
  const data = await $api.getHistoryDetailByGameId(gameId)
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
    const rankStatus = await $api.getRankedStatusInfoByPuuid(player.puuid)
    player.rank = {
      rankedSoloTier: rankStatus.queueMap.RANKED_SOLO_5x5.tier,
      rankedSolo: `${utils.translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division
        } ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`,
      rankedFlexTier: rankStatus.queueMap.RANKED_FLEX_SR.tier,
      rankedFlex: `${utils.translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division
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
  isLoading.value = false
  matchesDetail.value = {
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

const changePage = async (pageNum: number) => {
  if (pageNum == 0) return
  pagination.page = pageNum
  await getHistory()
}

const changeSummoner = async (name: string) => {
  summonerName.value = name
  await getHistory()
}
</script>
