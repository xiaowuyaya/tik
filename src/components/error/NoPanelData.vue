<template>
  <div class="flex items-center h-full">
    <a-result :status="null">
      <template #icon>
        <img src="../../assets/no_game_data.svg" class="!w-58">
      </template>
      <template #title>
        <span class="text-xl">暂未获取到对局信息</span>
      </template>
      <template #subtitle>
        <span class="text-lg">程序未检测到游戏对局的数据，该模块无法显示</span>
      </template>

      <a-typography class="text-base" style="background: var(--color-fill-2); padding: 24px">
        <a-typography-paragraph>您可以尝试如下操作</a-typography-paragraph>
        <ul>
          <li>面板信息将在状态为<b>选择英雄时</b>以及<b>游戏加载中</b>获取</li>
          <li>请确保已经进入游戏，对局数据将在对局开始后2-5秒内获取到</li>
          <li>如以上操作无法解决您的问题，请加群咨询。</li>
        </ul>
      </a-typography>
    </a-result>
  </div>
</template>
 
<script setup lang="ts">

</script>
 
<style lang="less">

</style>
 