<template>
  <div class="w-full h-full">
    <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '10px' }">
      <a-row>
        <a-col :span="8">
          <a-form-item class="!mb-0" label="模式">
            <a-select v-model="mode" :style="{ width: '140px' }" @change="getChampionsData">
              <a-option :value="0">排位</a-option>
              <a-option :value="1">极地乱斗</a-option>
              <a-option disabled>无限火力</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item class="!mb-0" label="选择英雄时弹出符文窗口">
            <a-switch v-model="configStore.showChampTool" @change="configStore.save" type="line" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-button-group type="primary" v-if="mode == 0">
            <a-button @click="changePosition('top')">上单</a-button>
            <a-button @click="changePosition('jungle')">打野</a-button>
            <a-button @click="changePosition('mid')">中单</a-button>
            <a-button @click="changePosition('adc')">下路</a-button>
            <a-button @click="changePosition('support')">辅助</a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }">
      <a-table :data="championsData" height="544" style="width: 100%" :scroll="tableScroll" :pagination="false"
        :loading="isLoading" @row-click="handleDetail">
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
                <img class="w-[42px] h-[42px]"
                  :src="record.image_url + '?image=c_crop,h_103,w_103,x_9,y_9/q_auto,f_webp,w_264&v=1651762875503'"
                  alt="" />
                <div class="text-base ml-2 font-bold flex flex-col justify-center">
                  <span>{{ record.name }}</span>
                  <span class="font-normal mr-1 " v-if="mode == 0">
                    <span class="pr-1" v-for="(item, index) in record.positions" :key="index">{{
                        utils.translate('opggPosition', item.name)
                    }}</span>
                  </span>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="层级" v-if="mode == 0" :width="100">
            <template #cell="{ record }">
              <div class="flex items-center">
                <img :src="getPositionTigerImg(record.positionTierData.tier)" />
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
          <a-table-column v-if="mode == 0" title="禁用率" :width="120">
            <template #cell="{ record }">
              <div>
                <span>{{ (record.positionBanRate * 100).toFixed(2) }}%</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column v-if="mode == 1" title="KDA" :width="120">
            <template #cell="{ record }">
              <div>
                <span>{{ (record.kda * 100 / 100).toFixed(2) }}</span>
              </div>
            </template>
          </a-table-column>
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
import { getOpggChampionsAram, getOpggChampionsByPosition } from '../../api/common'
import { useConfigStore } from '../../store/config';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import positionTigerSvg from '../../assets/champ-tiger'

const configStore = useConfigStore();
const router = useRouter();
const utils = $utils

const mode = ref(0)
const position = ref('top');
const championsData = ref([]);
const isLoading = ref(false);


const tableScroll = ref({
  x: '100%',
  y: '610px',
});

onMounted(async () => {
  await getChampionsData();
});

async function getChampionsData() {
  let championsResp: any
  isLoading.value = true;
  if (mode.value == 0) {
    championsResp = await getOpggChampionsByPosition(position.value)
    championsData.value = championsResp.data.championRankingList.sort(function (a: any, b: any) {
      return a.positionTierData.rank - b.positionTierData.rank;
    });
  } else if (mode.value == 1) {
    championsResp = await getOpggChampionsAram()
    championsData.value = championsResp.data.championRankingList.sort(function (a: any, b: any) {
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
    name: 'champ-datail',
    query: {
      championName: row.key,
      position: position.value,
      mode: mode.value
    },
  });
}

function getPositionTigerImg(tiger: any) {
  return positionTigerSvg[tiger]
}
</script>
