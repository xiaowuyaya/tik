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
          <a-doption><span class="mx-2">账号信息</span></a-doption>
          <a-doption><span class="text-red-500 mx-2">退出登入</span></a-doption>
        </template>
      </a-dropdown>

      <a-button class="!p-1 !mr-1 !ml-4" type="text" @click="ipcRenderer.send('mainWin.minisize')">
        <template #icon>
          <icon-minus />
        </template>
      </a-button>
      <a-button class="!p-1 !mx-1" type="text" @click="ipcRenderer.send('mainWin.close')">
        <template #icon>
          <icon-close />
        </template>
      </a-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const router = useRouter()

const summonerSearch = ref('')


const handleSelectDropdown = (e: any) => {
  console.log(e);

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



</script>
<style lang="less">
@import url('@/style/drag.less');
</style>
