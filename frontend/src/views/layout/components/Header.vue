<template>
  <div class="user-drag w-full flex items-center justify-between border-b-1">
    <!-- logo -->
    <div class="w-9 my-2 ml-3">
      <img src="@/assets/logo.png" />
    </div>
    <!-- title -->
    <span class="font-youshe font-medium subpixel-antialiased">
      <span class="text-24px mr-5px">Tik</span>
      <span class="text-26px">英雄联盟对局助手</span>
      <span class="text-16px"> V{{ appInfoStore.appVersion }} </span>
    </span>
    <!-- btns -->
    <div class="flex no-drag mr-1">
      <img
        class="
          w-32px
          cursor-pointer
          mx-2px
          p-6px
          hover:bg-gray-300
          redius
          rounded
        "
        src="@/assets/svgs/feedBack.svg"
        alt=""
      />
      <img
        class="
          w-32px
          cursor-pointer
          mx-2px
          p-6px
          hover:bg-gray-300
          redius
          rounded
        "
        src="@/assets/svgs/mini.svg"
        alt=""
        @click="handleMinisize"
      />
      <img
        class="
          w-32px
          cursor-pointer
          mx-2px
          p-6px
          hover:bg-gray-300
          redius
          rounded
        "
        src="@/assets/svgs/setting.svg"
        alt=""
      />
      <img
        class="
          w-32px
          cursor-pointer
          mx-2px
          p-6px
          hover:bg-gray-300
          redius
          rounded
        "
        src="@/assets/svgs/close.svg"
        alt=""
        @click="handleQuit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppInfoStore } from "@/stores/modules/appInfo";
import ipcRenderer from "@/utils/ipcRenderer";

const appInfoStore = useAppInfoStore();

const handleMinisize = () => {
  ipcRenderer.sendSync("controller.common.handleWindow", { btn: 0 });
};

const handleQuit = () => {
  ipcRenderer.sendSync("controller.common.handleWindow", { btn: 1, quitType: 0 });
}
</script>
