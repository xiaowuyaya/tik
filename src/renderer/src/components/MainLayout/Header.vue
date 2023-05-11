<script setup>
import { ArrowLeft, ArrowRight, Refresh, Search, Moon, Sunny, Close, Minus } from '@element-plus/icons-vue'
import { inject, ref } from 'vue'

import { useDark, useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { saveRecentlySearchList } from '../../utils'

const router = useRouter()
const reload = inject('reload')

function layoutReload(){
  $cache.del('panelData')
  reload()
}

// 主题切换
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 搜索文本
const searchSummonerName = ref('')
const showCloseModal = ref(false)
const closeType = ref(0)

function winMinimize() {
  $winManage.global.main.minimize()
}

async function handleSearch() {
  searchSummonerName.value = searchSummonerName.value.trim()
  if (searchSummonerName.value == '') {
    ElMessage.warning('搜索的玩家游戏名称不能为空哦')
    return
  }
  const summoner = (await $api.getSummonerInfoBySummonerName(searchSummonerName.value)) || { errorCode: 'RPC_ERROR' }
  if (!(summoner.errorCode && summoner.errorCode === 'RPC_ERROR')) {
    // 判断这个名字是否存在
    saveRecentlySearchList(searchSummonerName.value)
    // notice: 如果当前路由在 summoner_info 无法使用push, 这边先跳其他地方在转回来
    router.push('/RecordQuery').then(() => {
      router.push({ path: '/SummonerInfo', query: { summonerName: searchSummonerName.value } })
    })
  } else {
    ElMessage.error('当前搜索的玩家不存在，或是不在当前大区')
  }
}

function confirmCloseModal() {
  $store.appConfigStore.set('close.remember', true)
  $store.appConfigStore.set('close.type', closeType.value)
  handleClose()
}

function handleClose() {
  const remember = $store.appConfigStore.get('close.remember')
  if (remember) {
    const quitType = $store.appConfigStore.get('close.type')
    console.log(quitType)
    if (quitType == 0) window.electron.ipcRenderer.send('exit-app', '')
    if (quitType == 1) window.electron.ipcRenderer.send('main-hide', '')
  } else {
    showCloseModal.value = true
  }
}
</script>

<template>
  <div class="no-drag">
    <el-space class="px-5" size="large">
      <el-button plain text :icon="ArrowLeft" circle @click="router.go(-1)" />
      <el-button plain text :icon="ArrowRight" circle @click="router.go(1)" />
      <el-button plain text :icon="Refresh" circle @click="layoutReload" />
    </el-space>

    <el-input v-model="searchSummonerName" placeholder="请输入需要搜索的玩家名" class="!w-[286px]">
      <template #append>
        <el-button @click="handleSearch" :icon="Search" />
      </template>
    </el-input>
  </div>

  <div class="no-drag">
    <el-button plain text circle :icon="isDark ? Sunny : Moon" @click="toggleDark()" />
    <el-button plain text circle :icon="Minus" @click="winMinimize" />
    <el-button plain text circle :icon="Close" @click="handleClose" />
  </div>

  <el-dialog v-model="showCloseModal" width="33%" title="当点击关闭时" align-center draggable>
    <div class="w-full flex justify-center">
      <el-radio-group v-model="closeType">
        <el-radio :label="1" border>关闭窗口至系统托盘</el-radio>
        <el-radio :label="0" border>退出应用程序</el-radio>
      </el-radio-group>
    </div>
    <template #footer>
      <el-button @click="showCloseModal = false">取消</el-button>
      <el-button type="primary" @click="confirmCloseModal"> 确定并保存 </el-button>
    </template>
  </el-dialog>
</template>

<style lang="less"></style>
