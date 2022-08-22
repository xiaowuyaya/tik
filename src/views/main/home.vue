<template>
  <!-- <component :is="currentTabComponent"></component> -->
  <div class="h-full w-full flex">
    <div class="mr-1 w-full">
      <t-card>
        <div class="flex justify-between">
          <!-- 常规信息 -->
          <div class="flex items-center">
            <t-badge :count="`Lv.${currentSummoner.summonerLevel}`">
              <t-avatar :image="currentSummoner.avatar" shape="round" size="86px"></t-avatar>
            </t-badge>
            <div class="ml-4">
              <div class="text-xl font-extrabold text-gray-900">
                {{ currentSummoner.displayName }}
              </div>
              <div class="text-base text-gray-700">
                {{ currentSummoner.environment }}
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="flex flex-col items-center">
              <img class="w-19" :src="getRankdTigerImg(currentSummoner.rank.rankedSoloTier)" />
              <div class="font-bold">{{ currentSummoner.rank.rankedSolo }}</div>
              <div class="text-gray-600">单双排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-19" :src="getRankdTigerImg(currentSummoner.rank.rankedFlexTier)" />
              <div class="font-bold">{{ currentSummoner.rank.rankedFlex }}</div>
              <div class="text-gray-600">灵活组排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-19" :src="getRankdTigerImg(currentSummoner.rank.rankedHighestTier)" />
              <div class="font-bold">{{ currentSummoner.rank.rankedHighest }}</div>
              <div class="text-gray-600">历史最高</div>
            </div>
          </div>
        </div>
        <div class="px-1 ">
          当前游戏状态：
          <span class="font-black">{{ currentSummoner.gameStatus }}</span>
        </div>
      </t-card>
    </div>
    <div class="w-[314px] h-full ml-1">
      <t-card class="h-full"></t-card>
    </div>
  </div>


</template>
<script setup lang="ts">
import NoGameStart from '@/components/error/NoGameStart.vue';
import Home from '@/components/Home/Home.vue';
import ElectronStore from 'electron-store';
import { getProfileIcon } from '@/utils';
import { type Component, onMounted, ref, reactive } from 'vue';
import { translate } from '@/utils/translate';
import { getRankdTigerImg } from '@/assets/rank-tiger'
import { ipcRenderer } from 'electron';

// const currentTabComponent = ref<Component>(NoGameStart)

// const appStore: ElectronStore = window.appStore

// onMounted(() => {
//   const credentials = appStore.get('credentials')
//   console.log(credentials);
//   if (credentials) currentTabComponent.value = Home
// })

const lcuApi = window.lcuApi

const currentSummoner = reactive({
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
  }
})

onMounted(async () => {
  await currentSummonerInit()
})

ipcRenderer.on('playerStatus', (event, message)=> {
  // currentSummoner.gameStatus = message
  console.log(message);
  
})


const currentSummonerInit = async () => {
  const gameStatus = await lcuApi.getGameStatus()
  currentSummoner.gameStatus = translate('status', gameStatus);

  const summoner = await lcuApi.getCurrentSummoner()
  currentSummoner.displayName = summoner.displayName
  currentSummoner.summonerLevel = summoner.summonerLevel
  currentSummoner.avatar = getProfileIcon(summoner.profileIconId)

  const environment = await lcuApi.getEnvironment();
  currentSummoner.environment = translate('environment', environment.environment)

  const rankStatus = await lcuApi.getRankedStatusInfoByPuuid(summoner.puuid);
  currentSummoner.rank.rankedHighestTier = rankStatus.highestPreviousSeasonEndTier
  currentSummoner.rank.rankedHighest = `${translate('rank', rankStatus.highestPreviousSeasonEndTier)} ${rankStatus.highestPreviousSeasonEndDivision}`
  currentSummoner.rank.rankedSoloTier = rankStatus.queueMap.RANKED_SOLO_5x5.tier
  currentSummoner.rank.rankedSolo = `${translate('rank', rankStatus.queueMap.RANKED_SOLO_5x5.tier)} ${rankStatus.queueMap.RANKED_SOLO_5x5.division} ${rankStatus.queueMap.RANKED_SOLO_5x5.leaguePoints}`
  currentSummoner.rank.rankedFlexTier = rankStatus.queueMap.RANKED_FLEX_SR.tier
  currentSummoner.rank.rankedFlex = `${translate('rank', rankStatus.queueMap.RANKED_FLEX_SR.tier)} ${rankStatus.queueMap.RANKED_FLEX_SR.division} ${rankStatus.queueMap.RANKED_FLEX_SR.leaguePoints}`

}

</script>