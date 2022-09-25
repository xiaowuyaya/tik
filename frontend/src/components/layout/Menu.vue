<template>
  <a-menu
    :style="{ height: '100%', 'padding-top': '8px' }"
    :collapsed="false"
    default-selected-keys="home"
    :accordion="true"
    @menu-item-click="changePath"
  >
    <a-menu-item key="home">
      <icon-dashboard />
      账号信息
    </a-menu-item>
    <a-menu-item key="panel">
      <icon-list />
      对局面板
    </a-menu-item>
    <a-menu-item key="history">
      <icon-search />
      战绩查询
    </a-menu-item>
    <a-menu-item key="func">
      <icon-apps />
      常用功能
    </a-menu-item>
    <a-menu-item key="autobp">
      <icon-send />
      自动禁选
    </a-menu-item>
    <a-menu-item key="blacklist">
      <icon-user-group />
      黑名单
    </a-menu-item>
    <a-menu-item key="champdata">
      <icon-bar-chart />
      英雄数据
    </a-menu-item>
    <a-menu-item key="setting">
      <icon-settings />
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
