<template>
  <div class="w-full p-2">
    <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '10px' }">
      <div class="flex items-center justify-between">
        <a-form-item class="!mb-0" label="选择英雄时弹出数据窗口">
          <a-switch v-model="settingsStore.app.showChampTool" @change="settingsStore.syncLocal" type="line" />
        </a-form-item>
        <a-button-group type="primary">
          <a-button @click="changePosition('top')">上单</a-button>
          <a-button @click="changePosition('jungle')">打野</a-button>
          <a-button @click="changePosition('mid')">中单</a-button>
          <a-button @click="changePosition('adc')">下路</a-button>
          <a-button @click="changePosition('support')">辅助</a-button>
        </a-button-group>
      </div>
    </a-card>
    <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }">
      <a-table :data="championsData" height="520" style="width: 100%" :scroll="tableScroll" :pagination="false" :loading="isLoading" @row-click="handleDetail">
        <template #columns>
          <a-table-column title="#" :width="60">
            <template #cell="{ record }">
              <div>
                <span>{{ record.positionTierData.rank }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="英雄">
            <template #cell="{ record }">
              <div class="flex">
                <img class="w-[42px] h-[42px]" :src="record.image_url + '?image=c_crop,h_103,w_103,x_9,y_9/q_auto,f_webp,w_264&v=1651762875503'" alt="" />
                <div class="text-sm ml-2 font-bold flex flex-col justify-center">
                  <span>{{ record.name }}</span>
                  <span class="font-normal mr-1 text-xs">
                    <span class="position" v-for="(item, index) in record.positions" :key="index">{{ item.name }}</span>
                  </span>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="层级" :width="100">
            <template #cell="{ record }">
              <div class="flex items-center">
                <img :src="`/src/assets/img/champions-stat/tiger/${record.positionTierData.tier}.svg`" />
              </div>
            </template>
          </a-table-column>
          <a-table-column title="胜率" :width="120">
            <template #cell="{ record }">
              <div>
                <span>{{ (record.positionWinRate * 100).toFixed(2) }}%</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="登场率" :width="120">
            <template #cell="{ record }">
              <div>
                <span>{{ (record.positionPickRate * 100).toFixed(2) }}%</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="禁用率" :width="120">
            <template #cell="{ record }">
              <div>
                <span>{{ (record.positionBanRate * 100).toFixed(2) }}%</span>
              </div>
            </template>
          </a-table-column>
          <!-- <el-table-column title="弱势对抗" width="180">
          <template #default="record">
            <div >
              <el-icon><timer /></el-icon>
              <span >{{ record.row.somedata }}</span>
            </div>
          </template>
        </el-table-column> -->
        </template>
        <template #footer>
          <div class="flex w-full justify-center items-center text-gray-400 text-xs">
            <span>数据来源: https://www.op.gg</span>
            <span class="ml-3">该页面仅供展示</span>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/modules/settings';
import ipcRenderer from '@/utils/ipcRenderer';
import { useMessage } from '@/utils/message-notice';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const settingsStore = useSettingsStore();
const router = useRouter();

const position = ref('top');
const championsData = ref([]);
const isLoading = ref(false);

const tableScroll = ref({
  x: '100%',
  y: '528px',
});

onMounted(async () => {
  await getChampionsData();
  console.log(championsData.value);
});

async function getChampionsData() {
  isLoading.value = true;
  const championsResp = await ipcRenderer.invoke('controller.opgg.getChampionsByPosition', { position: position.value });
  if (championsResp.code == 200) {
    useMessage(championsResp, '获取英雄数据成功');
    championsData.value = championsResp.data.championRankingList.sort(function (a, b) {
      return a.positionTierData.rank - b.positionTierData.rank;
    });
  }
  isLoading.value = false;
}

async function changePosition(choosePosition: string) {
  position.value = choosePosition;
  await getChampionsData();
}

function handleDetail(row: any) {
  router.push({
    name: 'hero-data-detail',
    query: {
      championName: row.key,
      position: position.value,
    },
  });
}
</script>
