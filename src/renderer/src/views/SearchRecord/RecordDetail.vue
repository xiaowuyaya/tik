<script setup>
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copy, hh } from '../../utils'
import { getRankTigerImg } from '../../assets/image/rank_emblems_opgg'
import dayjs from '../../utils/dateUtil'

const utils = $utils
const route = useRoute()
const summonerName = ref('')
const detailLoading = ref(false)
const inShowGameId = ref('')
const history = reactive({ list: [], detail: {}, pagination: { total: 999, page: 1, size: 9 } })

const filterGameId = route.query.gameId
summonerName.value = route.query.summonerName

async function getHistoryList() {
  const credentials = $cache.get('credentials')
  const isTencent = credentials.region == 'TENCENT'
  const summoner = await $api.getSummonerInfoBySummonerName(summonerName.value)
  const begin = (history.pagination.page - 1) * history.pagination.size
  const end = begin + (isTencent ? history.pagination.size : history.pagination.size - 1)
  // const matchList = await $api.getHistoryMatchesByPuuidV2(summoner.puuid, begin, end)
  const matchList = await $api.getHistoryMatchesByPuuidV2(summoner.puuid, begin, end)
  history.list = isTencent ? matchList.games.games.reverse() : matchList.games.games
  // 获取最近一场的详情并展示
  await getHistoryDetail(filterGameId ? filterGameId : history.list[0].gameId)
}

async function getHistoryDetail(gameId) {
  detailLoading.value = true
  if (gameId == inShowGameId.value) return
  history.detail = {}
  inShowGameId.value = gameId
  try {
    const data = await $service.historyDetailInfo(gameId)
    history.detail = data
  } catch (err) {
    $log.error(`[page RecordDetail] 获取历史战绩详情失败: ${err}`)
    ElMessage.error(`获取历史战绩详情失败`)
  }
  detailLoading.value = false
}

async function changeSearchSummoner(name) {
  if (summonerName.value === name) {
    ElMessage.warning(`该玩家已经是当前搜索的玩家了`)
    return
  }
  summonerName.value = name
  copy(summonerName.value)
  await getHistoryList()
}

getHistoryList()
</script>

