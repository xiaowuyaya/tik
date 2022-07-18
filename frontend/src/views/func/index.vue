<template>
  <div class="flex flex-col p-2">
    <a-form :model="settingsStore" auto-label-width>
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <a-row :gutter="12" align="center" justify-content="space-between">
          <!-- 自动接受对局 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="settingsStore.app.accept" label="自动接收对局">
              <a-switch v-model="settingsStore.app.accept">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <!-- 自动锁定英雄 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="settingsStore.app.confirm" label="自动锁定英雄">
              <a-switch v-model="settingsStore.app.confirm">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <!-- 开局禁言 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="settingsStore.app.muteAll" label="开局禁言">
              <a-switch v-model="settingsStore.app.muteAll">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
        <a-row :gutter="42" align="center" justify-content="space-between">
          <!-- 段位伪造 -->
          <a-col :span="12">
            <a-form-item class="" field="useForm.ranked" label="段位伪造">
              <a-select v-model="useForm.ranked" placeholder="请选择需要更改的段位" allow-clear allow-search>
                <a-option v-for="(item, idx) in rankOptions" :key="idx" :value="item.value">{{ item.label }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 状态更改 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="" field="useForm.status" label="状态更改">
              <a-select v-model="useForm.status" placeholder="请选择需要更改的状态" allow-clear allow-search>
                <a-option v-for="(item, idx) in statusOptions" :key="idx" :value="item.value">{{ item.label }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 拉起观战 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="" field="useForm.spectator" label="拉起观战">
              <a-input-search search-button placeholder="请输入需要观战的玩家游戏名" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="" label="5v5训练模式">
              <a-button type="primary" long size="large">点击创建</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="!mb-0" label="生涯背景修改">
              <a-button type="primary" long size="large">点击选择</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/modules/settings';
import { reactive } from 'vue';
import { statusOptions, rankOptions } from '@/utils/options';

const settingsStore = useSettingsStore();

const useForm = reactive({
  ranked: '',
  status: '',
  spectator: '',
});
</script>
