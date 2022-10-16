<template>
  <header class="p-2 !h-16 flex justify-between items-center user-drag border-b bg-white">

    <div class="flex justify-between items-center">
      <!-- logo -->
      <AppLogo />
      <!-- 搜索框 -->
      <div class="w-[254px] ml-[6rem] no-drag">
        <a-input-search v-model="summonerSearch" placeholder="快速搜索玩家战绩" @search="searchSummoner"
          @enter="searchSummoner" />
      </div>
    </div>

    <!-- 按钮区 -->
    <div class="flex justify-between items-center no-drag">
      <!-- 用户头像 -->
      <a-dropdown class="!mr-4" @select="handleSelectDropdown">
        <a-avatar class="cursor-pointer mr-2" :size="32">
          <img :src="userStore.avatarUrl" />
        </a-avatar>

        <template #content>
          <a-doption value="0"><span class="mx-2">账号信息</span></a-doption>
          <a-doption value="1"><span class="text-red-500 mx-2">退出登入</span></a-doption>
        </template>
      </a-dropdown>

      <a-divider direction="vertical" />
      <!-- 按钮组 -->
      <a-button class="!p-1 !mx-1" type="text" @click="ipcRenderer.send('main-shrink', '')">
        <template #icon>
          <icon-shrink />
        </template>
      </a-button>
      <a-button class="!p-1 !mx-1" type="text" @click="handleQuitModal">
        <template #icon>
          <icon-close />
        </template>
      </a-button>
    </div>

    <!-- 退出确认框 -->
    <a-modal v-model:visible="showQuitModal" width="40%" title="选择关闭窗口方式（设置中可更改）" draggable okText="确定并记住选择"
      @ok="handleQuit">
      <a-radio-group @change="changeQuitOption" direction="vertical">
        <a-radio value="1">关闭窗口至系统托盘</a-radio>
        <a-radio value="0">退出应用程序</a-radio>
      </a-radio-group>
    </a-modal>
  </header>
</template> 

<script setup lang="ts">
import AppLogo from '../../../components/AppLogo.vue'
import _ from 'lodash'
import { useUserStore } from '../../../store/user'
import { ipcRenderer } from 'electron'
import { useRouter } from 'vue-router'
import { ref } from 'vue';

const router = useRouter()
const userStore = useUserStore()

const showQuitModal = ref(false)
const summonerSearch = ref('')

function handleSelectDropdown(select: any) {
  if (select == '0') {
    router.push({ name: 'account' })
  }
  if (select == '1') {
    userStore.userLogout()
  }
}

function searchSummoner() {
  saveRencentlySearchList(summonerSearch.value)
  router.push({ path: '/search-content', query: { summonerName: summonerSearch.value } })
}

function saveRencentlySearchList(summonerName: string) {
  let data = JSON.parse(localStorage.getItem('rencently:summoner:search') as string)
  const isExit = _.findIndex(data, (item: string) => {
    return item == summonerName
  })
  if (isExit != -1) return
  data.push(summonerName)
  localStorage.setItem('rencently:summoner:search', JSON.stringify(data))
}

function handleQuitModal() {
  const rememberQuit = $store.appStore.get('app.rememberQuit')
  if (rememberQuit) {
    quitService()
  } else {
    showQuitModal.value = true
  }
}

function changeQuitOption(select: string) {
  $store.appStore.set('app.quitMethod', select)
}

function handleQuit() {
  $store.appStore.set('app.rememberQuit', true)
  quitService()
}

function quitService() {
  const quitType = $store.appStore.get('app.quitMethod')
  if (quitType == 0) ipcRenderer.send('main-shrink', '')
  if (quitType == 1) ipcRenderer.send('main-hide', '')
}


</script>