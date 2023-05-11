<script setup>
import {Close, Refresh} from '@element-plus/icons-vue'
import { ref } from 'vue'
import PanelInfo from './PanelInfo.vue'
import ChampInfo from './ChampInfo.vue'

const activeTabs = ref('order')
const PanelInfoKey = ref(0)
const ChampInfoKey = ref(0)

window.electron.ipcRenderer.removeAllListeners('tool-select-champ')
window.electron.ipcRenderer.on('tool-select-champ', async (event, data) => {
  activeTabs.value = 'champ'
  ChampInfoKey.value = new Date().getTime()
})
window.electron.ipcRenderer.removeAllListeners('tool-panel-data')
window.electron.ipcRenderer.on('tool-panel-data', async (event, data) => {
  activeTabs.value = 'champ'
  PanelInfoKey.value = new Date().getTime()
})

function handleClose() {
  $winManage.global.tools.hide()
}

function handleRefresh(){
  ChampInfoKey.value = new Date().getTime()
  PanelInfoKey.value = new Date().getTime()
}
</script>
<template>
  <div class="w-full h-full flex flex-col bg-white dark:bg-[#141414]">
    <header class="px-2 py-[1.24rem] !h-10 flex justify-between items-center border-b border-gray-200 user-drag dark:border-[var(--el-border-color)]">
      <div class="flex">
        <img class="w-6 h-6" src="../../assets/logo.png" />
      </div>
      <div class="no-drag">
        <el-button plain text circle :icon="Refresh" @click="handleRefresh" />
        <el-button plain text circle :icon="Close" @click="handleClose" />
      </div>
    </header>
    <div class="flex-1 px-3 mt-3">
      <el-tabs v-model="activeTabs" class="flex-1 h-full" stretch>
        <el-tab-pane label="友军" name="order">
          <PanelInfo :key="PanelInfoKey" team="order" />
        </el-tab-pane>
        <el-tab-pane label="敌军" name="chaos">
          <PanelInfo :key="PanelInfoKey" team="chaos" />
        </el-tab-pane>
        <el-tab-pane label="英雄数据" name="champ">
          <ChampInfo :key="ChampInfoKey" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
