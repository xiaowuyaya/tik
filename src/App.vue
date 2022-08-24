<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import { getToken } from '@/utils/auth';
import { useRouter } from 'vue-router';

const router = useRouter()
const configStore = useConfigStore()
configStore.init()

/* 判断是否已经登入 */
const token = getToken();
if (token) {
  router.push({ name: 'home' });
} else {
  router.push({ name: 'login' });
}

</script>

<template>
  <router-view />
</template>

<style lang="less">
@import './style/index.less';
</style>
