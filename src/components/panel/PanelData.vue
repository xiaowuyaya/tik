<template>
  <div class="h-full w-full"  v-if="playerList.orderList">
    <a-space class="h-full w-full" size="mini" v-show="!showDetailData" direction="vertical">
      <!-- 友军信息 -->
      <div class="flex justify-between !h-full">
        <block class="text-gray-900 w-full px-1" v-for="(item, index) in playerList.orderList" :key="index">
          <a-card class="!h-full" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '8px' }">
            <div class="flex flex-col items-center justify-center w-full h-full">
              <a-avatar class="rounded cursor-pointer" :size="42" shape="square"
                @click="handleAddBlacklist(item.summonerName, item.summonerId)">
                <img :src="item.profileIcon" />
              </a-avatar>
              <div class="my-1 font-bold text-black cursor-pointer" @click="handlePlayerHistory(item.summonerName)">{{
                  item.summonerName
              }}<icon-search class="ml-1"/></div>
              <div class="my-1 flex items-center justify-between text-[0.85rem] w-full">
                <div class="text-gray-800 text-green">单双:{{ item.rank.rankedSolo }}</div>
                <div class="text-gray-800">灵活:{{ item.rank.rankedFlex }}</div>
              </div>
              <div class="my-2 flex items-center justify-between w-full">
                <div class="flex flex-col justify-between text-[0.8rem] text-yellow-600">
                  <div class="font-bold">{{ item.type }}</div>
                  <div class="mt-1">KDA:{{ item.matches.kda }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <block v-for="(imgItem, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[28px] ml-1" :src="utils.getChampionAvatarById(imgItem.championId)" alt="" />
                  </block>
                </div>
              </div>
              <c-scrollbar width="100%" height="172px" trigger="hover">
                <block v-for="(matcheItem, index) in item.matches.data" :key="index">
                  <div class="flex mb-1 items-center justify-between w-full text-[12.5px]">
                    <div class="flex items-center justify-start">
                      <img class="w-[24px]" :src="utils.getChampionAvatarById(matcheItem.championId)" alt="" />
                      <div class="ml-1">{{ utils.translate('queue', matcheItem.queueId).slice(0,2)  }}</div>
                    </div>
                    <div :class="[matcheItem.win ? 'text-green-500' : 'text-red-500']">
                      {{ matcheItem.kills }}/{{ matcheItem.deaths }}/{{ matcheItem.assists }}
                    </div>
                    <div class="">{{ dayjs(matcheItem.gameCreationDate).format('MM-DD') }}</div>
                  </div>
                </block>
              </c-scrollbar>
            </div>
          </a-card>
        </block>
      </div>
      <!-- <div class="border"></div> -->
      <div class="flex justify-between !h-full">
        <block class="text-gray-900 w-full px-1" v-for="(item, index) in playerList.chaosList" :key="index">
          <a-card class="!h-full" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '8px' }">
            <div class="flex flex-col items-center justify-center w-full h-full">
              <a-avatar class="rounded cursor-pointer" :size="42" shape="square"
                @click="handleAddBlacklist(item.summonerName, item.summonerId)">
                <img :src="item.profileIcon" />
              </a-avatar>
              <div class="my-1 font-bold text-black cursor-pointer" @click="handlePlayerHistory(item.summonerName)">{{
                  item.summonerName
              }}<icon-search class="ml-1"/></div>
              <div class="my-1 flex items-center justify-between text-[0.85rem] w-full">
                <div class="text-gray-800">单双:{{ item.rank.rankedSolo }}</div>
                <div class="text-gray-800">灵活:{{ item.rank.rankedFlex }}</div>
              </div>
              <div class="my-2 flex items-center justify-between w-full">
                <div class="flex flex-col justify-between text-[0.8rem] text-yellow-600">
                  <div class="font-bold">{{ item.type }}</div>
                  <div class="mt-1">KDA:{{ item.matches.kda }}</div>
                </div>
                <div class="flex items-center justify-between">
                  <block v-for="(imgItem, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[28px] ml-1" :src="utils.getChampionAvatarById(imgItem.championId)" alt="" />
                  </block>
                </div>
              </div>
              <c-scrollbar width="100%" height="172px" trigger="hover">
                <block v-for="(matcheItem, index) in item.matches.data" :key="index">
                  <div class="flex mb-1 items-center justify-between w-full text-[12.5px]">
                    <div class="flex items-center justify-start">
                      <img class="w-[24px]" :src="utils.getChampionAvatarById(matcheItem.championId)" alt="" />
                      <div class="ml-1">{{ utils.translate('queue', matcheItem.queueId).slice(0,2)  }}</div>
                    </div>
                    <div :class="[matcheItem.win ? 'text-green-500' : 'text-red-500']">
                      {{ matcheItem.kills }}/{{ matcheItem.deaths }}/{{ matcheItem.assists }}
                    </div>
                    <div class="">{{ dayjs(matcheItem.gameCreationDate).format('MM-DD') }}</div>
                  </div>
                </block>
              </c-scrollbar>
            </div>
          </a-card>
        </block>
      </div>
    </a-space>

    <a-button v-show="playerList.orderList.length != 5 || playerList.chaosList.length != 5"
      class="!absolute bottom-8 right-6" type="primary" status="success" size="large" :loading="btnLoading"
      @click="getPanelData">
      <template #icon>
        <icon-loop />
      </template>
      重新获取
    </a-button>

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
import { ipcRenderer } from 'electron';
import { onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';



const router = useRouter()
const btnLoading = ref(false);
// 面板数据
const playerList = ref<any>({
  orderList: [],
  chaosList: [],
});
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

const utils = window.utils
const lcuApi = window.handle.lcuApi
const hadnle = window.handle
const panelDataStore = window.panelDataStore

onMounted(async () => {
  await getPanelData();

});

ipcRenderer.on('playerStatus', async (event, data) => {

  gameStatus.value = data;
  await getPlayerList(gameStatus.value);
})

const getPanelData = async () => {
  btnLoading.value = true;
  // 获取当前玩家游戏状态
  gameStatus.value = await lcuApi.getGameStatus()
  getPlayerList(gameStatus.value);
  // 如果没有加载到数据，从缓存中获取
  if (!playerList.value.orderList.lenth || playerList.value.orderList.lenth == 0) {
    const panelData = panelDataStore.get('panelData')
    playerList.value = panelData;
    console.log(panelData);
  }
  btnLoading.value = false;
};


// 获取面板数据
const getPlayerList = async (status: string) => {
  if (status == 'InProgress' || status == 'ChampSelect') {
    playerList.value = await hadnle.getPanelData(status)
  }
};

const handlePlayerHistory = (summonerName: string) => {
  router.push({ path: '/search-content', query: { summonerName: summonerName } })
};

const handleAddBlacklist = (summonerName: string, summonerId: string) => {

};

const submitBlacklist = async () => { }

</script>