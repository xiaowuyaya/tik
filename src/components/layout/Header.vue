<template>
  <header class="p-2 h-16  flex justify-between items-center user-drag border-b ">
    <div class="flex items-center jusitify-between">
      <!-- LOGO -->
      <img class="w-10" src="@/assets/logo.png" />
      <!-- TITLE -->
      <div class="font-title text-[1.6rem] text-black ml-2">英雄联盟工具箱</div>
      <!-- HISTORY SEARCH -->
      <div class="w-[200px] ml-[6rem] no-drag">
        <t-input v-model="summonerSearch" size="medium" placeholder="搜索玩家战绩" @enter="searchSummoner">
          <template #prefix-icon>
            <search-icon @click="searchSummoner" />
          </template>
        </t-input>
      </div>
    </div>
    <!-- WINDOW BTNS -->
    <div class="flex justify-between items-center no-drag">
      <t-dropdown class="!mr-4" :options="userDropOptions" :minColumnWidth="110">
        <t-button tag="div" variant="text">
          <div class="tdesign-demo-dropdown__text">
            <t-avatar :image="userStore.avatarUrl" size='small' />
            <span class="mx-2">{{ userStore.nickName }}</span>
            <chevron-down-icon size="18" />
          </div>
        </t-button>
      </t-dropdown>
      <t-button class="!p-1 !mx-1" shape="square" variant="text" @click="ipcRenderer.send('mainWin.minisize')">
        <remove-icon size="2rem" color="#000" />
      </t-button>
      <t-button class="!p-1 !mx-1" shape="square" variant="text" @click="ipcRenderer.send('mainWin.close')">
        <close-icon size="2rem" color="#000" />
      </t-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { CloseIcon, SearchIcon, ChevronDownIcon, RemoveIcon } from 'tdesign-icons-vue-next'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const router = useRouter()

console.log(userStore.avatarUrl);


const summonerSearch = ref('')
const userDropOptions = ref([{
  content: '个人信息',
  value: 1,
  onClick: () => {
    router.push({ name: 'account' })
  }
}, {
  content: '退出登入',
  value: 2,
  onClick: () => { }
}])

const searchSummoner = () => {
  router.push({ name: 'history' })
}


</script>
<style lang="less">
@import url('@/style/drag.less');
</style>
