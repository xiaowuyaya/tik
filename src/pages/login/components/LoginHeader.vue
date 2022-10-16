<template>
  <header class="p-2 h-16 backdrop-filter backdrop-blur-[10px] flex justify-between items-center user-drag">
    <!-- LOGO -->
    <img class="w-14" src="../../../assets/logo.png" />

    <!-- WINDOW BTN -->
    <div class="flex justify-between items-center no-drag">
      <div class="px-2 rounded-md hover:opacity-60 active:opacity-20" @click="ipcRenderer.send('app-quit', '')">
        <icon-close size="26" class="!text-light-700" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ipcRenderer } from "electron";


</script>

<style lang="less">

</style>
