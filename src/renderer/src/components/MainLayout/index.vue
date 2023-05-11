<script setup>
import UserProfile from './UserProfile.vue'
import Header from './Header.vue'
import { useUserStore } from '../../store/user'
import DashboardIcon from '../../assets/icons/dashboard.svg'
import PanelIcon from '../../assets/icons/panel.svg'
import SearchIcon from '../../assets/icons/search.svg'
import FuncIcon from '../../assets/icons/func.svg'
import AutoIcon from '../../assets/icons/auto.svg'
import BlacklistIcon from '../../assets/icons/blacklist.svg'
import SkinIcon from '../../assets/icons/skin.svg'
import SettingIcon from '../../assets/icons/setting.svg'
import HeartIcon from '../../assets/icons/heart.svg'
import ChampDataIcon from '../../assets/icons/champ_data.svg'
import {provide, ref, nextTick, inject} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import io from 'socket.io-client'

import './mainLayouService'
import {ElMessage, ElNotification} from 'element-plus'
import { checkVipConfirmStatus } from '../../api/vip'
import {getNotify} from "../../api/common";

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const navigations = ref([]) // 菜单

userStore.currentUserInfo({ mac: $constant.PC_MAC, clientVersion: $constant.APP_VERSION }) // 获取用户信息

// WEBSOCKET SERVICE BEGIN
let socket, KEEP_SOCKET_ALIVE
const SOCKET_SERVER_STATUS = ref(0) // 0 连接中  1 链接成功 -1 断开连接 -2 错误

socket = io(`${$constant.SOCKET_URI}`, {
  query: { _m: $constant.PC_MAC, _v: $constant.APP_VERSION },
  transports: ['websocket'],
  autoConnect: true,
  upgrade: false,
  allowEIO3: false,
  reconnection: true,
})

socket.on('connect', () => {
  SOCKET_SERVER_STATUS.value = 1
  // console.log('socket connect', socket.connected) // true
  // console.log('socket connect', socket.emit('ping', {}))

  KEEP_SOCKET_ALIVE = setInterval(() => {
    socket.send('ping')
  }, 9000)
})

socket.on('ad-show', data => {
  window.electron.ipcRenderer.send('ad-show', data)
})

socket.on('disconnect', reason => {
  ElMessage.warning({ message: `与Tik服务器断开连接: ${reason}`, grouping: true })
  if (KEEP_SOCKET_ALIVE) clearInterval(KEEP_SOCKET_ALIVE)
  if (reason == 'io server disconnect' || reason == 'io client disconnect') {
    SOCKET_SERVER_STATUS.value = -1
  }
  SOCKET_SERVER_STATUS.value = 0
})

socket.on('connect_error', error => {
  SOCKET_SERVER_STATUS.value = -2
})

// WEBSOCKET SERVICE END

async function init() {
  const showPaidMenuItem = await checkVipConfirmStatus()
  userStore.vipConfirmStatus = showPaidMenuItem.data

  navigations.value = [
    {
      path: '/SummonerInfo',
      label: '账号信息',
      show: true,
      icon: DashboardIcon,
    },
    {
      path: '/GamePanel',
      label: '对局面板',
      show: true,
      icon: PanelIcon,
    },
    {
      path: '/RecordQuery',
      label: '战绩查询',
      show: true,
      icon: SearchIcon,
    },
    {
      path: '/CommonFunctions',
      label: '常用功能',
      show: true,
      icon: FuncIcon,
    },
    {
      path: '/AutoBan',
      label: '自动禁选',
      show: true,
      icon: AutoIcon,
    },
    {
      path: '/Blacklist',
      label: '死亡笔记',
      show: true,
      icon: BlacklistIcon,
    },
    {
      path: '/ChampData',
      label: '英雄数据',
      show: true,
      icon: ChampDataIcon,
    },
    {
      path: '/PaidContent',
      label: '会员模块',
      show: showPaidMenuItem.data !== -1,
      icon: SkinIcon,
    },
    {
      path: '/Settings',
      label: '设置',
      show: true,
      icon: SettingIcon,
    },
  ]

  const notify = await getNotify()
  if (notify.data){
    ElNotification({
      title: '系统通知',
      message: notify.data,
      duration: 0,
    })

  }

  //   TODO: 配置同步
  setInterval(async () => {
    if ((await $api.getGameStatus()) !== 'InProgress') {
      await userStore.syncUserConfig()
    }
  }, 1000 * 60 * 10)
}

