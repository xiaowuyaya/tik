<template>
  <div class="h-full w-full">
    <!-- 可拖动部分 -->
    <div class="absolute top-0 left-0 w-[70%] h-[60px] user-drag"></div>
    <!-- 关闭按钮 -->
    <div class="absolute no-drag top-1 right-1 z-20 text-[36px]" @click="hideWin">
      <IconClose class="!text-light-50" />
    </div>
    <!-- 英雄信息 -->
    <div class="relative z-10">
      <!-- 背景图 -->
      <img class="h-full w-full block" :src="backgroundImg" alt="" />
      <!-- 介绍 -->
      <div class="absolute text-light-50 font-bold text-xl bottom-6 left-3 ]">{{ champion.data.summary.meta.name }}</div>
      <div class="absolute text-light-500 text-base bottom-1 left-3">{{ champion.data.summary.meta.key }}</div>
      <div class="absolute text-light-500 pr-2 mr-2 text-base bottom-1 right-2">
        {{ translate('opggPosition', champion.position.toUpperCase()) }}
      </div>
    </div>
    <!-- content -->
    <div class="bg-gray-100 h-full p-2">
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <div class="pb-2">
          <span class="text-sm">常用位置</span>
        </div>
        <div class="flex">
          <div
            class="flex items-center flex-1 justify-between bg-gray-100 p-2 rounded "
            v-for="(item, index) in champion.data.summary.summary.positions"
            :key="index"
            @click="changePosition(item.name)"
          >
            <div class="flex flex-col items-center justify-center flex-1">
              <img :src="`/src/assets/img/champions-stat/position/${item.name.toLowerCase()}.svg`" alt="" />
              <span class="mt-1">{{ translate('opggPosition', item.name) }}</span>
            </div>
            <div class="flex flex-col items-center justify-center flex-1">
              <span class="font-extrabold text-blue-500">{{ (item.stats.win_rate * 100).toFixed(2) }}%</span>
              <img class="mt-1" :src="`/src/assets/img/champions-stat/tiger/${item.stats.tier_data.tier}.svg`" alt="" />
            </div>
          </div>
        </div>
      </a-card>

      <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
        <div class="pb-2">
          <span class="text-sm">召唤师技能</span>
        </div>
        <div class="flex justify-between">
          <div
            class="flex items-center justify-between bg-gray-100 p-2 rounded"
            v-for="(item, index) in champion.data.summoner_spells[0].ids"
            :key="index"
            @click="changePosition(item.name)"
          >
            <div class="flex items-center justify-center flex-1">
              <img
                class="rounded-full w-[34px] h-[34px] last:ml-[-10px]"
                v-for="(item, index) in champion.data.summoner_spells[0].ids"
                :key="index"
                :src="findDetailObj('spells', item).image_url"
              />
            </div>
            <div class="flex flex-col items-center justify-center flex-1 ml-2">
              <span class="font-extrabold text-blue-500">{{ (champion.data.summoner_spells[0].pick_rate * 100).toFixed(2) }}%</span>
              <span class="mt-1">{{ champion.data.summoner_spells[0].play }}次</span>
            </div>
          </div>
        </div>
      </a-card>

      <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
        <div class="pb-2">
          <div class="pb-2">
            <span class="text-sm">技能加点</span>
          </div>
          <div class="flex flex-col">
            <div class="flex justify-center items-center px">
              <img class="w-[38px] h-[38px] rounded-full ml-2" :src="champion.data.summary.meta.passive.image_url" alt="" />
              <img class="w-[38px] h-[38px] rounded-full ml-2" :src="champion.data.summary.meta.spells[0].image_url" alt="" />
              <img class="w-[38px] h-[38px] rounded-full ml-2" :src="champion.data.summary.meta.spells[1].image_url" alt="" />
              <img class="w-[38px] h-[38px] rounded-full ml-2" :src="champion.data.summary.meta.spells[2].image_url" alt="" />
              <img class="w-[38px] h-[38px] rounded-full ml-2" :src="champion.data.summary.meta.spells[3].image_url" alt="" />
            </div>
            <div class="mt-3 flex items-center justify-center">
              <div class="text-light-50 font-bold w-[32px] h-[28px] rounded bg-sky-500 flex items-center justify-center">
                {{ champion.data.skill_masteries[0].ids[0] }}
              </div>
              <div class="mx-1 flex items-center justify-center">
                <icon-caret-right />
              </div>
              <div class="text-light-50 font-bold w-[32px] h-[28px] rounded bg-sky-500 flex items-center justify-center">
                {{ champion.data.skill_masteries[0].ids[1] }}
              </div>
              <div class="mx-1 flex items-center justify-center">
                <icon-caret-right />
              </div>
              <div class="text-light-50 font-bold w-[32px] h-[28px] rounded bg-sky-500 flex items-center justify-center">
                {{ champion.data.skill_masteries[0].ids[2] }}
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <div class="px-2 mt-2">
        <a-button size="large" block long type="primary" @click="drawerShow = !drawerShow">导入符文</a-button>
      </div>
    </div>

    <a-drawer
      :drawer-style="{ background: 'rgba(243, 244, 246, 1)', padding: '-14px -10px !important' }"
      :header="false"
      :visible="drawerShow"
      height="80%"
      placement="bottom"
      :footer="false"
      @cancel="drawerShow = !drawerShow"
    >
      <el-scrollbar height="100%">
        <div class="py-2 bg-light-50 rounded mb-2" v-for="(core_item, index) in champion.data.runes" :key="index">
          <!-- content -->
          <div class="flex items-center justify-between">
            <!-- primary -->
            <div class="flex flex-col">
              <!-- 上 -->
              <div class="flex items-center">
                <img
                  class="w-[34px] h-[34px] ml-2"
                  v-for="(core_item_item, item_index) in core_item.primary_rune_ids"
                  :key="item_index"
                  :src="findDetailObj('runes', core_item_item).image_url"
                />
              </div>
              <div class="flex justify-between mt-2">
                <div class="flex items-center">
                  <img
                    class="w-[28px] h-[28px] ml-2"
                    v-for="(core_item_item, item_index) in core_item.secondary_rune_ids"
                    :key="item_index"
                    :src="findDetailObj('runes', core_item_item).image_url"
                  />
                </div>
                <div class="flex items-center">
                  <img
                    class="w-[16px] h-[16px] ml-1"
                    v-for="(core_item_item, item_index) in core_item.stat_mod_ids"
                    :key="item_index"
                    :src="findDetailObj('statMods', core_item_item).image_url"
                  />
                </div>
              </div>
            </div>
            <!-- btn -->
            <div class="px-2 mr-2">
              <a-button type="primary"  @click="useSelectRune(core_item)">
                <template #icon>
                  <icon-plus />
                </template>
                导入
              </a-button>
            </div>
          </div>
          <a-divider class="!my-[8px]" />
          <!-- footer -->
          <div class="flex items-center justify-between">
            <span class="px-2 text-xs text-blue-500">胜率 {{ ((core_item.win / core_item.play) * 100).toFixed(2) }}%</span>
            <span class="px-2 text-xs">使用率 {{ (core_item.pick_rate * 100).toFixed(2) }}%</span>
          </div>
        </div>
      </el-scrollbar>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { translate } from '@/utils/translate';
