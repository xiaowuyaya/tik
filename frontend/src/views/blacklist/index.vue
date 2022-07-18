<template>
  <div class="flex flex-col p-2">
    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <a-row :gutter="24" align="center">
        <a-col :span="8">
          <a-form-item class="!mb-0"  field="useForm.banName" label="拉黑玩家">
            <a-input v-model="useForm.banName" placeholder="玩家游戏名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item class="!mb-0"  field="useForm.reason" label="拉黑原因">
            <a-input v-model="useForm.banName" placeholder="他做了什么？" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item class="!mb-0" >
            <a-button type="primary">拉黑</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useBlacklistStore } from '@/stores/modules/blacklist';
import { onBeforeMount, reactive } from 'vue';

const blacklistStore = useBlacklistStore()

const useForm = reactive({
  banName: '',
  reason: '',
});

onBeforeMount(()=>{
  blacklistStore.getAll()
})


</script>
