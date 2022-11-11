<template>
  <div class="logo-title-container ">
    <img class="logo-img cursor-pointer" src="../assets/logo.png" @click="shell.openExternal(HOME_URI)">
    <div class="logo-title">英雄联盟对局助手</div>
  </div>
</template>

<script setup lang="ts">
import { shell } from 'electron'

const HOME_URI = $consts.HOME_URI

</script>

<style lang="less">
.logo-title-container {
  height: 48px;
  // width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  background-color: rgba(0, 0, 0, 0) ;

  .logo-img {
    width: 36px;
    height: 36px;
    -webkit-app-region: none !important;
  }

  .logo-title{
    font-size: 22px;
    margin-left: 10px;
    color: var(--color-text-1);
    font-family: YouShe;
  }
}

</style>
