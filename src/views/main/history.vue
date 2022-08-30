<template>
  <component :is="currentTabComponent"></component>
</template>
<script setup lang="ts">
import NoGameStart from '@/components/error/NoGameStart.vue';
import Search from '@/components/history/Search.vue';
import ElectronStore from 'electron-store';
import { type Component, onMounted, ref } from 'vue';

const currentTabComponent = ref<Component>(NoGameStart)

const appStore: ElectronStore = window.appStore

onMounted(() => {
  const credentials = appStore.get('credentials')
  if (credentials) currentTabComponent.value = Search
})
</script>

