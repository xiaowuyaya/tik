<template>
  <div class="h-full w-full login-container">
    <!-- HEADER -->
    <LoginHeader />
    <div class="h-[90%] flex items-center">
      <div
        class="absolute left-24  py-8 px-8 w-[400px] rounded-md flex flex-col backdrop-filter backdrop-blur-md bg-light-100 bg-opacity-60">
        <!-- TITLE -->
        <div class=" text-gray-900 ">
          <h1 class="text-[1.4rem] leading-8 font-bold">登入</h1>
          <h1 class="text-[2rem] leading-12 font-youshe">{{APP_TITLE}}</h1>

          <!-- CHANGE FORM -->
          <div class="text-base py-2 font-normal" v-show="showType == 0">
            <span class="text-gray-700">没有账号吗？</span>
            <a class="ml-2 text-red-700 hover:text-red-600" href="#"  @click="changeForm(1)">立刻注册新账号</a>
          </div>
          <div class="text-base py-2 font-normal" v-show="showType == 1">
            <span class="text-gray-700">已经有账号啦？</span>
            <a class="text-blue-700 hover:text-blue-600" href="#"  @click="changeForm(0)">立即登入Tik</a>
          </div>
        </div>
        <!-- FORM -->
        <transition mode="out-in" :duration="300" enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut">
          <component class="!mt-6 " :is="currentTabComponent"></component>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginHeader from './components/LoginHeader.vue'
import RegisterForm from './components/RegisterForm.vue'
import LoginForm from './components/loginForm.vue'

const APP_TITLE = $tools.APP_TITLE
const showType = ref(0)
const currentTabComponent = ref(LoginForm)

function changeForm(type: number) {
  if (type == 0) {
    showType.value = 0
    currentTabComponent.value = LoginForm
  } else {
    showType.value = 1
    currentTabComponent.value = RegisterForm
  }
}

</script>

<style lang="less">
.login-container {
  background: url('../../assets/login_bg.png');
  background-size: cover
}
</style>
