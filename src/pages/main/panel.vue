<template>
  <div class="w-full h-full">
    <component :is="currentTabComponent"></component>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue';
import NoPanelData from '../../components/error/NoPanelData.vue'
import PanelData from '../../components/panel/PanelData.vue'

const currentTabComponent = ref(NoPanelData)

onMounted(async () => {
  
  let gameStatus = await $api.getGameStatus()
  if (gameStatus == 'InProgress' || gameStatus == 'ChampSelect') {
    currentTabComponent.value = PanelData;
  }

  const panelDataCache = $utils.cache.get('panelData')
  if(panelDataCache) {
    currentTabComponent.value = PanelData;
  }
})
</script>