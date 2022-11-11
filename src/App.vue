<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useAppStore} from "@/store/app";
import {useConfigStore} from "@/store/config";

const router = useRouter()

useAppStore().init()
useConfigStore().init()
</script>

<template>
  <transition mode="out-in" :duration="300" enter-active-class="animate__animated animate__fadeIn"
              leave-active-class="animate__animated animate__fadeOut">
    <router-view/>
  </transition>
</template>

<style lang="less">
@import './style/index.less';
</style>
