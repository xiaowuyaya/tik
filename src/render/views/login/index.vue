<template>
  <div class="h-full w-full login-container">
    <!-- HEADER -->
    <LoginHeader />
    <div class="h-[90%] flex items-center">
      <div
        class="absolute left-24  py-8 px-8 w-[400px] rounded-md flex flex-col backdrop-filter backdrop-blur-md bg-light-100 bg-opacity-50">
        <!-- TITLE -->
        <div class="font-bold text-gray-900 ">
          <h1 class="text-[2rem] leading-12">登入到</h1>
          <h1 class="text-[1.8rem] leading-12">Eko 英雄联盟工具箱</h1>

          <!-- CHANGE FORM -->
          <div class="text-base py-2 font-normal" v-show="formType == 'login'">
            <span class="text-gray-700">没有账号吗？</span>
            <a class="text-sky-700 hover:text-sky-600" href="#" @click="formType = 'register'">注册新账号</a>
          </div>
          <div class="text-base py-2 font-normal" v-show="formType == 'register'">
            <span class="text-gray-700">已有账号？</span>
            <a class="text-sky-700 hover:text-sky-600" href="#" @click="formType = 'login'">立即登入</a>
          </div>
        </div>
        <!-- FORM -->
        <loginForm class="!mt-6 " v-show="formType == 'login'"/>
        <registerForm class="!mt-6 " v-show="formType == 'register'"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginHeader from './components/Header.vue'
import loginForm from './components/LoginForm.vue'
import registerForm from './components/RegisterForm.vue'

const formType = ref('login')
</script>

<style lang="less">
.login-container {
  background: url('@/render/assets/login-bg.png');
  background-size: cover
}
</style>
