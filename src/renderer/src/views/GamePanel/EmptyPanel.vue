<script setup></script>

<template>
  <div class="container items-center justify-center">
    <img class="w-[240px]" src="../../assets/image/model/no_game_data.svg" alt="" />
    <div class="mt-10 flex flex-col items-center">
      <div class="text-5xl font-youshe">暂未获取到对局信息</div>
      <div class="mt-6 text-base font-semibold text-gray-500">面板信息将在状态为 <u>选择英雄时</u> 以及 <u>游戏加载中</u> 获取</div>
      <div class="text-base font-semibold text-gray-500">注意：面板数据渲染量极大，部分电脑可能会卡顿数秒，请耐心等待！</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
