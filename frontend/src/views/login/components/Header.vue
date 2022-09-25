<template>
  <header class="p-2 h-16 backdrop-filter backdrop-blur-[5px] flex justify-between items-center user-drag">
    <!-- LOGO -->
    <img class="w-12" src="@/assets/logo.png" />

    <!-- WINDOW BTN -->
    <div class="flex justify-between items-center no-drag">
      <div class="px-2 rounded-md hover:opacity-60 active:opacity-20" @click="handleMainWindowClose">
        <icon-close size="26" class="!text-light-700" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ipcRenderer from '@/utils/ipcRenderer'

const handleMainWindowClose = async () => {
  ipcRenderer.invoke('controller.common.mainWindowClose', {})
}
</script>
<style lang="less">
@import url('@/style/drag.less');
</style>
