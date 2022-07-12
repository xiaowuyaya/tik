<template>
  <div class="login-container">
    <div class="flex flex-row h-full">
      <!-- 左半部分 -->
      <div
        class="no-drag flex-1 bg-custom-grayBlue relative p-20px text-white"
      >
        <!-- logo -->
        <div class="flex items-center">
          <img class="w-42px h-42px mr-10px" src="@/assets/logo.png" />
          <span class="font-youshe font-medium subpixel-antialiased">
            <span class="text-22px mr-5px">Tik</span>
            <span class="text-24px">英雄联盟对局助手</span>
          </span>
        </div>
        <!-- bg -->
        <div class="flex h-full flex-col items-center mt-30">
          <img src="@/assets/img/login-box-bg.png" class="w-260px" />
          <div class="w-86 mt-48px">
            <div class="text-2xl text-white">初次见面，</div>
            <div class="text-base text-white">
              这可能是你用过最体验最好的英雄联盟游戏工具
            </div>
          </div>
        </div>
      </div>
      <!-- 右半部分 -->
      <div class="flex-1 bg-white relative p-20px">
        <!-- 登录 -->
        <transition name="el-zoom-in-center">
          <LoginForm v-show="!showRegister" @toRegister="showRegister = true" />
        </transition>
        <!-- 注册 -->
        <transition name="el-zoom-in-center">
          <RegisterForm
            v-show="showRegister"
            @toRegister="showRegister = false"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LoginForm, RegisterForm } from "./components";

const showRegister = ref<boolean>(false);
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  width: 100%;
}
</style>