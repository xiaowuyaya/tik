<template>
  <div class="layout-container">
    <Header />
    <!-- body -->
    <div class="flex content">
      <!-- left-part -->
      <div class="h-full w-[18%] border-r">
        <!-- userinfo -->
        <div class="flex flex-col items-center pt-4 pb-1 mb-1">
          <img class="w-18 rounded-full cursor-pointer shadow" :src="userStore.avatarUrl" alt="加载异常" />
          <span class="mt-3 text-base cursor-pointer font-semibold">{{ userStore.nickName }}</span>
        </div>
        <!-- menu body -->
        <a-menu
          :style="{ height: '100%' }"
          :collapsed="false"
          :default-selected-keys="selectedKey"
          :selected-keys="selectedKey"
          show-collapse-button
          :accordion="true"
          breakpoint="xl"
          @menu-item-click="changePath"
        >
          <a-menu-item key="dashboard">
            <icon-dashboard />
            个人中心
          </a-menu-item>
          <a-menu-item key="panel">
            <icon-list />
            对局面板
          </a-menu-item>
          <a-menu-item key="func">
            <icon-apps />
            常用功能
          </a-menu-item>
          <a-menu-item key="auto-game">
            <icon-send />
            自动禁选
          </a-menu-item>
          <a-menu-item key="blacklist">
            <icon-user-group />
            黑名单
          </a-menu-item>
          <a-menu-item key="hero-data">
            <icon-bar-chart />
            英雄数据
          </a-menu-item>
          <a-menu-item key="send-settings">
            <icon-settings />
            发送设置
          </a-menu-item>
        </a-menu>
      </div>
      <router-view class="h-full w-full bg-custom-layout" v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user';
import { useAppInfoStore } from '@/stores/modules/appInfo';
import Header from './components/Header.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const appInfoStore = useAppInfoStore();
const router = useRouter();
const route = useRoute();

const selectedKey = ref<string[]>(['dashboard']);

onMounted(() => {
  /* 如果用户信息不存在 重新获取 */
  if (!userStore.username) {
    userStore.myInfo({
      mac: appInfoStore.macAddr,
      clientVersion: appInfoStore.appVersion,
    });
  }
});

// 监听路由变化 更改菜单选中
watch(
  () => route.name,
  (newRoute) => {
    selectedKey.value[0] = newRoute as any;
  },
);

const changePath = (name) => {
  router.push({ name });
};
</script>

<style scoped lang="scss">
.layout-container {
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-color: #fff;

  .content {
    height: calc(100% - 45px);
  }
}
</style>
