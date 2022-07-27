<template>
  <component :is="currentTabComponent"></component>
</template>

<script setup lang="ts">
import NoClientStart from '@/components/NoClientStart.vue';
import Dashboard from './dashboard.vue';
import { onBeforeMount, ref, watch } from 'vue';
import { useAppInfoStore } from '@/stores/modules/appInfo';
import ipcRenderer from '@/utils/ipcRenderer';

const appInfoStore = useAppInfoStore();

const currentTabComponent = ref<any>(NoClientStart);

onBeforeMount(async () => {
  const isGamelaunch = await ipcRenderer.invoke('controller.lcu.isGamelaunch', '');
  console.log(isGamelaunch)
  if (isGamelaunch) {
    appInfoStore.lcuEnable = isGamelaunch;
    currentTabComponent.value = Dashboard;
  }
});

watch(
  () => appInfoStore.lcuEnable,
  () => {
    currentTabComponent.value = Dashboard;
  },
);
</script>

<style scoped></style>
