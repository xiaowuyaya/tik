<template>
  <div class="user-drag w-full flex items-center justify-between border-b-1">
    <!-- logo -->
    <div class="w-9 my-1 ml-3">
      <img src="@/assets/logo.png" />
    </div>
    <!-- title -->
    <span class="font-youshe font-medium subpixel-antialiased">
      <span class="text-24px mr-5px">Tik</span>
      <span class="text-26px">英雄联盟对局助手</span>
      <span class="ml-1 text-16px">V{{ appInfoStore.appVersion }}</span>
    </span>
    <!-- btns -->
    <div class="flex no-drag mr-1">
      <img
        class="Pshake w-32px cursor-pointer mx-2px p-6px hover:bg-gray-300 redius rounded"
        src="@/assets/svgs/donate.svg"
        @click="openUrl('https://lol-tool.com/donate')"
      />
      <img class="w-32px cursor-pointer mx-2px p-6px hover:bg-gray-300 redius rounded" src="@/assets/svgs/mini.svg" @click="handleMinisize" />
      <img
        class="w-32px cursor-pointer mx-2px p-6px hover:bg-gray-300 redius rounded"
        src="@/assets/svgs/setting.svg"
        @click="showSettingsDrawer = !showSettingsDrawer"
      />
      <img class="w-32px cursor-pointer mx-2px p-6px hover:bg-gray-300 redius rounded" src="@/assets/svgs/close.svg" @click="handleQuitModal" />
    </div>
    <!-- 退出确认框 -->
    <a-modal v-model:visible="showQuitModal" width="40%" title="关闭窗口方式" draggable okText="确定并记住选择" @ok="handleQuit">
      <a-radio-group v-model="settingsStore.app.quit" direction="vertical">
        <a-radio value="1">关闭窗口至系统托盘</a-radio>
        <a-radio value="0">退出应用程序</a-radio>
      </a-radio-group>
    </a-modal>
    <!-- 应用设置抽屉 -->
    <a-drawer
      v-model:visible="showSettingsDrawer"
      title="应用设置"
      width="35%"
      :closable="false"
      popup-container="#main"
      :drawer-style="{ 'border-bottom-right-radius': '0.375rem', 'border-top-right-radius': '0.375rem', 'z-index': '99' }"
    >
      <div class="font-black text-base text-gray-700 border-b py-2 mt-2 mx-4">通用</div>

      <a-row class="py-1.2" :gutter="12" align="center" justify="center">
        <a-col :span="6" class="font-medium">关闭按钮</a-col>
        <a-col :span="16">
          <a-radio-group v-model="settingsStore.app.quit" type="button" @change="settingsStore.syncLocal">
            <a-radio value="1">最小化到托盘</a-radio>
            <a-radio value="0">退出应用程序</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row class="py-1.2" :gutter="12" align="center" justify="center">
        <a-col :span="6" class="">当前版本</a-col>
        <a-col :span="8">
          <span>{{ appInfoStore.appVersion }}</span>
        </a-col>
        <a-col :span="8">
          <a-button type="text" @click="handleUpdate">检查更新</a-button>
        </a-col>
      </a-row>
      <a-row class="py-1.2" :gutter="12" align="center" justify="center">
        <a-col :span="6" class="">设备编码</a-col>
        <a-col :span="8">
          <span>{{ appInfoStore.macAddr }}</span>
        </a-col>
        <a-col :span="8">
          <a-button type="text" @click="copyToClipboard(appInfoStore.macAddr)">点击复制</a-button>
        </a-col>
      </a-row>
      <a-row class="py-1.2" :gutter="12" align="center" justify="center">
        <a-col :span="6" class="">交流反馈</a-col>
        <a-col :span="8">
          <span>914241626</span>
        </a-col>
        <a-col :span="8">
          <a-button type="text" @click="openUrl(qunLink)">点击加群</a-button>
        </a-col>
      </a-row>

      <div class="font-black text-base text-gray-700 border-b py-2 mt-2 mx-4">调试</div>

      <a-row class="py-1.2" :gutter="12" align="center" justify="center">
        <a-col :span="6" class="">日志路径</a-col>
        <a-col :span="8">
          <div class="truncate w-full">{{ appInfoStore.logDir }}</div>
        </a-col>
        <a-col :span="8">
          <a-button type="text" @click="openPath(appInfoStore.logDir)">打开路径</a-button>
        </a-col>
      </a-row>
      <a-row class="py-1.2" :gutter="12" align="center" justify="center">
        <a-col :span="6" class="">配置路径</a-col>
        <a-col :span="8">
          <div class="truncate w-full">{{ appInfoStore.configDir }}</div>
        </a-col>
        <a-col :span="8">
          <a-button type="text" @click="openPath(appInfoStore.configDir)">打开路径</a-button>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { openUrl, openPath, copyToClipboard } from '@/utils/tools';
import { useAppInfoStore } from '@/stores/modules/appInfo';
import { useSettingsStore } from '@/stores/modules/settings';
import ipcRenderer from '@/utils/ipcRenderer';
import { onMounted, ref } from 'vue';
import { Message } from '@arco-design/web-vue';

const appInfoStore = useAppInfoStore();
const settingsStore = useSettingsStore();

const qunLink = 'https://qm.qq.com/cgi-bin/qm/qr?k=9HNfbMmM3ISfaX2YBjyJrD5r_Xgt8Bio&jump_from=webapi';
const showQuitModal = ref(false);
const showSettingsDrawer = ref(false);

onMounted(() => {
  // 监听update事件
  ipcRenderer.ipc.removeAllListeners('controller.application.listenUpdateInfo');
  ipcRenderer.ipc.on('controller.application.listenUpdateInfo', (_event, data) => {
    Message[data.type]({
      content: data.msg,
      duration: 1500,
    })
  });
});

const handleMinisize = () => {
  ipcRenderer.sendSync('controller.common.handleWindow', { btn: 0 });
};

const handleQuitModal = () => {
  console.log(settingsStore.app.rememberQuit);

  if (!settingsStore.app.rememberQuit) {
    showQuitModal.value = true;
    return;
  }
  ipcRenderer.sendSync('controller.common.handleWindow', { btn: 1, quitType: settingsStore.app.quit });
};

const handleQuit = () => {
  settingsStore.app.rememberQuit = true;
  settingsStore.syncLocal();
  ipcRenderer.sendSync('controller.common.handleWindow', { btn: 1, quitType: settingsStore.app.quit });
};

const handleUpdate = () => {
  ipcRenderer.sendSync('controller.common.checkUpdate', { });
}
</script>

<style>
.Pshake {
  display: inline-block;
  -webkit-transform-origin: center center;
  -ms-transform-origin: center center;
  transform-origin: center center;
  -webkit-animation: Pshake_Crazy 1s ease-in-out infinite;
  animation: Pshake_Crazy 1s ease-in-out infinite;
}

@keyframes Pshake_Crazy {
  /* 10% {
    transform: translate(-0.5px, -0.5px) rotate(0.5deg);
  } */
  20% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }
  /* 30% {
    transform: translate(1.5px, 0.5px) rotate(0.5deg);
  } */
  40% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }
  /* 50% {
    transform: translate(2.5px, 1.5px) rotate(1.5deg);
  } */
  60% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }
  /* 70% {
    transform: translate(-0.5px, 2.5px) rotate(1.5deg);
  } */
  80% {
    transform: translate(2.5px, -1.5px) rotate(-0.5deg);
  }
  /* 90% {
    transform: translate(1.5px, -0.5px) rotate(1.5deg);
  } */
  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }
}
</style>
