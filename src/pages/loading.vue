<template>
  <div class="check-launch-container user-drag">
    <div class="header">
      <div class="logo no-drag cursor-pointer" @click="goHome">
        <img src="../assets/logo.png">
      </div>
      <!-- btns -->
      <div class="icons">
        <div class="no-drag px-2 rounded-md hover:opacity-60 active:opacity-20"
             @click="ipcRenderer.send('app-quit', '')">
          <icon-close size="26" class="!text-light-700" />
        </div>
      </div>
    </div>
    <div class="logo-title text-[1.8rem] text-white"><span class="text-blue-400 font-bold mr-2 text-[2rem]">Tik</span>LeagueTool</div>
    <div class="lds-ellipsis mt-8"><div></div><div></div><div></div><div></div></div>
    <div class="text-white" >正在检查游戏客户端启动状态</div>
    <div class="footer">Copyright © 2022 XiaoWuYaYa Contributors</div>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer, shell } from "electron";

function goHome() {
  shell.openExternal($tools.HOME_URI)
}

</script>

<style lang="less" scoped>
.check-launch-container {
  background: #202124;
  background-size: cover;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo-title{
    letter-spacing: 0.175rem;
  }

  .header {
    width: 100%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    padding: 2px 0px 0px 8px;
    .logo {
      display: flex;
      align-items: center;
      img {
        width: 28px;
        height: 28px;
      }
    }
    .icons {
      display: flex;
      font-size: 24px;
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

  .loading-title-desc {
    margin-top: 20px;
    font-size: 14px;
    color: #C9CDD4;
  }

  .footer {
    font-size: 12px;
    position: absolute;
    bottom: 10px;
    color: #C9CDD4;
  }
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

</style>
