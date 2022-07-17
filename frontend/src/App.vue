<script setup lang="ts">
import { useAppInfoStore } from './stores/modules/appInfo';
import { useRouter } from "vue-router";
import { getToken } from './utils/auth';
import ipcRenderer from './utils/ipcRenderer';

const router = useRouter()

/* 加载应用配置信息 */
const appInfoStore = useAppInfoStore()
appInfoStore.load()

/* 判断是否已经登入 */
const token = getToken()
if(token){
  router.push({name: 'dashboard'})
}else{
  router.push({name: 'login'})
}

/* 监听credentials是否存在，用于判断客户端是否启动 */
ipcRenderer.ipc.on("controller.lcu.enable", (_event, data) => {
  appInfoStore.lcuEnable = data
});
</script>

<template>
  <router-view class="font-pingfang shadow-md select-none border rounded-md" />
</template>

<style lang="less">
@import url('@arco-themes/vue-gi-demo/index.less');
@import url(./style/font.css);
@import url(./style/common.css);
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  padding: 0 !important;
  margin: 0;
  // overflow: hidden;
  .size;
  #app {
    .size;
  }
  /* 圆框需要 不然圆角会有背景色*/
  background-color: rgba(0, 0, 0, 0);
  border-radius: 6px;
  // overflow: hidden;
}
</style>
