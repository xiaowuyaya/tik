<template>
  <div class="layout-container">
    <Header />
    <!-- body -->
    <div>
    </div>
    <router-view class="bg-white" />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';

</script>

<style scoped lang="scss">
.layout-container {
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>