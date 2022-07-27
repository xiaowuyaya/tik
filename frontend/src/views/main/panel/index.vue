<template>
  <div>
    <component :is="currentTabComponent"></component>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, shallowRef } from 'vue';
import PanelData from './panel-data.vue';
import NoGameDataVue from '@/components/NoGameData.vue';
import ipcRenderer from '@/utils/ipcRenderer';

const currentTabComponent = shallowRef(NoGameDataVue);

onBeforeMount(async () => {
  // 获取当前玩家游戏状态,更改显示页面
  let gameStatus = await ipcRenderer.invoke('controller.lcu.getPlayerStatus', { origin: true });
  console.log(gameStatus);
  if (gameStatus == 'InProgress' || gameStatus == 'ChampSelect') {
    currentTabComponent.value = PanelData;
  }
  // 判断是否存在数据
  const panelData = await ipcRenderer.invoke('controller.data.getCacheData', { key: 'panel-data' });
  
  if (panelData.data.orderList.length != 0) {
    currentTabComponent.value = PanelData;
  }
});
</script>
