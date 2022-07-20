<template>
  <div class="p-2" v-if="playerList.orderList">
    <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }">
      <a-form-item class="!mb-0" label="显示近期详细战绩">
        <a-switch v-model="showDetailData" type="line" />
      </a-form-item>
    </a-card>
    <a-space v-show="!showDetailData" direction="vertical" fill>
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <!-- 友军信息 -->
        <a-space direction="vertical" fill>
          <block class="text-gray-900" v-for="(item, index) in playerList.orderList" :key="index">
            <a-row align="center" justify-content="space-between">
              <!-- 头像 -->
              <a-col :span="2">
                <a-avatar class="rounded" :size="41" shape="square" @click="handleAddBlacklist(item.summonerName, item.summonerId)">
                  <img :src="item.championAvatar" />
                </a-avatar>
              </a-col>
              <a-col :span="2">
                <span class="font-black text-[15px]">{{ item.type || '未知' }}</span>
              </a-col>
              <a-col :span="2">
                <span class="text-[14px] text-center">{{ item.rankInfo.rankedSolo || '未知' }}</span>
              </a-col>
              <!-- 信息相关 -->
              <a-col :span="4" @click="handlePlayerHistory(item.summonerName)">
                <span class="text-[14px]">{{ item.summonerName }}</span>
                <icon-search class="ml-1 !text-gray-500" />
              </a-col>
              <a-col :span="3">
                <div class="flex flex-col items-center justify-center font-[13px]">
                  <span>KDA: {{ item.matches.kda || '未知' }}</span>
                  <span>胜率: {{ item.matches.winRate || '未知' }}</span>
                </div>
              </a-col>
              <!-- 最近英雄 -->
              <a-col :span="3">
                <div class="flex justify-center items-center">
                  <block v-for="(recent, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[34px] mx-[2px] justify-center" :src="recent.avatarUrl" alt="" />
                  </block>
                </div>
              </a-col>
              <!-- 最近战况 -->
              <a-col :span="8">
                <div class="flex text-[13px] font-extrabold justify-between flex-wrap">
                  <span class="text-center w-[20%]" :class="[itm.win ? 'text-green-500' : 'text-red-500']" v-for="(itm, idx) in item.matches.data" :key="idx">
                    {{ itm.kills }}/{{ itm.deaths }}/{{ itm.assists }}
                  </span>
                </div>
              </a-col>
            </a-row>
          </block>
        </a-space>
      </a-card>
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <!-- 友军信息 -->
        <a-space direction="vertical" fill>
          <block class="text-gray-900" v-for="(item, index) in playerList.chaosList" :key="index">
            <a-row align="center" justify-content="space-between">
              <!-- 头像 -->
              <a-col :span="2">
                <a-avatar class="rounded" :size="41" shape="square" @click="handleAddBlacklist(item.summonerName, item.summonerId)">
                  <img :src="item.championAvatar" />
                </a-avatar>
              </a-col>
              <a-col :span="2">
                <span class="font-black text-[15px]">{{ item.type || '未知' }}</span>
              </a-col>
              <a-col :span="2">
                <span class="text-[14px] text-center">{{ item.rankInfo.rankedSolo || '未知' }}</span>
              </a-col>
              <!-- 信息相关 -->
              <a-col :span="4" @click="handlePlayerHistory(item.summonerName)">
                <span class="text-[14px]">{{ item.summonerName }}</span>
                <icon-search class="ml-1 !text-gray-500" />
              </a-col>
              <a-col :span="3">
                <div class="flex flex-col items-center justify-center font-[13px]">
                  <span>KDA: {{ item.matches.kda || '未知' }}</span>
                  <span>胜率: {{ item.matches.winRate || '未知' }}</span>
                </div>
              </a-col>
              <!-- 最近英雄 -->
              <a-col :span="3">
                <div class="flex justify-center items-center">
                  <block v-for="(recent, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[34px] mx-[2px] justify-center" :src="recent.avatarUrl" alt="" />
                  </block>
                </div>
              </a-col>
              <!-- 最近战况 -->
              <a-col :span="8">
                <div class="flex text-[13px] font-extrabold justify-between flex-wrap">
                  <span class="text-center w-[20%]" :class="[itm.win ? 'text-green-500' : 'text-red-500']" v-for="(itm, idx) in item.matches.data" :key="idx">
                    {{ itm.kills }}/{{ itm.deaths }}/{{ itm.assists }}
                  </span>
                </div>
              </a-col>
            </a-row>
          </block>
        </a-space>
      </a-card>
    </a-space>
    <!-- 详细对局 -->

    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <a-space direction="vertical" fill>
        <block class="text-gray-900" v-for="(item, index) in playerList.orderList" :key="index">
          <a-row align="center" justify-content="space-between">
            <a-col :span="4">
              <div class="flex flex-col items-center justify-center">
                <a-avatar class="rounded" :size="36" shape="square" @click="handleAddBlacklist(item.summonerName, item.summonerId)">
                  <img :src="item.championAvatar" />
                </a-avatar>
                <span class="font-black">{{ item.summonerName }}</span>
              </div>
            </a-col>
            <a-col :span="20">
              <div>
                <div class=""></div>
              </div>
            </a-col>
          </a-row>
        </block>
      </a-space>
    </a-card>

    <!-- 拉黑对话框 -->
    <a-modal v-model:visible="blacklistModalState.show" :title="blacklistModalState.title" @ok="submitBlacklist">
      <a-form :model="blacklistModalState.form">
        <a-form-item class="!mb-0" field="name" label="拉黑原因">
          <a-textarea v-model="blacklistModalState.form.reason" placeholder="请输入拉黑原因，可空" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { useBlacklistStore } from '@/stores/modules/blacklist';
