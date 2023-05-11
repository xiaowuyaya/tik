<script setup>
import dayjs from '../../utils/dateUtil'
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { useUserStore } from '../../store/user'
import { useBlacklistStore } from '../../store/blacklist'
import { copy, saveRecentlySearchList } from '../../utils'
import { ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
const utils = $utils
const router = useRouter()
const blacklistStore = useBlacklistStore()
const userStore = useUserStore()

const positionIcon = {
  bottom: 'https://s-lol-web.op.gg/images/icon/icon-position-bot-dark.svg',
  jungle: 'https://s-lol-web.op.gg/images/icon/icon-position-jng-dark.svg',
  middle: 'https://s-lol-web.op.gg/images/icon/icon-position-mid-dark.svg',
  support: 'https://s-lol-web.op.gg/images/icon/icon-position-sup-dark.svg',
  top: 'https://s-lol-web.op.gg/images/icon/icon-position-top-dark.svg',
}
const stateData = reactive({
  playerList: { orderList: [], chaosList: [] },
  coPlays: { orderTogether: [], chaosTogether: [] },
  gameStatus: '',
  loading: false,
  blacklistModal: {
    show: false,
    title: '',
    form: {
      banId: '',
      banName: '',
      reason: '',
    },
  },
})

async function getPanelData(status) {
  if (status == 'InProgress' || status == 'ChampSelect') {
    let data = $cache.get('panelData') || { orderList: [], chaosList: [] }
    if (status == 'ChampSelect' && data.orderList.length < 5) {
      $log.info(`ChampSelect, order length: ${data.orderList.length}`)
      data = (await $service.getPanelDataInChampSelect()) || { orderList: [], chaosList: [] }
    }
    if (status == 'InProgress' && data.chaosList.length == 0) {
      $log.info(`InProgress, chaos length: ${data.chaosList.length}`)
      data = (await $service.getPanelDataInGame()) || { orderList: [], chaosList: [] }
    }

    stateData.playerList.orderList = data.orderList
    stateData.playerList.chaosList = data.chaosList
    stateData.coPlays.orderTogether = data.orderTogether
    stateData.coPlays.chaosTogether = data.chaosTogether
  } else {
    const data = $cache.get('panelData')
    stateData.playerList.orderList = data.orderList
    stateData.playerList.chaosList = data.chaosList
    stateData.coPlays.orderTogether = data.orderTogether
    stateData.coPlays.chaosTogether = data.chaosTogether
  }
}

function handlePlayerHistory(summonerName) {
  copy(summonerName)
  saveRecentlySearchList(summonerName)
  // notice: 如果当前路由在 summoner_info 无法使用push, 这边先跳其他地方在转回来
  router.push('/RecordQuery').then(() => {
    router.push({ path: '/SummonerInfo', query: { summonerName: summonerName } })
  })
}

function handleAddBlacklist(info) {
  ElMessageBox.confirm(`是否将 ${info.summonerName} 拉入黑名单，下次遇见时将会提醒`, '拉黑玩家', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(async () => {
      await blacklistStore.add({
        environment: userStore.environment,
        summonerName: userStore.summonerName,
        banName: info.summonerName,
        banId: info.summonerId,
        reason: '通过面板拉黑',
      })
    })
    .catch(() => {})
}

async function init() {
  stateData.loading = true
  await getPanelData(await $api.getGameStatus())
  // 如果没有加载到数据，从缓存中获取
  // if (!stateData.playerList.orderList.lenth === 0 || stateData.playerList.orderList.lenth === 0) {
  //   stateData.playerList = $cache.get('panelData')
  // }
  stateData.loading = false
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="container" v-loading="stateData.loading">
    <el-space class="!w-full !h-full" style="align-items: normal" direction="vertical">
      <div class="flex justify-between w-full" v-for="(val, key, plIdx) in stateData.playerList" :key="plIdx">
        <div class="px-2 !w-[24%]" v-for="(item, teamIdx) in val" :key="teamIdx" v-if="val.length != 0">
          <el-card
            :class="[
              stateData.coPlays.orderTogether.arr1.includes(item.summonerName) ? (key === 'orderList' ? '!border-2 !border-green-500' : '') : '',
              stateData.coPlays.orderTogether.arr2.includes(item.summonerName) ? (key === 'orderList' ? '!border-2 !border-blue-500' : '') : '',
              stateData.coPlays.chaosTogether.arr1.includes(item.summonerName) ? (key === 'chaosList' ? '!border-2 !border-purple-500' : '') : '',
              stateData.coPlays.chaosTogether.arr2.includes(item.summonerName) ? (key === 'chaosList' ? '!border-2 !border-pink-500' : '') : '',
            ]"
            shadow="never"
            :body-style="{ padding: '8px' }"
          >
            <div class="flex flex-col items-center w-full h-full">
              <div class="flex items-center justify-evenly w-full">
                <div>
                  <img class="w-[28px] ml-1" v-if="item.matches.recentlyPosition[0]" :src="positionIcon[item.matches.recentlyPosition[0].position.toLowerCase()]" alt="" />
                </div>
                <el-avatar class="rounded cursor-pointer" :size="42" shape="square" :src="item.profileIcon" @click="handleAddBlacklist(item)" />
                <div>
                  <img class="w-[28px] ml-1" v-if="item.matches.recentlyPosition[1]" :src="positionIcon[item.matches.recentlyPosition[1].position.toLowerCase()]" alt="" />
                </div>
              </div>
              <div class="my-1 font-bold cursor-pointer flex" @click="handlePlayerHistory(item.summonerName)">
                <span>{{ item.summonerName }}</span>
                <Search class="ml-1 w-[0.9rem] font-bold" />
              </div>
              <div class="my-0.5 flex items-center justify-between w-full font-semibold">
                <div>单双:{{ item.rank.rankedSolo }}</div>
                <div class="">灵活:{{ item.rank.rankedFlex }}</div>
              </div>
              <div class="my-1 flex items-center justify-between w-full">
                <div class="flex flex-col justify-between text-[0.9rem] text-yellow-600">
                  <div class="font-bold">{{ item.type }}</div>
                  <div class="mt-0.5">KDA：{{ item.matches.kda }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <block v-for="(imgItem, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[30px] ml-1" :src="utils.getChampionAvatarById(imgItem.championId)" alt="" />
                  </block>
                </div>
              </div>
              <el-scrollbar class="!w-full" max-height="178px">
                <block v-for="(matcheItem, index) in item.matches.data" :key="index">
                  <div class="flex mb-1 items-center justify-between w-full text-base">
                    <div class="flex items-center justify-start">
                      <img class="w-[24px]" :src="utils.getChampionAvatarById(matcheItem.championId)" alt="" />
                      <div class="ml-1 font-semibold">{{ utils.translate('queue', matcheItem.queueId).slice(0, 2) }}</div>
                    </div>
                    <div :class="[matcheItem.win ? 'text-green-500' : 'text-red-500']" class="font-bold">{{ matcheItem.kills }}/{{ matcheItem.deaths }}/{{ matcheItem.assists }}</div>
                    <div class="">{{ dayjs(matcheItem.gameCreationDate).format('MM-DD') }}</div>
                  </div>
                </block>
              </el-scrollbar>
            </div>
          </el-card>
        </div>
      </div>
    </el-space>
  </div>
</template>

<style lang="less" scoped>
.el-card {
  background: none;
}

.container {
  height: 100%;
  width: 100%;
}
</style>
