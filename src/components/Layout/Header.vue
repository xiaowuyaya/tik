<template>
  <header class="layout-header-container p-2 !h-16 flex justify-between items-center user-drag">

    <div class="flex justify-between items-center !no-drag">
      <!-- logo -->
      <AppLogo />
      <!-- 上下 -->
      <div class="ml-10 no-drag">
        <a-button class="!p-1 !mx-3" type="text" shape="round" size="large" @click="router.go(-1)">
          <template #icon>
            <icon-arrow-left style="{ font-size: 37; stroke-linecap: square;  stroke-width: 4; }" size="20"/>
          </template>
        </a-button>

        <a-button class="!p-1 !mx-3" type="text" shape="round" size="large" @click="router.go(1)">
          <template #icon>
            <icon-arrow-right style="{ font-size: 37; stroke-linecap: square;  stroke-width: 4; }" size="20"/>
          </template>
        </a-button>
      </div>
      <!-- 搜索框 -->
      <div class="w-[268px] ml-[6rem] no-drag">
        <a-input-search size="large" v-model="summonerSearch" placeholder="快速搜索玩家战绩" @search="searchSummoner"
          @pre="searchSummoner" />
      </div>
    </div>

    <!-- 按钮区 -->
    <div class="flex justify-between items-center no-drag">
      <!-- 用户头像 -->
      <a-dropdown class="!mr-4" @select="handleSelectDropdown">

        <a-avatar v-if="userStore.avatarUrl" class="cursor-pointer mr-2" :size="32">
          <img :src="userStore.avatarUrl" />
        </a-avatar>
        <a-avatar v-if="!userStore.avatarUrl" class="cursor-pointer mr-2" :size="32" :style="{ backgroundColor: '#3370ff' }">
          <IconUser />
        </a-avatar>

        <template #content>
          <a-doption value="0"><span class="mx-2" style="color: var(--color-text-1)">账号信息</span></a-doption>
          <a-doption value="1"><span class="text-red-500 mx-2">退出登入</span></a-doption>
        </template>
      </a-dropdown>

      <a-divider direction="vertical" />
      <!-- 按钮组 -->
      <a-button class="!p-1 !mx-1" type="text" @click="changeTheme">
        <template #icon>
          <component :is="themeIcon"></component>
        </template>
      </a-button>
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
import AppLogo from '@/components/Logo.vue'
import _ from 'lodash'
import { useUserStore } from '@/store/user'
import { ipcRenderer } from 'electron'
import { useRouter } from 'vue-router'
import {onBeforeMount, onMounted, ref} from 'vue';
import {IconMoon, IconSun} from "@arco-design/web-vue/es/icon";
import {Message} from "@arco-design/web-vue";

const router = useRouter()
const userStore = useUserStore()

const showQuitModal = ref(false)
const summonerSearch = ref('')

const themeIcon = ref(IconMoon)

onBeforeMount(()=>{
  const theme = document.body.getAttribute("arco-theme")
  if(theme == 'light' || theme == null){
    themeIcon.value = IconMoon
  }else {
    themeIcon.value = IconSun
  }
})

function changeTheme(){
  const theme = document.body.getAttribute("arco-theme")
  console.log(theme)
  if(theme == 'light' || theme == null){
    document.body.setAttribute('arco-theme', 'dark');
    themeIcon.value = IconSun
  }else {
    document.body.setAttribute('arco-theme', 'light');
    themeIcon.value = IconMoon
  }
}


function handleSelectDropdown(select: any) {
  if (select == '0') {
    router.push({ name: 'account' })
  }
  if (select == '1') {
    userStore.userLogout()
  }
}

async function searchSummoner() {
  saveRencentlySearchList(summonerSearch.value)
  const summoner: any = await $api.getSummonerInfoBySummonerName(summonerSearch.value)
  console.log(summoner)
  if (!(summoner.errorCode && summoner.errorCode === 'RPC_ERROR')){ // 判断这个名字是否存在
    router.push({ path: '/search-content', query: { summonerName: summonerSearch.value } })
  } else{
    Message.error('当前搜索的玩家不存在，或是不在当前大区')
  }

}

function saveRencentlySearchList(summonerName: string) {
  let data = JSON.parse(localStorage.getItem('rencently:summoner:search') as string) || []
  const isExit = _.findIndex(data, (item: string) => {
    return item == summonerName
  })
  if (isExit == -1){
    data.push(summonerName)
    localStorage.setItem('rencently:summoner:search', JSON.stringify(data))
  }
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

<style lang="less">
.layout-header-container{
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
}

</style>