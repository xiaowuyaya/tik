<template>
  <div class="h-full w-full flex">
    <a-card class="w-[24%]" :hoverable="true" :header-style="{ border: 'none' }">
      <!-- 搜索框 -->
      <a-input-search
        v-model="summonerName"
        placeholder="请输入游戏名"
        size="small"
        button-text="查找"
        search-button
        @click="getHistory"
      />
      <!-- 历史列表 -->
      <div class="mt-4 border-t">
        <block
          class="flex cursor-pointer justify-around py-2 border-b hover:bg-light-400"
          :class="[inShowGameId == item.gameId ? 'bg-gradient-to-r from-green-100 ...' : '']"
          v-for="(item, index) in historyList"
          :key="index"
          @click="getHistoryDetail(item.gameId)"
        >
          <div class="w-12">
            <img :src="utils.getChampionAvatarById(item.participants[0].championId)" />
          </div>
          <div class="w-[78px] flex flex-col px-[1px] items-start justify-center">
            <div
              :class="['text-base font-extrabold', item.participants[0].stats.win ? 'text-green-500' : 'text-red-500']"
            >
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
      <a-pagination
        class="absolute bottom-2"
        :total="pagination.total"
        :current="pagination.page"
        :page-size="pagination.size"
        simple
        @change="changePage"
      />
    </a-card>
    <a-card class="flex-1 ml-2" :hoverable="true" :header-style="{ border: 'none' }">
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
          <span class="mt-1 text-gray-900"
            >{{ (matchesDetail.goldOfTeam1 / 1000).toFixed(1) }}k /
            {{ (matchesDetail.goldOfTeam2 / 1000).toFixed(1) }}k</span
          >
        </div>
      </div>
      <div>
        <a-row class="my-2 bg-light-900 py-1">
          <a-col :span="2"></a-col>
          <a-col :span="6"><span>玩家</span></a-col>
          <a-col :span="3"><span>K/D/A</span></a-col>
          <a-col :span="2"><span>伤害</span></a-col>
          <a-col :span="2"><span>经济</span></a-col>
          <a-col :span="8"><span>出装</span></a-col>
        </a-row>
        <a-row
          class="border-b py-1.5 text-black first:border-t hover:bg-light-300"
          :class="[
            index == 4 ? 'border-gray-400' : '',
            item.summonerName == summonerName ? '!bg-blue-50 font-bold' : '',
          ]"
          v-for="(item, index) in matchesDetail.players"
          align="center"
          :key="index"
          @click="changeSummoner(item.summonerName)"
        >
          <a-col :span="2">
            <img class="w-[40px]" :src="utils.getChampionAvatarById(item.championId)" />
          </a-col>
          <a-col :span="6">
            <span @click="copyToClipboard(item.summonerName)">{{ item.summonerName }}</span>
            <icon-copy @click="copyToClipboard(item.summonerName)" class="ml-1 !text-gray-500" />
          </a-col>
          <a-col :span="3">
            <span>{{ item.kills }}/{{ item.deaths }}/{{ item.assists }}</span>
          </a-col>
          <a-col :span="2">
            <span>{{ (item.totalDamageDealtToChampions / 1000).toFixed(1) }}k</span>
          </a-col>
          <a-col :span="2">
            <span>{{ (item.goldEarned / 1000).toFixed(1) }}k</span>
          </a-col>
          <a-col class="!h-full" :span="8">
            <div class="flex h-full">
              <block class="flex w-[30px] mx-[1px] bg-gray-700" v-for="(itemId, i) in item.items" :key="i">
                <img class="w-[30px]" v-if="itemId != 0" :src="utils.getItemsAvatarById(itemId)" alt="" />
              </block>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import ipcRenderer from '@/utils/ipcRenderer'
import { copyToClipboard } from '@/utils/tools'

const utils = window.utils

const route = useRoute()

const summonerName = ref('')

summonerName.value = route.query.summonerName as string

// 页码
const pagination = reactive({
  total: 999,
  page: 1,
  size: 9,
})

// 历史对局列表
const historyList = ref<any>([])
// 对局详情
const matchesDetail = ref<any>({})
// 当前显示的对局详情gameId
const inShowGameId = ref('')

onMounted(async () => {
  await getHistory()
})

const getHistory = async () => {
  const recordData = await ipcRenderer.invoke('controller.lcuHandle.historyMatchesList', {
    summonerName: summonerName.value,
    page: pagination.page,
    limit: pagination.size,
  })

  historyList.value = recordData.items
  // 获取最近一场的详情并展示
  getHistoryDetail(historyList.value[0].gameId)
}

const getHistoryDetail = async (gameId: string) => {
  if (gameId == inShowGameId.value) return
  inShowGameId.value = gameId
  matchesDetail.value = await ipcRenderer.invoke('controller.lcuHandle.matchesDetail', { gameId })
  console.log(matchesDetail.value)
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
