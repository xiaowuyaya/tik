<template>
  <div class="h-full w-full main-container bg-white">
    <a-layout style="height: 100%">
      <a-layout-header>
        <LayoutHeader />
      </a-layout-header>
      <a-layout>
        <a-layout-sider :width="180">
          <LayoutMenu />
        </a-layout-sider>
        <a-layout-content class="layout-content p-2">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from './Header.vue'
import LayoutMenu from './Menu.vue'

</script>
<style lang="less">
  .layout-content {
    background-color: #f8fafc;
  }
</style>