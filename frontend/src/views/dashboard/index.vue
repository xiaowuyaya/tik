<template>
  <component :is="currentTabComponent"></component>
</template>

<script setup lang="ts">
import NoClientStart from "@/components/NoClientStart.vue";
import Dashboard from "./dashboard.vue";
import { onBeforeMount, ref } from "vue";
import { useAppInfoStore } from "@/stores/modules/appInfo";

const appInfoStore = useAppInfoStore();

const currentTabComponent = ref<any>(NoClientStart);

onBeforeMount(() => {
  if (appInfoStore.lcuEnable !== null) {
    currentTabComponent.value = Dashboard;
  }
});
</script>

<style scoped>
</style>