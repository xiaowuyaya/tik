<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { useAppStore } from '@/stores/app'
import { getToken } from '@/utils/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const configStore = useConfigStore()
const appStore = useAppStore()

configStore.init()
appStore.init()

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
</script>

<template>
  <transition
    mode="out-in"
    :duration="300"
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <router-view />
  </transition>
</template>

<style lang="less">
@import './style/index.less';
</style>
