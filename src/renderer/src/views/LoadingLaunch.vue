<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

const router = useRouter()
const { electron } = window

const message = reactive({ code: 0, msg: '' })

electron.ipcRenderer.removeAllListeners('player-status')
electron.ipcRenderer.on('loading_launch_message', (_, data) => {
  const { code, msg } = data
  message.code = code
  message.msg = msg

  if (code === 1) {
    router.push('/SummonerInfo')
  }
})

const startServer = () => {
  electron.ipcRenderer.send('start_server', '')
}

function exitApp() {
  window.electron.ipcRenderer.send('exit-app', '')
}

// 启动服务
startServer()
</script>

<template>
  <div class="loading-launch-container h-full flex flex-col justify-center items-center font-sans user-drag">
    <el-button class="absolute top-4 right-4 !no-drag" circle :icon="Close" @click="exitApp" />
    <img class="absolute top-4 left-4 w-12 !no-drag" src="../assets/logo.png" alt="" />
    <h1 class="mt-[-6rem] inline font-bold bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-[5rem] text-transparent">TikLeagueTool</h1>
    <p class="mt-1 text-xl tracking-tight text-slate-400">这可能是你用过最简单舒适的英雄联盟全功能助手</p>
    <div class="absolute bottom-[20vh] flex flex-col justify-center items-center no-drag">
      <div class="loading-icon mt-[6.5rem]"></div>
      <p :class="[message.code === 1 ? 'text-green-500' : message.code === -1 ? 'text-red-500' : 'text-slate-300', 'mt-6']">
        {{ message.msg }}
      </p>
      <div class="mt-2" v-show="message.code === -1">
        <a class="text-slate-400 mx-2 cursor-pointer" @click="startServer"><u>重新获取</u></a>
        <a class="text-slate-400 mx-2 cursor-pointer" @click="router.push('/SummonerInfo')"><u>无功能模式</u></a>
      </div>
    </div>
    <div class="tracking-tight text-slate-400 text-sm absolute bottom-2">
      <span>Copyright © 2022 - {{ new Date().getFullYear() }} <i>xiaowuyaya</i> Contributors.</span>
      <span class="mx-2">|</span>
      <span class="text-xs">仅供个人学习研究和交流使用，请于下载后二十四小时内删除</span>
    </div>
  </div>
</template>

<style lang="less">
.loading-launch-container {
  background: #0e1015; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #243b55, #202020, #141e30, #232526); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #243b55, #202020, #141e30, #232526); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  background-size: 500% 500%;
  animation: gradientBG 4500ms ease infinite;

  .loading-icon {
    position: relative;
    width: 40px;
    height: 40px;
    border: 4px solid rgba(199, 210, 254, var(--tw-from-opacity, 1));
    border-top-color: rgba(0, 0, 0, 0.4);
    border-right-color: rgba(0, 0, 0, 0.4);
    border-bottom-color: rgba(0, 0, 0, 0.4);
    border-radius: 100%;
    animation: circle infinite 0.75s linear;
  }
}

@keyframes gradientBG {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
