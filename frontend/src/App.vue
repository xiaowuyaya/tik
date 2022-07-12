<script setup lang="ts">
</script>

<template>
  <router-view class="font-pingfang shadow select-none" />
</template>

<style lang="less">
@import url(./style/font.css);
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;
  #app {
    .size;
  }
  /* 圆框需要 不然圆角会有背景色*/
  background-color: rgba(0, 0, 0, 0);
  border-radius: 6px;
  overflow: hidden;
}

img {
  -webkit-user-drag: none;
}

.no-drag {
  -webkit-app-region: drag;
}
</style>
