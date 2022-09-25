<template>
  <component :is="currentTabComponent"></component>
</template>
<script setup lang="ts">
import NoGameStart from '@/components/error/NoGameStart.vue'
import Home from '@/components/Home/Home.vue'
import { type Component, onMounted, ref } from 'vue'
import _ from 'loadsh'
import ipcRenderer from '@/utils/ipcRenderer';

const currentTabComponent = ref<Component>(NoGameStart)


onMounted(async () => {
  const credentials = await ipcRenderer.invoke('controller.common.getCredentials', {})
  console.log(credentials);
  
  if (!_.isEmpty(credentials)) currentTabComponent.value = Home
})
</script>
