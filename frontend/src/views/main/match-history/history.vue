<template>
  <div class="flex p-2">
    <a-card class="w-[26%]" :hoverable="true" :header-style="{ border: 'none' }">
      <!-- 搜索框 -->
      <a-input-search v-model="summonerName" placeholder="请输入游戏名" size="small" button-text="查找" search-button @click="getHistory" />
      <!-- 历史列表 -->
      <div class="mt-4 border-t">
        <block
          class="flex cursor-pointer justify-around py-2 border-b hover:bg-light-400"
          :class="[inShowGameId == item.gameId ? 'bg-gradient-to-r from-green-100 ...' : '']"
          v-for="(item, index) in historyList"
          :key="index"
          @click="getHistoryDetail(item.gameId)"
        >
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
      </div>
      <a-pagination class="absolute bottom-2" :total="pagination.total" :current="pagination.page" :page-size="pagination.size" simple @change="changePage" />
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
          <span class="mt-1 text-gray-900">{{ (matchesDetail.goldOfTeam1 / 1000).toFixed(1) }}k / {{ (matchesDetail.goldOfTeam2 / 1000).toFixed(1) }}k</span>
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
          :class="[index == 4 ? 'border-gray-400' : '', item.summonerName == summonerName ? '!bg-blue-50' : '']"
          v-for="(item, index) in matchesDetail.players"
          align="center"
          :key="index"
          @click="changeSummoner(item.summonerName)"
        >
          <a-col :span="2">
            <img class="w-[36px]" :src="item.championAvatar" />
          </a-col>
          <a-col :span="6">
            <span>{{ item.summonerName }}</span>
            <icon-copy class="ml-1 !text-gray-500"/>
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
                <img class="w-[30px]" v-if="itemId != 0" :src="getItemUrl(itemId)" alt="" />
              </block>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script lan="ts" setup>
import dayjs from 'dayjs';
import ipcRenderer from '@/utils/ipcRenderer';
import { copyToClipboard } from '@/utils/tools'
import { useUserStore } from '@/stores/modules/user';
import { onBeforeMount, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
let route = useRoute();
// 页码
const pagination = reactive({
  total: 999,
  page: 1,
  size: 8,
});
// 被查询玩家
const summonerName = ref('');
// 历史对局列表
const historyList = ref([]);
// 对局详情
const matchesDetail = ref({});
// 当前显示的对局详情gameId
const inShowGameId = ref('');

let lcuVersion = '';

onBeforeMount(async () => {
  // 判断是面板过来的还是直接进来的
  if (route.query.summonerName) {
    summonerName.value = route.query.summonerName;
  } else {
    // 获取客户端玩家信息
    summonerName.value = userStore.summonerName;
  }
  await getHistory();

  // 获取当前lcu版本
  lcuVersion = await ipcRenderer.invoke('controller.lcu.getLcuVersion', '');
});

/**
 * 获取历史对局
 */
const getHistory = async () => {
  const recordData = await ipcRenderer.invoke('controller.lcu.getHistoryMatches', {
    page: pagination.page,
    size: pagination.size,
    summonerName: summonerName.value,
  });

  historyList.value = recordData.items;
  // 获取最近一场的详情并展示
  getHistoryDetail(historyList.value[0].gameId);
};

/**
 * 获取对局详情
 * @param {string} gameId 对局id
 */
const getHistoryDetail = async (gameId) => {
  if (gameId == inShowGameId.value) return;
  inShowGameId.value = gameId;
  matchesDetail.value = await ipcRenderer.invoke('controller.lcu.getMatchesDetail', { gameId });
};

/**
 * 页面切换
 * @param {*} pageNum
 */
const changePage = async (pageNum) => {
  pagination.page = pageNum;
  await getHistory();
};

/**
 * 点击查询玩家 并赋值玩家名
 * @param {string} name 玩家名称
 */
const changeSummoner = async (name) => {
  summonerName.value = name;
  await getHistory();
  // copy
  copyToClipboard(name);
};

/**
 * 获取装备图标地址  无装备id为0，直接显示背景
 * @param {number} id 图标id
 */
const getItemUrl = (id) => {
  return `https://ddragon.leagueoflegends.com/cdn/${lcuVersion}/img/item/${id}.png`;
};
</script>

<style></style>
