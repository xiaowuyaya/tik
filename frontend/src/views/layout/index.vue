<template>
  <div class="layout-container">
    <Header />
    <!-- body -->
    <div class="flex h-full">
      <!-- left-part -->
      <div class="h-full w-[18%] border-r">
        <!-- userinfo -->
        <div class="flex flex-col items-center pt-4 pb-1 mb-1">
          <img
            class="w-18 rounded-full cursor-pointer shadow"
            :src="userStore.avatarUrl"
            alt="加载异常"
          />
          <span class="mt-3 text-base cursor-pointer font-semibold">{{
            userStore.nickName
          }}</span>
        </div>
        <a-button type="primary">Primary</a-button>
        <!-- menu body -->
        <a-menu
          :style="{ height: '100%' }"
          :collapsed="false"
          :default-open-keys="['0']"
          :default-selected-keys="['0_2']"
          show-collapse-button
          breakpoint="xl"
        >
          <a-sub-menu key="0">
            <template #icon><icon-apps></icon-apps></template>
            <template #title>Navigation 1</template>
            <a-menu-item key="0_0">Menu 1</a-menu-item>
            <a-menu-item key="0_1">Menu 2</a-menu-item>
            <a-menu-item key="0_2">Menu 3</a-menu-item>
            <a-menu-item key="0_3">Menu 4</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="1">
            <template #icon><icon-bug></icon-bug></template>
            <template #title>Navigation 2</template>
            <a-menu-item key="1_0">Menu 1</a-menu-item>
            <a-menu-item key="1_1">Menu 2</a-menu-item>
            <a-menu-item key="1_2">Menu 3</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="2">
            <template #icon><icon-bulb></icon-bulb></template>
            <template #title>Navigation 3</template>
            <a-menu-item key="2_0">Menu 1</a-menu-item>
            <a-menu-item key="2_1">Menu 2</a-menu-item>
            <a-sub-menu key="2_2" title="Navigation 4">
              <a-menu-item key="2_2_0">Menu 1</a-menu-item>
              <a-menu-item key="2_2_1">Menu 2</a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
        </a-menu>
      </div>
    </div>
    <router-view class="bg-white" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import { useAppInfoStore } from "@/stores/modules/appInfo";
import Header from "./components/Header.vue";
import { IconApps, IconBug, IconBulb } from "@arco-design/web-vue/es/icon";

const userStore = useUserStore();
const appInfoStore = useAppInfoStore();

/* 如果用户信息不存在 重新获取 */
if (!userStore.username) {
  userStore.myInfo({
    mac: appInfoStore.macAddr,
    clientVersion: appInfoStore.appVersion,
  });
}
</script>

<style scoped lang="scss">
.layout-container {
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>