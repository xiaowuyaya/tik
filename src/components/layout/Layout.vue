<template>
  <div class="h-full w-full main-container">
    <t-layout class="!h-full">
      <t-header height="56px">
        <LayoutHeader />
      </t-header>
      <t-layout>
        <t-aside width="180px">
          <LayoutMenu />
        </t-aside>
        <t-layout>
          <t-content class="p-2">
            <router-view></router-view>
          </t-content>
        </t-layout>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from './Header.vue'
import LayoutMenu from './Menu.vue'

</script>

<style lang="less">
.main-container {
  // z-index: 99;
  // background: url('@/assets/main-bg.png');
  // opacity: 0.94;
  // background-size: cover
}
</style>
