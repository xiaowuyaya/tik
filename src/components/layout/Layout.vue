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
            <transition mode="out-in" :duration="300" enter-active-class="animate__animated animate__fadeIn"
              leave-active-class="animate__animated animate__fadeOut" v-if="!$route.meta.keepAlive">
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
import { onMounted, onDeactivated } from 'vue';
import { ipcRenderer } from "electron";
import { Message } from "@arco-design/web-vue";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import { keepLoginStatus } from "@/api/user";
import { getToken } from '@/utils/auth'
import { useConfigStore } from '@/stores/config';

const userStore = useUserStore()
const appStore = useAppStore()
const configStore = useConfigStore()

let vipCheck, keepLogin;

ipcRenderer.on('playerStatus', async (event, data) => {
  console.log(configStore.specialFunc.enableSkin);

  if (data == 'InProgress') {
    if (configStore.specialFunc.enableSkin) {
      if (userStore.expiration != '') {
        await ipcRenderer.invoke('injectSkin', '');
      }
    }

  }
})

onMounted(async () => {
  await mainSetup()
  ipcRenderer.on('listenUpdateInfo', (_event, data) => {
    Message[data.type]({
      content: data.msg,
      duration: 1500,
    });
  });
  /* 如果用户信息不存在 重新获取 */
  if (!userStore.username) {
    await userStore.myInfo({
      mac: appStore.mac,
      clientVersion: appStore.version,
    });
  }

  await userStore.vipCheck();
  await keepLoginStatus();

  // 定时任务查看会员是否已到期
  vipCheck = window.setInterval(async () => {
    const token = getToken();
    if (token) {
      let check = await userStore.vipCheck();
      if (!check) window.clearInterval(vipCheck);
    }
  }, 1000 * 60 * 5);

  // 定时任务保持当前账号的在线状态
  keepLogin = window.setInterval(async () => {
    const token = getToken();
    if (token) {
      await keepLoginStatus();
    }
  }, 1000 * 60 * 5);
})

onDeactivated(() => {
  //离开当前组件的生命周期执行的方法
  window.clearInterval(vipCheck);
  window.clearInterval(keepLogin);
});
</script>
<style lang="less">
.layout-content {
  background-color: #f8fafc;
}
</style>