<template>
  <div class="h-full w-full flex ">
    <div class="mr-1 w-full  flex flex-col ">
      <t-card>
        <div class="flex justify-between">
          <!-- 常规信息 -->
          <div class="flex items-center">
            <t-badge :count="`Lv.${currentSummoner.summonerLevel}`">
              <t-avatar :image="currentSummoner.avatar" shape="round" size="86px"></t-avatar>
            </t-badge>
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
        <div class="px-1 ">
          当前游戏状态：
          <span class="text-blue-500 font-semibold">{{ currentSummoner.gameStatus }}</span>
        </div>
      </t-card>
      <div class="mt-2 w-full flex">
        <t-card class="h-full flex-1 !mr-1">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="text-base font-medium text-gray-500">近期20把对局</div>
              <div class="mt-4 flex items-end">
                <span class="text-lg font-semibold text-gray-700">KDA</span>
                <span class="ml-3 text-4xl font-semibold">{{ currentSummoner.showData.kda }}</span>
              </div>
            </div>
            <img class="w-24" src="@/assets/zhe.png">
          </div>
        </t-card>
        <t-card class="h-full flex-1 !ml-1">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="text-base font-medium text-gray-500">近期20把对局场均</div>
              <div class="mt-4 flex items-end">
                <span class="text-lg font-semibold text-gray-700">输出</span>
                <span class="ml-3 text-4xl font-semibold">{{ currentSummoner.showData.damage }}</span>
              </div>
            </div>
            <img class="w-24" src="@/assets/bin.png">
          </div>
        </t-card>
      </div>
      <div class="mt-2 w-full flex items-stretch">
        <t-card class="h-full flex-1 !mr-1">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="text-base font-medium text-gray-500">近期20把对局场均</div>
              <div class="mt-4 flex items-end">
                <span class="text-lg font-semibold text-gray-700">经济</span>
                <span class="ml-3 text-4xl font-semibold">{{ currentSummoner.showData.money }}</span>
              </div>
            </div>
            <img class="w-24" src="@/assets/zhu.png">
          </div>
        </t-card>
        <t-card class="flex-1">
          <div class="f-full flex flex-col !ml-1">
            <div class="text-base font-medium text-gray-500 mb-0.5">近期常用位置</div>
            <div class="flex items-center justify-around">
              <div class="mt-2 flex flex-col items-center justify-center"
                v-for="(obj, key, index) in (currentSummoner.rencentlyPosition as any)" :key="index" >
                <img class="w-12" :src="positionIcon[key.toLowerCase()]" />
                <div class="mt-2 !bg-green-500 px-2 rounded-sm  text-white">共{{obj.total}}场 / <span class="font-semibold ">胜率{{((obj.wins * 100)/ obj.total).toFixed(1)}}%</span>
                </div>
              </div>
            </div>
          </div>
        </t-card>
      </div>
      <div class="!mt-2 flex-1">
        <t-card class="h-full">
          <div class="flex h-full items-center justify-between">
            <div class="flex h-full flex-col w-full">
              <div class="text-base font-medium text-gray-500 mb-0.5">常用英雄</div>
              <div class="mt-5 flex items-center justify-between w-full ">
                <div class="w-full flex flex-col justify-center items-center mx-2"
                  v-for="(item, index) in (currentSummoner.championMastery.masteries as any)" :key="index">
                  <t-avatar :image="utils.getChampionAvatarById(item.championId)" shape="circle" size="62px" />
                  <div class="mt-4 !bg-red-400 px-2 rounded-sm  text-white flex items-center">
                    <div>成就等级：</div>
                    <div class="font-semibold text-xl">{{
                        item.highestGrade
                    }}</div>
                  </div>
                  <div class="mt-2 !bg-green-500 px-2 rounded-sm  text-white flex items-center">
                    <div>熟练度：</div>
                    <div class="font-semibold ">{{
                        item.championPoints
                    }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </t-card>
      </div>
    </div>
    <div class="!w-[324px] h-full ml-1">
      <t-card class="h-full" header-bordered>
        <template #header>
          <div class="w-full flex items-center justify-between">
            <div class="text-base">近期战绩</div>
            <t-link theme="primary"> 查看更多 </t-link>
          </div>
        </template>
        <block class="flex justify-between w-[188px] py-1.6"
          v-for="(item, index) in (currentSummoner.historyMatch.slice(0, 10) as any)" :key="index">
          <t-avatar :image="utils.getChampionAvatarById(item.participants[0].championId)" shape="round" size="44px" />
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
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRankdTigerImg } from '@/assets/rank-tiger'
import { ipcRenderer } from 'electron';
import dayjs from 'dayjs';
import { positionIcon } from '@/assets/rank-position'
import { onMounted, ref } from 'vue';
import _ from 'lodash';


const handle = window.handle
const utils = window.utils

const currentSummoner = ref({
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
  rencentlyPosition: {},
  championMastery: {
    source: null,
    masteries: []
  },
  showData: {
    kda: '',
    damage: '',
    money: ''
  }
})

onMounted(async () => {
  currentSummoner.value = await handle.currentSummonerInfo()
  console.log(currentSummoner.value);

})

ipcRenderer.on('playerStatus', (event, message) => {
  currentSummoner.value.gameStatus = utils.translate('status', message)
})

</script>

<style lang="less">
.t-card__body {
  display: flow-root;
  padding: 12px 20px;
  line-height: 1.5;
}
</style>