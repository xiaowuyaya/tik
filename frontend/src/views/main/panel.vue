<template>
    <component :is="currentTabComponent"></component>
</template>
<script setup lang="ts">
import NoPanelData from '@/components/error/NoPanelData.vue';
import PanelData from '@/components/panel/PanelData.vue'
import ipcRenderer from '@/utils/ipcRenderer';
import { onMounted, ref } from 'vue';

const currentTabComponent = ref(NoPanelData)

onMounted(async () => {
  
  let gameStatus = await ipcRenderer.invoke('controller.lcuHandle.getGameStatus', {})
  if (gameStatus == 'InProgress' || gameStatus == 'ChampSelect') {
    currentTabComponent.value = PanelData;
  }

  const panelDataCache = await ipcRenderer.invoke('controller.common.getCache', {cache: 'panelData'})
  if(panelDataCache) {
    currentTabComponent.value = PanelData;
  }
})
</script>