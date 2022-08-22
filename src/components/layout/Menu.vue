<template>
  <t-menu theme="light" width="180px" v-model="activeMenuItem" height="100%" >
    <t-menu-item value="home" :to="{name: 'home'}">
      <template #icon>
        <home-icon />
      </template>账号信息
    </t-menu-item>
    <t-menu-item value="panel" :to="{name: 'panel'}">
      <template #icon>
        <root-list-icon />
      </template>对局面板
    </t-menu-item>
    <t-menu-item value="history" :to="{name: 'history'}">
      <template #icon>
        <search-icon />
      </template>战绩查询
    </t-menu-item>
    <t-menu-item value="func" :to="{name: 'func'}">
      <template #icon>
        <control-platform-icon />
      </template>
      常用功能
    </t-menu-item>
    <t-menu-item value="autobp" :to="{name: 'autobp'}">
      <template #icon>
        <play-circle-stroke-icon />
      </template>自动禁选
    </t-menu-item>
    <t-menu-item value="blacklist" :to="{name: 'blacklist'}">
      <template #icon>
        <usergroup-clear-icon />
      </template>
      黑名单
    </t-menu-item>
    <t-menu-item value="champdata" :to="{name: 'champdata'}">
      <template #icon>
        <chart-icon />
      </template>
      英雄数据
    </t-menu-item>
    <t-menu-item value="setting" :to="{name: 'setting'}">
      <template #icon>
        <setting-icon />
      </template>设置
    </t-menu-item>
  </t-menu>
</template>

<script setup lang="ts">
import { ControlPlatformIcon, RootListIcon, HomeIcon, ChartIcon, UsergroupClearIcon, SearchIcon, SettingIcon, PlayCircleStrokeIcon } from 'tdesign-icons-vue-next'
import { ref } from 'vue';

const activeMenuItem = ref('home')


</script>
