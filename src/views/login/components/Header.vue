<template>
  <header class="p-2 h-16 backdrop-filter backdrop-blur-[5px] flex justify-between items-center user-drag">
    <!-- LOGO -->
    <img class="w-12" src="@/render/assets/logo.png" />

    <!-- WINDOW BTN -->
    <div class="flex justify-between items-center no-drag">
      <div class="p-0.01 rounded-md hover:opacity-60 active:opacity-20" @click="ipcRenderer.send('mainWin.close')">
        <close-icon size="2.8rem" color="#ebe8f5" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { CloseIcon } from 'tdesign-icons-vue-next'



</script>
<style lang="less">
@import url('@/style/drag.less');
</style>