import { useUserStore } from '@/stores/modules/user';
import ipcRenderer from '@/utils/ipcRenderer';
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const blacklistStore = useBlacklistStore();
const router = useRouter();

// 面板数据
const playerList = ref();
// 玩家状态
const gameStatus = ref('');
// 显示详细数据
const showDetailData = ref(false);
// 拉黑对话框状态
const blacklistModalState = reactive({
  show: false,
  title: '',
  form: {
    banId: '',
    banName: '',
    reason: '',
  },
});

onBeforeMount(async () => {
  // 获取当前玩家游戏状态
  gameStatus.value = await ipcRenderer.invoke('controller.lcu.getPlayerStatus', { origin: true });
  getPlayerList(gameStatus.value);

  // 如果没有加载到数据，从缓存中获取
  if (!playerList.value) {
    const panelData = await ipcRenderer.invoke('controller.data.getCacheData', { key: 'panel-data' });

    playerList.value = panelData.data;
  }
});

// 持续监听玩家游戏状态变化,当状态满足条件时重新夹在数据
ipcRenderer.ipc.removeAllListeners('controller.lcu.listenPlayerStatus');
ipcRenderer.ipc.on('controller.lcu.listenPlayerStatus', async (_event, data) => {
  gameStatus.value = data;
  await getPlayerList(gameStatus.value);
});

// 获取面板数据
const getPlayerList = async (status) => {
  if (status == 'InProgress' || status == 'ChampSelect') {
    playerList.value = await ipcRenderer.invoke('controller.lcu.getPanelData', { status });
    console.log(playerList.value);
  }
};

// 跳转战绩查询
const handlePlayerHistory = (summonerName: string) => {
  router.push({
    //传递参数使用query的话，指定path或者name都行，但使用params的话，只能使用name指定
    path: '/match-history',
    query: {
      summonerName,
    },
  });
};

const handleAddBlacklist = (summonerName: string, summonerId: string) => {
  blacklistModalState.title = `将${summonerName}拉入黑名单`;
  blacklistModalState.form.banName = summonerName;
  blacklistModalState.form.banId = summonerId;
  blacklistModalState.show = true;
};

const submitBlacklist = async () => {
  const data = {
    environment: userStore.environment,
    summonerId: userStore.summonerId,
    summonerName: userStore.summonerName,
    banId: blacklistModalState.form.banId,
    banName: blacklistModalState.form.banName,
    reason: blacklistModalState.form.reason,
  };
  blacklistStore.add(data);
};
</script>
