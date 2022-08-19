<template>
  <t-menu theme="light" width="180px" value="dashboard" height="100%">
    <t-menu-item value="dashboard">
      <template #icon>
        <home-icon />
      </template>账号信息
    </t-menu-item>
    <t-menu-item value="resource">
      
     <template #icon>
        <root-list-icon />
      </template>对局面板
    </t-menu-item>
    <t-menu-item value="root">
      <template #icon>
        <search-icon />
      </template>战绩查询
    </t-menu-item>
    <t-menu-item value="control-platform">
      <template #icon>
        <control-platform-icon />
      </template>
      常用功能
    </t-menu-item>
    <t-menu-item value="precise-monitor">
      
     <template #icon>
        <play-circle-stroke-icon />
      </template>自动禁选
    </t-menu-item>
    <t-menu-item value="mail">
      <template #icon>
        <usergroup-clear-icon />
      </template>
      黑名单
    </t-menu-item>
    <t-menu-item value="user-circle">
      <template #icon>
        <chart-icon />
      </template>
      英雄数据
    </t-menu-item>
    <t-menu-item value="play-circle">
      
      <template #icon>
        <setting-icon />
      </template>设置
    </t-menu-item>
  </t-menu>
</template>

<script setup lang="ts">
import { ControlPlatformIcon, RootListIcon, HomeIcon, ChartIcon, UsergroupClearIcon, SearchIcon, SettingIcon,PlayCircleStrokeIcon  } from 'tdesign-icons-vue-next'


</script>
