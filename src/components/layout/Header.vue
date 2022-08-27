<template>
  <header class="p-2 h-16  flex justify-between items-center user-drag border-b ">
    <div class="flex items-center jusitify-between">
      <!-- LOGO -->
      <img class="w-10" src="@/assets/logo.png" />
      <!-- TITLE -->
      <div class="font-title text-[1.4rem] text-black ml-2">英雄联盟工具箱</div>
      <!-- HISTORY SEARCH -->
      <div class="w-[200px] ml-[6rem] no-drag">
        <a-input-search v-model="summonerSearch" placeholder="快速搜索玩家战绩" @search="searchSummoner"
          @enter="searchSummoner" />
      </div>
    </div>
    <!-- WINDOW BTNS -->
    <div class="flex justify-between items-center no-drag">
      <a-dropdown class="!mr-4" @select="handleSelectDropdown">
        <a-button type="text">
          <div class="flex  items-center justify-center">
            <a-avatar :size="26">
              <img :src="userStore.avatarUrl" />
            </a-avatar>
            <span class="mx-2 text-gray-900">{{ userStore.nickName }}</span>
            <icon-down class="!text-gray-900" />
          </div>
        </a-button>
        <template #content>
          <a-doption value="0"><span class="mx-2">账号信息</span></a-doption>
          <a-doption value="1"><span class="text-red-500 mx-2">退出登入</span></a-doption>
        </template>
      </a-dropdown>

      <a-button class="!p-1 !mr-1 !ml-4" type="text" @click="ipcRenderer.send('mainWin.minisize')">
        <template #icon>
          <icon-minus />
        </template>
      </a-button>
      <a-button class="!p-1 !mx-1" type="text" @click="handleQuitModal">
        <template #icon>
          <icon-close />
        </template>
      </a-button>
    </div>
     <!-- 退出确认框 -->
    <a-modal v-model:visible="showQuitModal" width="40%" title="关闭窗口方式（设置中可更改）" draggable okText="确定并记住选择" @ok="handleQuit">
      <a-radio-group v-model="configStore.quitMethod" direction="vertical">
        <a-radio value="1">关闭窗口至系统托盘</a-radio>
        <a-radio value="0">退出应用程序</a-radio>
      </a-radio-group>
    </a-modal>
  </header>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const configStore = useConfigStore()
const router = useRouter()

const showQuitModal = ref(false);
const summonerSearch = ref('')


const handleSelectDropdown = (select: any) => {
  if(select == '0') {
    router.push({name: 'account'})
  }
  if(select == '1'){

    userStore.logout()
  }
}

const searchSummoner = () => {
  saveRencentlySearchList(summonerSearch.value)
  router.push({ path: '/search-content', query: { summonerName: summonerSearch.value } })
}

const saveRencentlySearchList = (summonerName: string) => {
  let data = JSON.parse(localStorage.getItem('rencently:summoner:search') as string)
  const isExit = _.findIndex(data, (item: string) => { return item == summonerName })
  if (isExit != -1) return
  data.push(summonerName)
  localStorage.setItem('rencently:summoner:search', JSON.stringify(data))
}

const handleQuitModal = () => {
  if ( configStore.rememberQuit ){
    ipcRenderer.send('mainWin.close')
  }else{
    showQuitModal.value = true
  }
}

const handleQuit = () => {
  configStore.rememberQuit = true;
  configStore.changeConfig()
  ipcRenderer.send('mainWin.close')
};

</script>
<style lang="less">
@import url('@/style/drag.less');
</style>
