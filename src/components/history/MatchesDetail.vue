<template>
  <div class="h-full w-full flex">
    <a-card class="w-[24%]" :hoverable="true" :header-style="{ border: 'none' }">
      <!-- 搜索框 -->
      <a-input-search v-model="summonerName" placeholder="请输入游戏名" size="small" button-text="查找" search-button
                      @click="getHistory"/>
      <!-- 历史列表 -->
      <div class="mt-4" style="border-top: 1px solid var(--color-border-2) ">
        <block class="history_list_box flex cursor-pointer justify-around py-2"
               :class="[inShowGameId == item.gameId ? 'history_detail_item__active' : '']"
               v-for="(item, index) in historyList" :key="index" @click="getHistoryDetail(item.gameId)">
          <div class="w-12">
            <img :src="utils.getChampionAvatarById(item.participants[0].championId)"/>
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
                    :page-size="pagination.size" simple @change="changePage"/>
    </a-card>
    <a-spin class="flex-1 ml-2" :loading="isLoading" tip="如果该界面长时间未响应，可能需要重启软件...">
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <div class="flex items-center justify-between">
          <div class="flex flex-col items-center justify-center">
            <span style="color: var(--color-text-3)">日期</span>
            <span class="mt-1" style="color: var(--color-text-1)">{{
                dayjs(matchesDetail.gameCreationDate).format('YYYY-MM-DD')
              }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span style="color: var(--color-text-3)">类型</span>
            <span class="mt-1" style="color: var(--color-text-1)">{{ matchesDetail.queueId }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span style="color: var(--color-text-3)">开始时间</span>
            <span class="mt-1"
                  style="color: var(--color-text-1)">{{ dayjs(matchesDetail.gameCreationDate).format('HH:mm') }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span style="color: var(--color-text-3)">人头比</span>
            <span class="mt-1" style="color: var(--color-text-1)">{{
                matchesDetail.killsOfTeam1
              }} / {{ matchesDetail.killsOfTeam2 }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span style="color: var(--color-text-3)">游戏时长</span>
            <span class="mt-1" style="color: var(--color-text-1)">{{
                (matchesDetail.gameDuration / 60).toFixed(0)
              }} 分钟</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <span style="color: var(--color-text-3)">经济比</span>
            <span class="mt-1" style="color: var(--color-text-1)">{{ (matchesDetail.goldOfTeam1 / 1000).toFixed(1) }}k /
              {{ (matchesDetail.goldOfTeam2 / 1000).toFixed(1) }}k</span>
          </div>
        </div>
        <div>
          <a-row class="my-2 py-1" style="background: var(--color-fill-3)">
            <a-col :span="2"></a-col>
            <a-col :span="4"><span>玩家</span></a-col>
            <a-col :span="3"><span>单双</span></a-col>
            <a-col :span="3"><span>灵活</span></a-col>
            <a-col :span="2"><span>K/D/A</span></a-col>
            <a-col :span="2"><span>伤害</span></a-col>
            <a-col :span="2"><span>经济</span></a-col>
            <a-col :span="6"><span>出装</span></a-col>
          </a-row>
          <a-row
              class="history_detail_item  py-1.5"
              :class="[index == 4 ? 'history_detail_center_border' : '',item.summonerName == summonerName ? 'history_detail_item__active font-bold' : '',]"
              style="color: var(--color-text-1)"
              v-for="(item, index) in matchesDetail.players" align="center" :key="index"
                 @click="changeSummoner(item.summonerName)">
            <a-col :span="2">
              <img class="w-[40px]" :src="utils.getChampionAvatarById(item.championId)"/>
            </a-col>
            <a-col :span="4">
              <span @click="copy(item.summonerName)">{{ item.summonerName }}</span>
              <icon-copy @click="copy(item.summonerName)" class="ml-1 !text-gray-500"/>
            </a-col>
            <a-col class="flex flex-col items-center justify-center" :span="3">
              <img class="w-10" :src="getRankdTigerImg(item.rank.rankedSoloTier)"/>
              <div class="text-sm mt-[-5px]">{{ item.rank.rankedSolo }}</div>
            </a-col>
            <a-col class="flex flex-col items-center justify-center" :span="3">
              <img class="w-10" :src="getRankdTigerImg(item.rank.rankedFlexTier)"/>
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
                  <img class="w-[30px]" v-if="itemId != 0" :src="utils.getItemsAvatarById(itemId)" alt=""/>
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
import {getRankdTigerImg} from '@/assets/rank/tiger'
import {onMounted, reactive, ref} from 'vue'
import {useRoute} from 'vue-router'
import dayjs from 'dayjs'
import {copy} from '@/utils/tools'
import {Message} from "@arco-design/web-vue";

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
  const summoner: any = await $api.getSummonerInfoBySummonerName(summonerName.value)
  const begin = (pagination.page - 1) * pagination.size
  const end = begin + pagination.size
  const matchList: any = await $api.getHistoryMatchesByPuuid(summoner.puuid, begin, end)

  historyList.value = matchList.games.games.reverse()

  // 获取最近一场的详情并展示
  getHistoryDetail(filterGameid ? filterGameid : historyList.value[0].gameId)
}

const getHistoryDetail = async (gameId: string) => {
  isLoading.value = true
  if (gameId == inShowGameId.value) return
  inShowGameId.value = gameId
  try{
    const data = await $service.getHistoryDetailByGameId(gameId)
    matchesDetail.value = data
  }catch (err){
    Message.error(`获取数据异常:${err}`)
  }
  isLoading.value = false
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
<style lang="less">
.history_list_box {
  border-bottom: 1px solid var(--color-border-2);
}

.history_list_box:hover {
  background: var(--color-fill-2);
}

.history_detail_item{
  border-bottom: 1px solid var(--color-border-2);
}

.history_detail_item:first-child{
  border-top: 1px solid var(--color-border-2);
}

.history_detail_item:hover{
  background: var(--color-fill-1);
}

.history_detail_item__active{
  background: var(--color-fill-2);
}

.history_detail_center_border{
  border-bottom: 1px solid var(--color-border-4);
}
</style>