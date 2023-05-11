<script setup>
import EmptyPanel from './EmptyPanel.vue'
import GamePanel from './GamePanel.vue'
import { ref } from 'vue'
const currentTabComponent = ref(EmptyPanel)

async function init() {
  const gameStatus = await $api.getGameStatus()
  if (gameStatus == 'InProgress' || gameStatus == 'ChampSelect') currentTabComponent.value = GamePanel
  const panelDataCache = $cache.get('panelData')
  if (panelDataCache) {
    currentTabComponent.value = GamePanel
  }
}
init()
</script>

<template>
  <component :is="currentTabComponent"></component>
</template>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
