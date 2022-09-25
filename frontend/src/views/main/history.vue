<template>
  <component :is="currentTabComponent"></component>
</template>
<script setup lang="ts">
import NoGameStart from '@/components/error/NoGameStart.vue'
import Search from '@/components/history/Search.vue'
import { type Component, onMounted, ref } from 'vue'
import _ from 'loadsh'
import ipcRenderer from '@/utils/ipcRenderer';

const currentTabComponent = ref<Component>(NoGameStart)


onMounted(async() => {
  const credentials = await ipcRenderer.invoke('controller.common.getCredentials', {})
  if (!_.isEmpty(credentials)) currentTabComponent.value = Search
})
</script>
