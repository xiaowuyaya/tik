<template>
 <div class="flex items-center h-full">
   <a-result status="error">
    <template #icon>
      <icon-exclamation-circle-fill size="82"/>
    </template>
    <template #title>
      <span class="text-lg">未获取到客户端信息</span>
    </template>
    <template #subtitle>
      <span class="text-base">程序未检测到客户端信息，无法提供完整功能</span>
    </template>

    <a-typography  style="background: var(--color-fill-2); padding: 24px">
      <a-typography-paragraph >五秒后还未检测到信息，您可以尝试如下操作</a-typography-paragraph>
      <ul>
        <li>请先打开英雄联盟客户端后再运行本程序。</li>
        <li>确保本程序是否以管理员的方式启动。</li>
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
