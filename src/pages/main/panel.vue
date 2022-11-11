<template>
  <div class="w-full h-full">
    <component :is="currentTabComponent"></component>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NoPanelData from '@/components/NoPanelData.vue'
// import PanelData from '@/components/panel/PanelData.vue'

const currentTabComponent = ref(NoPanelData)

// onMounted(async () => {
//
//   let gameStatus: string = await $api.getGameStatus()
//   if (gameStatus == 'InProgress' || gameStatus == 'ChampSelect') {
//     currentTabComponent.value = PanelData;
//   }
//
//   const panelDataCache = $cache.get('panelData')
//   if(panelDataCache) {
//     currentTabComponent.value = PanelData;
//   }
// })
</script>