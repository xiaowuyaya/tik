<template>
  <div class="check-launch-container user-drag">
    <div class="header">
      <div class="logo no-drag cursor-pointer" @click="goHome">
        <img src="../assets/logo.png">
        <div class="title">英雄联盟对局助手</div>
      </div>
      <!-- btns -->
      <div class="icons">
        <div class="no-drag px-2 rounded-md hover:opacity-60 active:opacity-20"
          @click="ipcRenderer.send('app-quit', '')">
          <icon-close size="26" class="!text-light-700" />
        </div>
      </div>
    </div>
    <!-- loading animation -->
    <div class="lds-ripple">
      <div></div>
      <div></div>
    </div>
    <div v-show="!isClientLaunch" class="loading-title ld ld-dim" style="animation-duration:2.0s">正在等待游戏客户端启动...</div>
    <div v-show="isClientLaunch" class="loading-title">检测到客户端启动！</div>
    <div class="loading-title-desc">请先以管理员方式运行助手后再启动登入英雄联盟客户端或<span class="px-1 text-red-500 cursor-pointer no-drag"
        @click="router.push('/home')">强行进入</span>，如有问题请加群联系管理（群见官网）</div>
    <div class="loading-title-desc">个人项目，如果你喜欢这个项目，不妨<span class="px-1 text-red-500 cursor-pointer no-drag"
        @click="goDonate">赞助一下</span>开发者喝杯咖啡 </div>
    <div class="footer">Copyright © 2022-present XiaoWuYaYa & www.lol-tool.com Contributors</div>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer, shell } from "electron";
import { getToken } from "../utils";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()

const isClientLaunch = ref(false)

ipcRenderer.on('keep-alive', (data) => {
  isClientLaunch.value = true
  const token = getToken()
  if (token) {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'login' })
  }
})

function goHome() {
  shell.openExternal($tools.HOME_URI)
}

function goDonate() {
  shell.openExternal(`${$tools.HOME_URI}/donate`)
}

</script>

<style lang="less" scoped>
.check-launch-container {
  background: url('../assets/check_launch_bg.png');
  background-size: cover;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .header {
    width: 100%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    padding: 10px;

    .logo {
      display: flex;
      align-items: center;

      img {
        width: 48px;
        height: 48px;
      }

      .title {
        margin-left: 10px;
        font-size: 28px;
        font-family: YouShe;
        color: #F2F3F5;
      }
    }

    .icons {
      display: flex;
      font-size: 28px;
      color: #FFF;

      // .icons-close {}

      .icons-close:hover {
        opacity: 0.6 !important;
      }

      .icons-close:active {
        opacity: 0.2;
      }
    }
  }


  .loading-title {
    margin-top: 10px;
    color: #FFF;
    font-size: 26px;
    font-weight: 500;
  }

  .loading-title-desc {
    margin-top: 5px;
    font-size: 14px;
    color: #C9CDD4;
  }

  .footer {
    position: absolute;
    bottom: 10px;
    color: #C9CDD4;
  }
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 120px;
  height: 120px;
}

.lds-ripple div {
  position: absolute;
  border: 4px solid #5191d9;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 54px;
    left: 54px;
    width: 0;
    height: 0;
    opacity: 0;
  }

  4.9% {
    top: 54px;
    left: 54px;
    width: 0;
    height: 0;
    opacity: 0;
  }

  5% {
    top: 54px;
    left: 54px;
    width: 0;
    height: 0;
    opacity: 1;
  }

  100% {
    top: 0px;
    left: 0px;
    width: 108px;
    height: 108px;
    opacity: 0;
  }
}
</style>
