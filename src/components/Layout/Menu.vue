<template>
  <a-menu
      :style="{ 'padding-top': '10px' }"
      :collapsed="false"
      default-selected-keys="home"
      :accordion="true"
      @menu-item-click="changePath"
  >
    <a-menu-item key="home">
      <template #icon >
        <img src="@/assets/icon/dashboard.svg" class="w-7">
      </template>
      账号信息
    </a-menu-item>
    <a-menu-item key="panel">
      <template #icon >
        <img src="@/assets/icon/panel.svg" class="w-7">
      </template>
      对局面板
    </a-menu-item>
    <a-menu-item key="history">
      <template #icon >
        <img src="@/assets/icon/search.svg" class="w-7">
      </template>
      战绩查询
    </a-menu-item>
    <a-menu-item key="func">
      <template #icon >
        <img src="@/assets/icon/func.svg" class="w-7">
      </template>
      常用功能
    </a-menu-item>
    <a-menu-item key="blacklist">
      <template #icon >
        <img src="@/assets/icon/blacklist.svg" class="w-7">
      </template>
      黑名单
    </a-menu-item>
    <a-menu-item key="champdata">
      <template #icon >
        <img src="@/assets/icon/champ_data.svg" class="w-7">
      </template>
      英雄数据
    </a-menu-item>
    <a-menu-item key="chat">
      <template #icon >
        <img src="@/assets/icon/chat.svg" class="w-7">
      </template>
      人才市场
    </a-menu-item>
    <a-menu-item key="setting">
      <template #icon >
        <img src="@/assets/icon/setting.svg" class="w-7">
      </template>
      设置
    </a-menu-item>
  </a-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const changePath = (name: string) => {
  router.push({ name })
}
</script>
