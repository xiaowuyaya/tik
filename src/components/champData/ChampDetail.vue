<template>
  <div class="w-full p-2" v-if="champion.data">
    <c-scrollbar width="100%" height="610px" trigger="hover">
      <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }">
        <!-- header -->
        <div class="flex justify-between">
          <div class="flex">
            <a-popover position="bottom" content="双击可在导入天赋窗口打开">
              <img class="h-[82px] w-[82px]" @click="showChampionToolWindow"
                :src="champion.data.summary.meta.image_url + '?image=c_crop,h_103,w_103,x_9,y_9/q_auto,f_webp,w_264&v=1651762875503'" />
            </a-popover>
            <div class="ml-4 flex flex-col justify-end">
              <div class="flex mb-2.5">
                <span class="text-[24px] font-bold text-gray-900">{{ champion.data.summary.meta.name }}</span>
                <img class="pl-1" :src="getPositionTigerImg(champion.data.summary.summary.average_stats.tier)" />
              </div>
              <div class="flex">
                <img class="border-black mr-2 h-[30px] w-[30px]" :src="champion.data.summary.meta.passive.image_url"
                  alt="" />
                <img class="border-black mr-2 h-[30px] w-[30px]" :src="champion.data.summary.meta.spells[0].image_url"
                  alt="" />
                <img class="border-black mr-2 h-[30px] w-[30px]" :src="champion.data.summary.meta.spells[1].image_url"
                  alt="" />
                <img class="border-black mr-2 h-[30px] w-[30px]" :src="champion.data.summary.meta.spells[2].image_url"
                  alt="" />
                <img class="border-black mr-2 h-[30px] w-[30px]" :src="champion.data.summary.meta.spells[3].image_url"
                  alt="" />
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex items-center">
              <span class="text-base">劣势对抗</span>
              <div class="" v-for="(canter, index) in champion.data.summary.opponents[0]" :key="index">
                <img class="ml-2 rounded w-[32px] h-[32px]" :src="canter.meta.image_url" />
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-base">优势对抗</span>
              <div class="" v-for="(canter, index) in champion.data.summary.opponents[1]" :key="index">
                <img class="ml-2 rounded w-[32px] h-[32px]" :src="canter.meta.image_url" />
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 召唤师技能 -->
      <a-card>
        <template #title>
          <a-row>
            <a-col :span="16">召唤师技能</a-col>
            <a-col :span="4">登场率</a-col>
            <a-col :span="4">胜率</a-col>
          </a-row>
        </template>
        <a-row align="center">
          <a-col :span="16">
            <div class="flex">
              <img class="w-[42px] h-[42px] ml-2 border-gray-900 border-black"
                v-for="(item, index) in champion.data.summoner_spells[0].ids" :key="index"
                :src="findDetailObj('spells', item).image_url" />
            </div>
          </a-col>
          <a-col :span="4">
            <div class="flex flex-col justify-start">
              <span class="mb-1">{{ (champion.data.summoner_spells[0].pick_rate * 100).toFixed(2) }}%</span>
              <span>{{ champion.data.summoner_spells[0].play }}</span>
            </div>
          </a-col>
          <a-col :span="4">{{ champion.data.summoner_spells[0].play }}</a-col>
        </a-row>
        <a-divider class="!my-3" />
        <a-row align="center">
          <a-col :span="16">
            <div class="flex">
              <img class="w-[42px] h-[42px] ml-2 border-gray-900 border-black"
                v-for="(item, index) in champion.data.summoner_spells[1].ids" :key="index"
                :src="findDetailObj('spells', item).image_url" />
            </div>
          </a-col>
          <a-col :span="4">
            <div class="flex flex-col justify-start">
              <span class="mb-1">{{ (champion.data.summoner_spells[1].pick_rate * 100).toFixed(2) }}%</span>
              <span>{{ champion.data.summoner_spells[1].play }}</span>
            </div>
          </a-col>
          <a-col :span="4">{{ champion.data.summoner_spells[1].play }}</a-col>
        </a-row>
      </a-card>
      <!-- 技能加点 -->
      <a-card class="mt-2">
        <template #title>
          <a-row>
            <a-col :span="16">技能加点</a-col>
            <a-col :span="4">登场率</a-col>
            <a-col :span="4">胜率</a-col>
          </a-row>
        </template>
        <a-row align="center">
          <a-col :span="16">
            <table>
              <tbody>
                <tr class="border-t">
                  <th
                    class="bg-gray-100 border text-sm w-[29px] h-[23px] overflow-hidden align-middle text-center p-2 py-1"
                    v-for="level in levelList" :key="level">
                    {{ level }}
                  </th>
                </tr>
                <tr class="border-t">
                  <td
                    class="bg-white-50 border text-sm w-[29px] h-[23px] overflow-hidden align-middle text-center px-2 py-1 font-black"
                    v-for="(item, index) in champion.data.skills[0].order" :key="index">
                    {{ item }}
                  </td>
                </tr>
              </tbody>
            </table>
          </a-col>
          <a-col :span="4">
            <div class="flex flex-col justify-start">
              <span class="mb-1">{{ (champion.data.skills[0].pick_rate * 100).toFixed(2) }}%</span>
              <span class="pick-num">{{ champion.data.skills[0].play }}</span>
            </div>
          </a-col>
          <a-col :span="4">{{ ((champion.data.skills[0].win / champion.data.skills[0].play) * 100).toFixed(2) }}%
          </a-col>
        </a-row>
      </a-card>
      <!-- 出门装 -->
      <a-card class="mt-2">
        <template #title>
          <a-row>
            <a-col :span="16">出门装</a-col>
            <a-col :span="4">登场率</a-col>
            <a-col :span="4">胜率</a-col>
          </a-row>
        </template>
        <div v-for="(core_item, index) in champion.data.starter_items.slice(0, 3)" :key="index">
          <a-row align="center">
            <a-col :span="16">
              <div class="flex">
                <img class="w-[42px] h-[42px] ml-2 border-gray-900 border-black"
                  v-for="(core_item_item, item_index) in core_item.ids" :key="item_index"
                  :src="findDetailObj('items', core_item_item).image_url" />
              </div>
            </a-col>
            <a-col :span="4">
              <div class="flex flex-col justify-start">
                <span class="mb-1">{{ (core_item.pick_rate * 100).toFixed(2) }}%</span>
                <span>{{ core_item.play }}</span>
              </div>
            </a-col>
            <a-col :span="4">{{ ((core_item.win / core_item.play) * 100).toFixed(2) }}%</a-col>
          </a-row>
          <a-divider :class="[index == 2 ? 'hidden' : '']" class="!my-3" />
        </div>
      </a-card>
      <!-- 核心装 -->
      <a-card class="mt-2">
        <template #title>
          <a-row>
            <a-col :span="16">核心装</a-col>
            <a-col :span="4">登场率</a-col>
            <a-col :span="4">胜率</a-col>
          </a-row>
        </template>
        <div v-for="(core_item, index) in champion.data.core_items.slice(0, 6)" :key="index">
          <a-row align="center">
            <a-col :span="16">
              <div class="flex">
                <img class="w-[42px] h-[42px] ml-2 border-gray-900 border-black"
                  v-for="(core_item_item, item_index) in core_item.ids" :key="item_index"
                  :src="findDetailObj('items', core_item_item).image_url" />
              </div>
            </a-col>
            <a-col :span="4">
              <div class="flex flex-col justify-start">
                <span class="mb-1">{{ (core_item.pick_rate * 100).toFixed(2) }}%</span>
                <span>{{ core_item.play }}</span>
              </div>
            </a-col>
            <a-col :span="4">{{ ((core_item.win / core_item.play) * 100).toFixed(2) }}%</a-col>
          </a-row>
          <a-divider :class="[index == 5 ? 'hidden' : '']" class="!my-3" />
        </div>
      </a-card>
      <!-- 鞋子 -->
      <a-card class="mt-2">
        <template #title>
          <a-row>
            <a-col :span="16">鞋子</a-col>
            <a-col :span="4">登场率</a-col>
            <a-col :span="4">胜率</a-col>
          </a-row>
        </template>
        <div v-for="(core_item, index) in champion.data.boots.slice(0, 3)" :key="index">
          <a-row align="center">
            <a-col :span="16">
              <div class="flex">
                <img class="w-[42px] h-[42px] ml-2 border-gray-900 border-black"
                  v-for="(core_item_item, item_index) in core_item.ids" :key="item_index"
                  :src="findDetailObj('items', core_item_item).image_url" />
              </div>
            </a-col>
            <a-col :span="4">
              <div class="flex flex-col justify-start">
                <span class="mb-1">{{ (core_item.pick_rate * 100).toFixed(2) }}%</span>
                <span>{{ core_item.play }}</span>
              </div>
            </a-col>
            <a-col :span="4">{{ ((core_item.win / core_item.play) * 100).toFixed(2) }}%</a-col>
          </a-row>
          <a-divider :class="[index == 2 ? 'hidden' : '']" class="!my-3" />
        </div>
      </a-card>
      <!-- 符文 -->
      <a-card class="mt-2">
        <template #title>
          <a-row>
            <a-col :span="16">符文</a-col>
            <a-col :span="4">登场率</a-col>
            <a-col :span="4">胜率</a-col>
          </a-row>
        </template>
        <div v-for="(core_item, index) in champion.data.runes.slice(0, 3)" :key="index">
          <a-row align="center">
            <a-col :span="16">
              <div class="flex">
                <div class="flex flex-col justify-center items-center font-bold w-[60px]">
                  <img class="w-[28px] h-[28px] mb-1"
                    :src="findDetailObj('runePages', core_item.primary_page_id).image_url" />
                  <span>主系</span>
                </div>
                <div class="flex">
                  <img class="w-[40px] h-[40px] ml-2" v-for="(core_item_item, item_index) in core_item.primary_rune_ids"
                    :key="item_index" :src="findDetailObj('runes', core_item_item).image_url" />
                </div>
              </div>
              <div class="flex mt-2">
                <div class="flex flex-col justify-center items-center font-bold w-[60px]">
                  <img class="w-[28px] h-[28px] mb-1"
                    :src="findDetailObj('runePages', core_item.secondary_page_id).image_url" />
                  <span>副系</span>
                </div>
                <div class="flex">
                  <img class="w-[40px] h-[40px] ml-2"
                    v-for="(core_item_item, item_index) in core_item.secondary_rune_ids" :key="item_index"
                    :src="findDetailObj('runes', core_item_item).image_url" />
                </div>
              </div>
              <div class="flex mt-2">
                <div class="flex flex-col justify-center items-center font-bold w-[60px]">
                  <span>小符文</span>
                </div>
                <div class="flex">
                  <img class="w-[20px] h-[20px] ml-2" v-for="(core_item_item, item_index) in core_item.stat_mod_ids"
                    :key="item_index" :src="findDetailObj('statMods', core_item_item).image_url" />
                </div>
              </div>
            </a-col>
            <a-col :span="4">
              <div class="flex flex-col justify-start">
                <span class="mb-1">{{ (core_item.pick_rate * 100).toFixed(2) }}%</span>
                <span>{{ core_item.play }}</span>
              </div>
            </a-col>
            <a-col :span="4">{{ ((core_item.win / core_item.play) * 100).toFixed(2) }}%</a-col>
          </a-row>
          <a-divider :class="[index == 2 ? 'hidden' : '']" class="!my-3" />
        </div>
      </a-card>
    </c-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import positionTigerSvg from '@/assets/champ-tiger'
