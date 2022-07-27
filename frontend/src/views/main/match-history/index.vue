<template>
  <component :is="currentTabComponent"></component>
</template>

<script setup lang="ts">
import NoClientStart from '@/components/NoClientStart.vue';
import History from './history.vue';
import { onBeforeMount, ref, watch } from 'vue';
import { useAppInfoStore } from '@/stores/modules/appInfo';
import ipcRenderer from '@/utils/ipcRenderer';

const appInfoStore = useAppInfoStore();

const currentTabComponent = ref<any>(NoClientStart);

onBeforeMount(async () => {
  const isGamelaunch = await ipcRenderer.invoke('controller.lcu.isGamelaunch', '');
  if (isGamelaunch) {
    appInfoStore.lcuEnable = isGamelaunch;
    currentTabComponent.value = History;
  }
});

watch(
  () => appInfoStore.lcuEnable,
  () => {
    currentTabComponent.value = History;
  },
);
</script>

<style scoped></style>
