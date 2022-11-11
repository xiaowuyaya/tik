<template>
  <a-spin class="h-full w-full" :loading="loading" tip="数据加载中...">
    <div class="h-full w-full flex">
      <div class="mr-1 w-full flex flex-col">
        <a-card :hoverable="true">
          <div class="flex justify-between" style="color: var(--color-text-1)">
            <!-- 常规信息 -->
            <div class="flex items-center">
              <a-badge :text="`Lv.${currentSummoner.summonerLevel}`">
                <a-avatar :size="86" shape="square">
                  <img :src="currentSummoner.avatar" />
                </a-avatar>
              </a-badge>
              <div class="ml-4">
                <div class="text-xl font-bold">
                  {{ currentSummoner.displayName }}
                </div>
                <div class="text-base">
                  {{ currentSummoner.environment }}
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="flex flex-col items-center">
                <img class="w-24" :src="getRankdTigerImg(currentSummoner.rank.rankedSoloTier)" />
                <div class="">{{ currentSummoner.rank.rankedSolo }}</div>
                <div class="">单双排</div>
              </div>
              <div class="flex flex-col items-center ml-10">
                <img class="w-24" :src="getRankdTigerImg(currentSummoner.rank.rankedFlexTier)" />
                <div class="">{{ currentSummoner.rank.rankedFlex }}</div>
                <div>灵活组排</div>
              </div>
              <div class="flex flex-col items-center ml-10">
                <img class="w-24" :src="getRankdTigerImg(currentSummoner.rank.rankedHighestTier)" />
                <div class="">{{ currentSummoner.rank.rankedHighest }}</div>
                <div>历史最高</div>
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
                <div class="text-base font-medium" style="color: var(--color-text-2)">
                  近期20把对局
                  <a-popover>
                    <icon-question-circle-fill class="mx-1" size="14px" />
                    <template #content>
                      <span>算法依照WeGame的KDA计算方式：(K + A) / D * 3</span>
                    </template>
                  </a-popover>
                </div>
                <div class="mt-4 flex items-end">
                  <span class="text-lg font-semibold" style="color: var(--color-text-1)">KDA</span>
                  <span class="ml-3 text-4xl font-semibold" style="color: var(--color-text-1)">{{
                      currentSummoner.showData.kda
                  }}</span>
                </div>
              </div>
              <img class="w-28" src="../../assets/model/kda_banner.svg" />
            </div>
          </a-card>
          <a-card class="h-full flex-1 !ml-1" :hoverable="true">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <div class="text-base font-medium" style="color: var(--color-text-2)">近期20把对局场均</div>
                <div class="mt-4 flex items-end">
                  <span class="text-lg font-semibold" style="color: var(--color-text-1)">输出</span>
                  <span class="ml-3 text-4xl font-semibold" style="color: var(--color-text-1)">{{
                      currentSummoner.showData.damage
                  }}</span>
                </div>
              </div>
              <img class="w-28" src="../../assets/model/damage_banner.svg" />
            </div>
          </a-card>
        </div>
        <div class="mt-2 w-full flex items-stretch">
          <a-card class="h-full flex-1 !mr-1" :hoverable="true">
            <div class="flex items-center justify-between h-full">
              <div class="flex flex-col h-full">
                <div class="text-base font-medium" style="color: var(--color-text-2)">近期20把对局场均</div>
                <div class="mt-4 flex items-end">
                  <span class="text-lg font-semibold " style="color: var(--color-text-1)">经济</span>
                  <span class="ml-3 text-4xl font-semibold " style="color: var(--color-text-1)">{{
                      currentSummoner.showData.money
                  }}</span>
                </div>
              </div>
              <img class="w-28" src="../../assets/model/money_banner.svg" />
            </div>
          </a-card>
          <a-card class="flex-1 ml-1" :hoverable="true" :header-style="{ border: 'none' }">
            <div class="f-full flex flex-col !ml-1">
              <div class="text-base font-medium  mb-0.5" style="color: var(--color-text-2)">近期常用位置</div>
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
          <a-card class="h-full" :hoverable="true">
            <div class="flex h-full items-center justify-between">
              <div class="flex h-full flex-col w-full">
                <div class="text-base font-medium mb-0.5" style="color: var(--color-text-2)">常用英雄</div>
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
                    <div v-if="!item.highestGrade"
                      class="mt-4 !bg-yellow-400 px-2 rounded text-white flex items-center">
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
            <span class="text-base" style="color: var(--color-text-1)">历史战绩</span>
          </template>
          <template #extra>
            <a-link @click="toMatchesDetail">查看更多</a-link>
          </template>

          <block class="flex justify-between w-full py-1.6 cursor-pointer"
            v-for="(item, index) in (currentSummoner.hisotryMatch.slice(0, 11) as any)" :key="index"
            @click="showGameHistoryDetail(item.gameId)">
            <a-tooltip content="点击查看当局详情">
              <a-avatar :size="46" shape="square">
                <img :src="utils.getChampionAvatarById(item.participants[0].championId)" />
              </a-avatar>
            </a-tooltip>
            <div class="w-[100px] flex flex-col px-[1px] items-start justify-center">
              <div
                :class="['text-[14px] font-bold', item.participants[0].stats.win ? 'text-green-500' : 'text-red-500']">
                {{ item.participants[0].stats.win ? '胜利' : '失败' }}
                ({{ item.participants[0].stats.kills }}/{{ item.participants[0].stats.deaths }}/{{
                    item.participants[0].stats.assists
                }})
              </div>
              <div class="text-base mt-1">
                {{ utils.translate('queue', item.queueId) }}
              </div>
            </div>
            <div class="ml-1 flex items-center justify-center text-base">
              {{ dayjs(item.gameCreationDate).format('MM-DD') }}
            </div>
          </block>
        </a-card>
      </div>
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { ipcRenderer } from 'electron'
import dayjs from "dayjs";
import { getRankdTigerImg } from '@/assets/rank/tiger'
import { positionIcon } from '@/assets/rank/position'
import { Message } from "@arco-design/web-vue";
import { useUserStore } from '@/store/user';
import { getToken } from '@/utils/auth';

const utils = $utils
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const currentSummoner = ref({
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
})

ipcRenderer.on('player-status', (_event, data) => {
  currentSummoner.value.gameStatus = $utils.translate('status', data)
})

onMounted(async () => {
  if (getToken()) {
    userStore.userInfo({
      mac: $consts.PC_MAC,
      clientVersion: $consts.APP_VERSION,
    }, false);
  }

  loading.value = true
  try {
    currentSummoner.value = await $service.summonerHomePageData()
    userStore.gameAvatar = currentSummoner.value.profileIconId
    userStore.environment = currentSummoner.value.environment
    userStore.summonerId = currentSummoner.value.summonerId
    userStore.summonerName = currentSummoner.value.displayName
    if (getToken()) await userStore.registerEnvironment()
  } catch (err) {
    Message.error(`获取用户信息异常:${err}`)
  }
  loading.value = false
})


const toMatchesDetail = () => {
  router.push({
    path: '/matches-datail',
    query: {
      summonerName: currentSummoner.value.displayName,
    },
  })
}

async function showGameHistoryDetail(gameId: number) {
  router.push({
    path: '/matches-datail',
    query: {
      summonerName: currentSummoner.value.displayName,
      gameId
    },
  })
}

</script>
<style>

</style>