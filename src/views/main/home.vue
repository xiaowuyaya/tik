<template>
  <component :is="currentTabComponent"></component>
</template>
<script setup lang="ts">
import NoGameStart from '@/components/error/NoGameStart.vue';
import Home from '@/components/Home/Home.vue';
import ElectronStore from 'electron-store';
import { type Component, onMounted, ref, reactive } from 'vue';

const currentTabComponent = ref<Component>(NoGameStart)

const appStore: ElectronStore = window.appStore

onMounted(() => {
  const credentials = appStore.get('credentials')
  if (credentials) currentTabComponent.value = Home
})



</script>

