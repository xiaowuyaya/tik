<script setup>
import {nextTick, provide, ref} from "vue";

const routerActive = ref(true)
provide('reload', () => {
  $cache.del('panelData')
  routerActive.value = false
  nextTick(() => {
    routerActive.value = true
  })
})

</script>

<template>
  <router-view v-slot="{ Component }" v-if="routerActive">
    <transition mode="out-in" :duration="200" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
      <component :is="Component" class="w-full h-full bg-white dark:bg-[#141414]" v-if="routerActive"/>
    </transition>
  </router-view>
</template>

<style lang="less">
@import './style/index.less';
</style>