import ipcRenderer from '@/utils/ipcRenderer';
import { useMessage } from '@/utils/message-notice';
import { onBeforeMount, ref } from 'vue';

// 显示加载动画
const isLoading = ref<boolean>(false);
// 英雄数据
const champion = ref<any>({});
// 背景图
const backgroundImg = ref<string>('');
// 是否显示抽屉
const drawerShow = ref<boolean>(false);
// 当前显示的tab

onBeforeMount(async () => {
  await getChampionData('fiora', 'top');
});

// 持续监听玩家游戏状态变化
ipcRenderer.ipc.removeAllListeners('controller.opgg.listenChampionChange');
ipcRenderer.ipc.on('controller.opgg.listenChampionChange', async (_event, data) => {
  await getChampionData(data.championName, data.position);
});

/**
 * 加载数据
 */
const getChampionData = async (championName, position) => {
  isLoading.value = true;
  const dataResp = await ipcRenderer.invoke('controller.opgg.getDetailByPositionAndName', { championName, position });
  useMessage(dataResp);
  champion.value = dataResp.data;
  backgroundImg.value = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.value.data.summary.meta.key}_0.jpg`;

  isLoading.value = false;
};

/**
 * 更改位置
 */
const changePosition = async (position) => {
  await getChampionData(champion.value.champion, position);
};

/**
 * 通过key获取champion中详细的数据
 * @param {string} type 查找的字段
 * @param {number} id id
 */
const findDetailObj = (type, id) => {
  for (var i = 0; i < champion.value.data.meta[type].length; i++) {
    const obj = champion.value.data.meta[type][i];
    if (obj.id == id) {
      return obj;
    }
  }
};

/**
 * 隐藏窗口
 */
const hideWin = async () => {
  await ipcRenderer.invoke('controller.opgg.showChampionToolWindow', {
    show: false,
  });
};

/**
 * 使用选中符文
 */
const useSelectRune = async (item) => {
  const perkIds = item.primary_rune_ids.concat(item.secondary_rune_ids).concat(item.stat_mod_ids);

  const data = {
    name: `Tik对局助手：${champion.value.data.summary.meta.name} `,
    order: item.id,
    primaryStyleId: item.primary_page_id,
    subStyleId: item.secondary_page_id,
    selectedPerkIds: perkIds,
  };

  const resp = await ipcRenderer.invoke('controller.lcu.postRunePage', { data });
  useMessage(resp, '符文导入成功');
};
</script>
