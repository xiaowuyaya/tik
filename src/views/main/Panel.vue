<template>
    <component :is="currentTabComponent"></component>
</template>
<script setup lang="ts">
import NoPanelData from '@/components/error/NoPanelData.vue';
import PanelData from '@/components/panel/PanelData.vue'
import { onMounted, ref } from 'vue';


const lcuApi = window.handle.lcuApi
const panelDataStore = window.panelDataStore

const currentTabComponent = ref(NoPanelData)

onMounted(async () => {
  console.log(panelDataStore.get('panelData.orderList'));
  
  let gameStatus = await lcuApi.getGameStatus()
  if (gameStatus == 'InProgress' || gameStatus == 'ChampSelect') {
    currentTabComponent.value = PanelData;
  }

  if(panelDataStore.get('panelData.orderList').length != 0) {
    currentTabComponent.value = PanelData;
  }
})
</script>