<script setup lang="ts">
import { useConfigStore } from './store/config';
import { useRouter } from 'vue-router'
import { getToken } from './utils/auth'
import { ipcRenderer } from 'electron';

const router = useRouter()

useConfigStore().init()

/* 客户端启动 */
ipcRenderer.on('keep-alive', (data) => {
  router.push({ name: 'home' })

  /* 判断是否已经登入 */
  if (
    window.location.href.indexOf('/champ-tool/rune') === -1 &&
    window.location.href.indexOf('/champ-tool/spells') === -1
  ) {
    const token = getToken()
    if (token) {
      router.push({ name: 'home' })
    } else {
      router.push({ name: 'login' })
    }
  }

  setTimeout(() => { }, 1500);

  setInterval(async () => {
    const h2 = await $api.getGameStatus()
    const h1 = await $api.getGameStatusHttp1()
  }, 10000)
})

</script>

<template>
  <transition mode="out-in" :duration="300" enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut">
    <router-view />
  </transition>
</template>

<style lang="less">
@import './style/index.less';
</style>
