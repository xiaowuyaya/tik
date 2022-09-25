<template>
  <div class="h-full w-full main-container bg-white">
    <a-layout style="height: 100%">
      <a-layout-header>
        <LayoutHeader />
      </a-layout-header>
      <a-layout>
        <a-layout-sider :width="180">
          <LayoutMenu />
        </a-layout-sider>
        <a-layout-content class="layout-content p-2">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <transition
              mode="out-in"
              :duration="300"
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
import LayoutHeader from './Header.vue'
import LayoutMenu from './Menu.vue'
import { mainSetup } from '@/utils/init'
import { onMounted, onDeactivated } from 'vue'
import ipcRenderer from '@/utils/ipcRenderer'
import { Message } from '@arco-design/web-vue'
import { keepLoginStatus } from '@/api/user'
import { getToken } from '@/utils/auth'

let keepLogin

onMounted(async () => {
  await mainSetup()
  ipcRenderer.ipc.on('listenUpdateInfo', (_event, data) => {
    Message[data.type]({
      content: data.msg,
      duration: 1500,
    })
  })

  // 定时任务保持当前账号的在线状态
  keepLogin = window.setInterval(async () => {
    const token = getToken()
    if (token) {
      await keepLoginStatus()
    }
  }, 1000 * 60 * 5)
})

onDeactivated(() => {
  window.clearInterval(keepLogin)
})
</script>
<style lang="less">
.layout-content {
  background-color: #f8fafc;
}
</style>
