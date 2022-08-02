<template>
  <div class="w-full p-2">
    <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '10px' }">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item class="!mb-0" label="开启英雄时刻截图">
            <a-switch v-model="settingsStore.app.heroScreenshot.enable" @change="settingsStore.syncLocal" type="line" />
          </a-form-item>
        </a-col>
         <a-col :span="12">
          <a-form-item class="!mb-0" label="开启文本发送">
            <a-switch v-model="settingsStore.app.heroScreenshot.send" @change="settingsStore.syncLocal" type="line" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="mb-1" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '10px' }">
      <div class="h-full">
        <p class="p-1 font-bold">目前该功能已经实现，可通过上分开关自定义是否开启，图片将展示在首页。</p>
        <p class="p-1">该区域为展示当前账号所有的截图信息，后续更新补全</p>
        <p class="p-1">图片的存储方式还在规划中，具体看用户反馈，目前所有截图资源存在在本地，如果响应不错的话考虑随同步上云端</p>
        <p class="p-1">届时可在官网做个类似于图集的页面进行展示</p>
        <p class="p-1">目前存放截图的具体路径可在 右上角设置-调试-配置路径-game_screenshot文件夹中找到</p>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/modules/settings';

const settingsStore = useSettingsStore();
</script>
