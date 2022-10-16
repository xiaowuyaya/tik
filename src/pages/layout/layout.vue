<template>
  <div class="layout-container">
    <a-layout style="height: 100%">
      <a-layout-header>
        <Header />
      </a-layout-header>
      <a-layout>
        <a-layout-sider :width="220">
          <Menu />
          <div class="absolute  bottom-10 left-13 w-[60%] flex justify-center items-center text-gray-600 rounded-lg p-2 donate-shadow cursor-pointer" @click="goDonate">
            <img class="w-7" src="../../assets/icon/heart.svg" >
            <div class="ml-2">支持作者</div>
          </div>
          <!-- copyright -->
          <div class="text-center absolute bottom-2 w-full text-gray-500 font-medium text-sm">Power By XiaoWuYaYa</div>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <router-view  v-if="isRouterActive" v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <transition
              mode="out-in"
              :duration="200"
              enter-active-class="animate__animated animate__fadeIn"
              leave-active-class="animate__animated animate__fadeOut"
              v-if="!$route.meta.keepAlive"
            >
              <component :is="Component" :key="$route.name" />
            </transition>
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../store/user';
import { nextTick, onBeforeMount, provide, ref } from 'vue-demi';
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import {shell} from 'electron'

const isRouterActive = ref(true)
const userStore = useUserStore()

onBeforeMount(()=>{
    /* 如果用户信息不存在 重新获取 */
    if (!userStore.username) {
    userStore.userInfo({
      mac: $tools.PC_MAC,
      clientVersion: $tools.APP_VERSION,
    });
  }
})

function goDonate(){
  shell.openExternal(`${$tools.HOME_URI}/donate`)
}

/* 无感刷新页面 */
provide('reload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
</script>

<style lang="less">
.layout-container {
  height: 100vh;
  width: 100%;
  background-color: #f8fafc;

  .donate-shadow{
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  }
}
</style>