<template>
  <div class="container">
    <!--个人战绩-->
    <el-card class="!h-full w-[210px]" shadow="never" :body-style="{ padding: '10px 0 10px 10px' }">
      <template #header>
        <span>当前玩家: </span>
        <span class="text-[1.2rem] font-bold ml-2">{{ summonerName }}</span>
      </template>
      <div
        :class="[index == 9 ? 'border-none' : 'border-b', inShowGameId === item.gameId ? 'bg-gray-100 dark:bg-[#1d1e1f] border-r-4' : '']"
        class="flex h-full justify-between w-full py-[7px] cursor-pointer border-b border-[var(--el-border-color)] hover:bg-gray-100 dark:hover:bg-[#1d1e1f]"
        v-for="(item, idx) in history.list"
        :key="idx"
        @click="getHistoryDetail(item.gameId)"
      >
        <el-avatar :size="50" shape="square" :src="utils.getChampionAvatarById(item.participants[0].championId)" />
        <div class="flex-1 flex flex-col pl-2 items-start">
          <div :class="['font-semibold', item.participants[0].stats.win ? 'text-green-500' : 'text-red-500']">
            <span> {{ utils.translate('queue', item.queueId) }}</span>
            <span class="ml-1 text-base">({{ item.participants[0].stats.kills }}/{{ item.participants[0].stats.deaths }}/{{ item.participants[0].stats.assists }})</span>
          </div>
          <div class="flex mt-1">
            <el-tag effect="dark" :type="item.participants[0].stats.win ? 'success' : 'danger'" style="padding: 0px 4px">
              {{ item.participants[0].stats.win ? '胜利' : '失败' }}
            </el-tag>
            <el-tag class="ml-2" type="info">
              {{ dayjs(item.gameCreationDate).format('MM-DD HH:mm') }}
            </el-tag>
          </div>
        </div>
      </div>
      <!--      分页-->
      <div class="flex items-center justify-center mt-2">
        <el-pagination v-model:current-page="history.pagination.page" v-model:page-size="history.pagination.size" :total="history.pagination.total" layout=" prev, jumper, next" @current-change="getHistoryList" />
      </div>
    </el-card>

    <!--    详细信息-->
    <el-card class="!h-full flex-1 !ml-2" shadow="never" body-style="padding: 10px; height:100%">
      <div class="h-full w-full flex flex-col" v-if="history.detail" v-loading="detailLoading" element-loading-text="对局详情加载中...">
        <!--        对局信息-->
        <div class="flex justify-between !font-bold pb-2">
          <span>游戏模式: {{ utils.translate('queue', history.detail.queueId) }}</span>
          <span>开始时间: {{ dayjs(history.detail.gameCreationDate).format('YYYY年MM月DD HH:mm:ss') }}</span>
          <span>游戏时长: {{ dayjs.duration(history.detail.gameDuration, 'seconds').format('mm:ss') }}</span>
          <span>对局ID: {{ history.detail.gameId }}</span>
        </div>
        <!--        内容-->
        <div class="flex-1 w-full flex flex-col mt-3">
          <div class="flex flex-col !flex-1" :class="teamIdx == 1 ? '!mt-4' : ''" v-for="(teamItem, teamIdx) in history.detail.team" :key="teamIdx">
            <!--            title-->
            <el-row class="flex items-center">
              <el-col :span="17">
                <div class="flex justify-between">
                  <el-tag :type="teamItem.team.win === 'Win' ? '' : 'danger'" style="font-size: 14px; font-weight: 700">
                    {{ teamItem.team.win === 'Win' ? '胜利方' : '失败方' }}：{{ teamItem.team.teamId === 100 ? '队伍1' : '队伍2' }}
                  </el-tag>
                  <el-tag :type="teamItem.team.win === 'Win' ? '' : 'danger'" style="font-size: 14px; font-weight: 700"> 总KDA：{{ teamItem.kills }}/{{ teamItem.deaths }}/{{ teamItem.assists }} </el-tag>
                  <el-tag :type="teamItem.team.win === 'Win' ? '' : 'danger'" style="font-size: 14px; font-weight: 700"> 总经济：{{ teamItem.gold }} </el-tag>
                  <div class="flex items-center">
                    <span :class="teamItem.team.win === 'Win' ? 'text-blue-700' : 'text-red-700'" style="font-size: 14px; font-weight: 700">禁用：</span>
                    <div class="flex">
                      <img class="w-8 mx-0.5" v-for="(championItem, champIdx) in teamItem.team.bans" :key="champIdx" :src="utils.getChampionAvatarById(championItem.championId)" />
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="1" />
              <el-col :span="2" :class="teamItem.team.win === 'Win' ? 'text-blue-700' : 'text-red-700'" style="font-size: 14px; font-weight: 700">KDA </el-col>
              <el-col :span="2" :class="teamItem.team.win === 'Win' ? 'text-blue-700' : 'text-red-700'" style="font-size: 14px; font-weight: 700">伤害 </el-col>
              <el-col :span="1" :class="teamItem.team.win === 'Win' ? 'text-blue-700' : 'text-red-700'" style="font-size: 14px; font-weight: 700">经济 </el-col>
            </el-row>
            <div class="flex-1 w-full">
              <el-row
                class="py-[0.5rem] flex items-center font-bold"
                :class="[summonerItem.summonerName === summonerName ? 'bg-gray-100 dark:bg-[#1d1e1f]' : '', summonerIdx !== 4 ? 'border-b border-[var(--el-border-color)]' : '']"
                v-for="(summonerItem, summonerIdx) in teamItem.players"
                :key="summonerIdx"
              >
                <!--                符文与技能-->
                <el-col :span="2">
                  <div class="flex items-center">
                    <el-tooltip placement="top-start">
                      <template #content>
                        <div class="flex">
                          <img class="w-7 mx-1" v-for="(perkItem, perkIdx) in summonerItem.perk" :key="perkIdx" :src="utils.getPerkInfoById(perkItem).icon" />
                        </div>
                      </template>
                      <img class="w-12" :src="utils.getPerkInfoById(summonerItem.perk[0]).icon" />
                    </el-tooltip>
                    <div class="flex flex-col">
                      <img v-for="(spellId, spellIdx) in summonerItem.spells" class="w-6" :key="spellIdx" :src="utils.getSpellInfoById(spellId).img" />
                    </div>
                  </div>
                </el-col>
                <!--               头像 名字 -->
                <el-col class="flex items-center" :span="6" @click="changeSearchSummoner(summonerItem.summonerName)">
                  <!--                  <a-badge :offset="[-2, 2]"  showZero status="error" :count="`${summonerItem.champLevel}`">-->
                  <el-avatar :src="utils.getChampionAvatarById(summonerItem.championId)" :size="42" />
                  <!--                  </a-badge>-->
                  <el-tooltip :content="`复制并查询战绩：${summonerItem.summonerName}`" placement="top-start">
                    <div class="ml-6 cursor-pointer" :class="summonerItem.summonerName === summonerName ? 'underline ' : ''">{{ summonerItem.summonerName }}</div>
                  </el-tooltip>
                </el-col>
                <a-col class="flex" :span="3">
                  <el-tooltip :content="`单双排：${summonerItem.rank.rankedSolo}`">
                    <img class="w-12 mr-2" :src="getRankTigerImg(summonerItem.rank.rankedSoloTier)" />
                  </el-tooltip>
                  <el-tooltip :content="`灵活组排：${summonerItem.rank.rankedFlex}`">
                    <img class="w-12 mr-2" :src="getRankTigerImg(summonerItem.rank.rankedFlexTier)" />
                  </el-tooltip>
                </a-col>
                <el-col :span="7">
                  <div class="flex">
                    <img class="w-8 mx-0.5" v-for="(item, itemIdx) in summonerItem.items" :key="itemIdx" :src="utils.getItemsImgById(item)" />
                  </div>
                </el-col>
                <el-col :span="2">
                  <span class="!tracking-widest"> {{ summonerItem.kills }}/{{ summonerItem.deaths }}/{{ summonerItem.assists }} </span>
                </el-col>
                <el-col :span="2">
                  {{ hh(summonerItem.totalDamageDealtToChampions) }}
                </el-col>
                <el-col :span="1">
                  {{ hh(summonerItem.goldEarned) }}
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.el-card {
  --el-card-padding: 10px;
  background: none;
}

.container {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>