import { getOpggChampionDetail, getOpggChampionAramByName } from '@/api/common'

const route = useRoute();

const { mode, position, championName } = route.query as any

// 英雄数据
const champion = ref<any>({});
// 等级列表
const levelList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
// 是否显示加载
const isLoading = ref(false);

onBeforeMount(async () => {
  let championResp :any
  isLoading.value = true;
  if(mode == 0){

     championResp = await getOpggChampionDetail(championName, position)
  }else if(mode == 1){
    championResp = await getOpggChampionAramByName(championName)
  }
  console.log(championResp);
  
  isLoading.value = false;
  champion.value = championResp.data;
});

/**
 * 通过key获取champion中详细的数据
 * @param {string} type 查找的字段
 * @param {number} id id
 */
const findDetailObj = (type: any, id: any) => {
  for (var i = 0; i < champion.value.data.meta[type].length; i++) {
    const obj = champion.value.data.meta[type][i];
    if (obj.id == id) {
      return obj;
    }
  }
};

/**
 * 显示英雄数据工具窗口
 */
const showChampionToolWindow = async () => {
  // await ipcRenderer.invoke('controller.opgg.showChampionToolWindow', {
  //   show: true,
  //   championName: champion.value.champion,
  //   position: champion.value.position,
  // });
};

function getPositionTigerImg(tiger: any) {
  return positionTigerSvg[tiger]
}
</script>
