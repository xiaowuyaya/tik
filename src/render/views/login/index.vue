<template>
  <div class="h-full w-full login-container">
    <LoginHeader />
  </div>
</template>
<script setup lang="ts">
import LoginHeader from './components/Header.vue'
</script>
<style lang="less">
.login-container{
  background: url('@/render/assets/login-bg.png');
  background-size: cover
}
</style>