init()

// 菜单栏
</script>

<template>
  <el-container>
    <!-- 左侧边 -->
    <el-aside width="210px" class="flex flex-col pt-5 border-r border-gray-200 relative dark:border-[var(--el-border-color)]">
      <!-- logo -->
      <div class="flex items-center px-4 user-drag">
        <img class="h-8 w-auto" src="../../assets/logo.png" alt="TikLogo" />
        <span class="ml-2 font-youshe text-[1.4rem] dark:bg-gradient-to-r dark:from-indigo-200 dark:via-sky-400 dark:to-indigo-200 dark:bg-clip-text dark:font-display dark:text-transparent">英雄联盟对局助手</span>
      </div>
      <!--   用户信息   -->
      <UserProfile class="mt-6" :username="userStore.username" :nickname="userStore.nickName" :avatar="userStore.avatarUrl" />
      <!--   菜单   -->
      <el-menu class="!mt-6 !border-none" default-active="/SummonerInfo" router>
        <el-menu-item v-for="(item, idx) in navigations" v-show="item.show" :key="idx" :index="item.path">
          <img class="w-6 mr-4" :src="item.icon" alt="icon" />
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
      <!-- 赞助 -->
      <div class="!absolute bottom-24 left-12 w-[60%] flex justify-center items-center rounded-lg p-2 donate-shadow cursor-pointer" @click="router.push('/Settings')">
        <img class="w-7" :src="HeartIcon" alt="" />
        <div class="text-sm">支持作者</div>
      </div>
      <!--   服务器状态   -->
      <div v-show="SOCKET_SERVER_STATUS == 1" class="!absolute bottom-12 left-20 flex items-center">
        <span class="relative inline-block w-[6px] h-[6px] align-middle rounded-[50%] bg-green-500"></span>
        <span class="font-bold text-gray-900 ml-2 dark:text-gray-100">连接成功</span>
      </div>
      <div v-show="SOCKET_SERVER_STATUS == -2" class="!absolute bottom-12 left-20 flex items-center">
        <span class="relative inline-block w-[6px] h-[6px] align-middle rounded-[50%] bg-red-500"></span>
        <span class="font-bold text-gray-900 ml-2 dark:text-gray-100">连接失败</span>
      </div>
      <div v-show="SOCKET_SERVER_STATUS == -1" class="!absolute bottom-12 left-20 flex items-center">
        <span class="relative inline-block w-[6px] h-[6px] align-middle rounded-[50%] bg-yellow-500"></span>
        <span class="font-bold text-gray-900 ml-2 dark:text-gray-100">连接断开</span>
      </div>
      <div v-show="SOCKET_SERVER_STATUS == 0" class="!absolute bottom-12 left-20 flex items-center">
        <span class="relative inline-block w-[6px] h-[6px] align-middle rounded-[50%] bg-blue-500"></span>
        <span class="font-bold text-gray-900 ml-2 dark:text-gray-100">连接中...</span>
      </div>
      <!--   copyright   -->
      <div class="!absolute bottom-6 left-14 text-sm">Build by <i>xiaowuyaya</i></div>
    </el-aside>

    <!--  右侧边  -->
    <el-container>
      <el-header class="w-full !h-16 flex items-center justify-between border-b border-gray-200 user-drag dark:border-[var(--el-border-color)]">
        <Header />
      </el-header>
      <el-main class="!p-2">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less">
:root {
  --el-menu-item-height: 44px !important;
  --el-menu-hover-bg-color: var(--el-color-primary-light-9);
}

.el-menu {
  padding: 0 6px !important;
}

.el-menu-item {
  margin: 6px 0;
}

.el-menu-item:first-child {
  margin-top: 0;
}

.el-menu-item:last-child {
  margin-bottom: 0;
}

.el-menu-item.is-active {
  background-color: rgba(var(--el-color-primary-rgb), 0.15);
  border-radius: 6px;
  padding: 10px 12px;
}

.el-menu-item:hover {
  //background-color: transparent !important;
  color: var(--el-color-primary-light-3);
  border-radius: 6px;
  padding: 10px 12px;
}

.donate-shadow {
  box-shadow: rgba(0, 0, 0, 0.03) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
</style>
