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
              <img class="w-10" :src="getRankdTiger(summonerInfo.rankedSoloTier)" />
              <div class="">{{ summonerInfo.rankedSolo }}</div>
              <div class="text-gray-600">单双排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-10" :src="getRankdTiger(summonerInfo.rankedFlexTier)" />
              <div class="">{{ summonerInfo.rankedFlex }}</div>
              <div class="text-gray-600">灵活组排</div>
            </div>
            <div class="flex flex-col items-center ml-6">
              <img class="w-10" :src="getRankdTiger(summonerInfo.rankedHighestTier)" />
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
      <a-card class="mt-4" title="订阅" :hoverable="true" :header-style="{ border: 'none' }">
        <div class="flex items-center justify-between">
          <div>
            状态：
            <span :class="[userStore.wxOpenId ? 'text-green-500' : 'text-red-500']">{{ userStore.wxOpenId ? '已订阅' : '未订阅' }}</span>
          </div>
          <!-- TODO: 小程序做完 这边要给二维码 -->
          <a-link v-if="!userStore.wxOpenId" @click="">订阅微信小程序获取更多功能</a-link>
        </div>
      </a-card>
      <a-card class="mt-4" title="英雄时刻" :hoverable="true" :header-style="{ border: 'none' }">
        <template #extra>
          <a-link @click="handleRouter('hero-time')">更多</a-link>
        </template>
        <div v-if="heroTimeImgs.length == 0">
          <a-empty description='暂无英雄时刻截图，快开始对局吧' />
        </div>
        <div v-if="heroTimeImgs.length != 0">
          <a-carousel
            :autoPlay="true"
            :animation="false"
            animation-name="fade"
            indicator-type="line"
            indicator-position="bottom"
            :style="{
              width: '100%',
              height: '243px',
            }"
          >
            <a-carousel-item v-for="image in heroTimeImgs">
              <a-image :src="image" width="100%" />
            </a-carousel-item>
          </a-carousel>
        </div>
      </a-card>
    </div>
    <!-- 右侧显示最近战绩-->
    <div class="flex-1 p-2">
      <a-card class="h-full" title="近期战绩" :hoverable="true">
        <template #extra>
          <a-link @click="handleRouter('match-history')">更多</a-link>
        </template>
        <block class="flex justify-between w-[188px] py-1.4" v-for="(item, index) in historyList" :key="index">
          <div class="w-11">
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
import ipcRenderer from '@/utils/ipcRenderer';
import { translate } from '@/utils/translate';
import dayjs from 'dayjs';
import { useUserStore } from '@/stores/modules/user';
import { useRouter } from 'vue-router';
import rankTiger from '@/assets/img/ranked'

const userStore = useUserStore();
const router = useRouter();

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

const heroTimeImgs = ref([]);

// 持续监听玩家游戏状态变化,当状态满足条件时重新夹在数据
ipcRenderer.ipc.removeAllListeners('controller.lcu.listenPlayerStatus');
ipcRenderer.ipc.on('controller.lcu.listenPlayerStatus', async (_event, data) => {
  gameStatus.value = translate('status', data);
  // 当进入游戏时跳转到面板
  if (data === 'InProgress' || data === 'ChampSelect') {
    router.push({
      path: '/panel',
    });
  }
});

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

  await userStore.registerEnvironment();

  // 获取英雄时刻图集
  const heroImgsRes = await ipcRenderer.invoke('controller.common.getAllHeroScreenshot', '');
  heroTimeImgs.value = heroImgsRes.data;
});

const handleRouter = (name) => {
  router.push({ name });
};

const getRankdTiger = (tiger) => {
  return rankTiger[tiger]
}
</script>

<style scoped lang="less"></style>
