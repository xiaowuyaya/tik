<template>
  <div class="flex p-2">
    <!-- 左侧显示原界面信息 -->
    <div class="w-[74%] p-2 flex flex-col">
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <div class="flex justify-between p-1 bg-white">
          <!-- 常规信息 -->
          <div class="flex items-center">
            <a-badge :text="`Lv.${summonerInfo.summonerLevel}`">
              <a-avatar :size="86" shape="square">
                <img :src="summonerInfo.avatarBase64" />
              </a-avatar>
            </a-badge>
            <div class="ml-4">
              <div class="text-xl font-extrabold text-gray-900">
                {{ summonerInfo.displayName }}
              </div>
              <div class="text-sm text-gray-700">
                {{ summonerInfo.environment }}
              </div>
            </div>
          </div>
          <!-- 段位信息 -->
          <div class="flex">
            <div class="flex flex-col items-center">
              <img class="w-10" :src="getTigerImg(summonerInfo.rankedSoloTier)" />
              <div class="">{{ summonerInfo.rankedSolo }}</div>
              <div class="text-gray-600">单双排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-10" :src="getTigerImg(summonerInfo.rankedFlexTier)" />
              <div class="">{{ summonerInfo.rankedFlex }}</div>
              <div class="text-gray-600">灵活组排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-10" :src="getTigerImg(summonerInfo.rankedHighestTier)" />
              <div class="">{{ summonerInfo.rankedHighest }}</div>
              <div class="text-gray-600">历史最高</div>
            </div>
          </div>
        </div>
        <div class="px-1 mt-2">
          当前游戏状态：
          <span class="font-black">{{ gameStatus }}</span>
        </div>
      </a-card>
      <a-card class="mt-4" title="荣誉截图" :hoverable="true" :header-style="{ border: 'none' }">
        <template #extra>
          <a-link>更多</a-link>
        </template>
        <div>敬请期待</div>
      </a-card>
      <a-card class="mt-4" title="英雄时刻" :hoverable="true" :header-style="{ border: 'none' }">
        <template #extra>
          <a-link>更多</a-link>
        </template>
        <div>敬请期待</div>
      </a-card>
      <a-card class="mt-4" title="官方公告" :hoverable="true" :header-style="{ border: 'none' }">
        <div>TODO</div>
      </a-card>
    </div>
    <!-- 右侧显示最近战绩-->
    <div class="flex-1 p-2">
      <a-card class="h-full" title="近期战绩" :hoverable="true">
        <template #extra>
          <a-link>更多</a-link>
        </template>
        <block class="flex justify-between w-[188px] py-1.2" v-for="(item, index) in historyList" :key="index">
          <div class="w-12">
            <img :src="item.avatarUrl" />
          </div>
          <div class="w-[78px] flex flex-col px-[1px] items-start justify-center">
            <div :class="['text-[14px] font-extrabold', item.participants[0].stats.win ? 'text-green-500' : 'text-red-500']">
              {{ item.participants[0].stats.win ? '胜利' : '失败' }}
            </div>
            <div class="text-sm mt-1">
              {{ item.queueId }}
            </div>
          </div>
          <div class="flex items-center justify-center text-[14px] font-bold">
            {{ dayjs(item.gameCreationDate).format('MM-DD') }}
          </div>
        </block>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import ipcRenderer from '../../utils/ipcRenderer';
import dayjs from 'dayjs';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();

interface SummonerInfo {
  avatarBase64: string;
  displayName: string;
  environment: string;
  puuid: string;
  rankedFlex: string;
  rankedFlexTier: string;
  rankedHighest: string;
  rankedSolo: string;
  summonerId: string;
  rankedSoloTier: string;
  summonerLevel: string;
  rankedHighestTier: string;
}

// 用户信息
const summonerInfo = ref<SummonerInfo>({
  avatarBase64: '',
  displayName: '',
  environment: '',
  puuid: '',
  summonerId: '',
  rankedFlex: '',
  rankedHighest: '',
  rankedSolo: '',
  summonerLevel: '',
  rankedSoloTier: '',
  rankedFlexTier: '',
  rankedHighestTier: '',
});
// 游戏状态
const gameStatus = ref('');
// 历史对局列表
const historyList = ref<any>([]);

onBeforeMount(async () => {
  // 获取客户端玩家信息
  summonerInfo.value = await ipcRenderer.invoke('controller.lcu.getPlayerInfo', '');
  // 获取当前玩家游戏状态
  gameStatus.value = await ipcRenderer.invoke('controller.lcu.getPlayerStatus', '');
  // 获取当前玩家的历史对局
  const recordData = await ipcRenderer.invoke('controller.lcu.getHistoryMatches', {
    page: 1,
    size: 9,
    summonerName: summonerInfo.value.displayName,
  });
  historyList.value = recordData.items;

  userStore.environment = summonerInfo.value.environment;
  userStore.summonerId = summonerInfo.value.summonerId;
  userStore.summonerId = summonerInfo.value.summonerId;
  userStore.summonerName = summonerInfo.value.displayName;

  await userStore.registerEnvironment()
});



const getTigerImg = (tiger) => {
  return new URL(`../../assets/img/ranked/${tiger}.png`, import.meta.url).href;
};
</script>

<style scoped lang="less">
.match-list-row:hover {
  background-color: var(--background-hover-color);
}

.match-row-activate {
  // background-color: red;
  border-left: 2px solid var(--primary-text-color);
  background-image: var(--record-row-record-active);
}

.match-list-row {
  padding: 6px 8px 6px 8px;
  height: 48px;
  display: flex;
  border-top: var(--border);
  // margin-bottom: 0;
  flex-direction: row;

  .match-row-avatar {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .matches-row-text {
    width: 72px;
    display: flex;
    font-size: 14px;
    font-weight: 700;
    padding: 0 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .row-lose {
      color: var(--record-lose-color);
    }

    .row-win {
      color: var(--record-win-color);
    }

    .game-mode {
      font-weight: 500;
      color: var(--normal-text-color);
      font-size: 13px;
    }
  }
  .game-time {
    color: var(--settings-text-color);
    width: 40px;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
