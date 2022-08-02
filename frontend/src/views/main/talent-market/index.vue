<template>
  <div class="w-full p-2 h-full">
    <div class="flex flex-col h-full">
      <a-card class="mb-2 !h-[75%]" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '10px', height: '80%' }"></a-card>
      <a-card class="flex-1" :hoverable="true" :header-style="{ border: 'none' }" :body-style="{ padding: '10px' }">
        <div class="flex flex-col">
          <a-textarea
            v-model="msg"
            placeholder="请输入您的招聘启事"
            :max-length="360"
            show-word-limit
            :auto-size="{
              minRows: 4,
              maxRows: 4,
            }"
          />
          <div class="mt-2 flex items-center justify-end">
            <a-button type="primary">
              <template #icon>
                <icon-send />
              </template>
              发送
            </a-button>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const msg = ref('');
</script>
