<template>
  <div class="layout-container">
    <LoginModal v-model="appStore.NEED_LOGIN"/>
    <a-layout style="height: 100%">
      <a-layout-header>
        <Header/>
      </a-layout-header>
      <a-layout>
        <a-layout-sider :width="220">
          <Menu/>
          <div
              class="absolute  bottom-10 left-13 w-[60%] flex justify-center items-center text-gray-600 rounded-lg p-2 donate-shadow cursor-pointer"
              @click="goDonate">
            <img class="w-7" src="@/assets/icon/heart.svg">
            <div class="donate-text">支持作者</div>
          </div>
          <!-- copyright -->
          <div class="copyright-text text-center absolute bottom-2 w-full font-medium text-sm">Power By XiaoWuYaYa</div>
        </a-layout-sider>
        <a-layout-content class="p-2 layout-content-container">

          <router-view v-if="isRouterActive" v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <transition mode="out-in" :duration="200" enter-active-class="animate__animated animate__fadeIn"
                        leave-active-class="animate__animated animate__fadeOut" v-if="!$route.meta.keepAlive">
              <component :is="Component" :key="$route.name"/>
            </transition>
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import Header from './Header.vue'
import Menu from './Menu.vue'
import {ref} from 'vue-demi';
import {ipcRenderer, shell} from "electron";
import {useAppStore} from "@/store/app";
import LoginModal from '@/components/LoginModal.vue'
import {useUserStore} from "@/store/user";
import {onDeactivated, onMounted} from "vue";
import {keepLoginStatus} from "@/api/user";
import {useRouter} from 'vue-router';
import dayjs from "dayjs";
import {useConfigStore} from "@/store/config";

const appStore = useAppStore()
const userStore = useUserStore()
const configStore = useConfigStore()
const isRouterActive = ref(true)
const router = useRouter()

/* 自适应主题 */
if (configStore.autoTheme) {
  console.log(`[configStore.autoTheme] ${configStore.autoTheme}`)
  setInterval(() => {
    if (dayjs().hour() > 8 && dayjs().hour() < 18) {
      document.body.setAttribute('arco-theme', 'light');
    } else {
      document.body.setAttribute('arco-theme', 'dark');
    }
  }, 1000 * 60 * 30)
}
ipcRenderer.on('player-status', (_event, data) => {
  /* 当进入游戏时跳转到面板 */
  if (data === 'InProgress' || data === 'ChampSelect') {
    router.push({
      path: '/panel',
    })
  }
})

let keepLoginStatusInterval: null | NodeJS.Timer = null
onMounted(() => {
  if (!appStore.NEED_LOGIN) {
    /* 如果用户信息不存在 重新获取 */
    if (!userStore.username) {
      userStore.userInfo({
        mac: $consts.PC_MAC,
        clientVersion: $consts.APP_VERSION,
      });
    }

    // 定时任务保持当前账号的在线状态
    keepLoginStatusInterval = setInterval(async () => {
      await keepLoginStatus()
    }, 1000 * 60 * 5)
  }
})

onDeactivated(() => {
  if (keepLoginStatusInterval) clearInterval(keepLoginStatusInterval)
})


function goDonate() {
  shell.openExternal(`${$consts.HOME_URI}/donate`)
}

</script>

<style lang="less">
.layout-container {
  height: 100vh;
  width: 100%;
  background-color: var(--color-bg-1);

  .donate-shadow {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  }

  .donate-text {
    color: var(--color-text-1);
  }

  .copyright-text {
    color: var(--color-text-2);
  }

  .layout-content-container {
    background-color: var(--color-bg-1);
  }
}
</style>
