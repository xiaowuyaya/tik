<template>
  <div class="flex flex-col p-2">
    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <a-row :gutter="12" align="center">
        <!-- 匹配秒选 -->
        <a-col :span="4">
          <a-form-item field="settingsStore.app.normalAuto.pick" label="匹配秒选">
            <!-- 开关 -->
            <a-switch v-model="settingsStore.app.normalAuto.pick">
              <template #checked-icon>
                <icon-check />
              </template>
              <template #unchecked-icon>
                <icon-close />
              </template>
            </a-switch>
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.accept" label="选用英雄">
            <a-select
              :disabled="!settingsStore.app.normalAuto.pick"
              v-model="settingsStore.app.normalAuto.pickSelect"
              placeholder="请选择需要秒选的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="12" align="center">
        <!-- 征召秒禁 -->
        <a-col :span="4">
          <a-form-item class="!mb-0" field="settingsStore.app.normalAuto.ban" label="征召秒禁">
            <!-- 开关 -->
            <a-switch v-model="settingsStore.app.normalAuto.ban">
              <template #checked-icon>
                <icon-check />
              </template>
              <template #unchecked-icon>
                <icon-close />
              </template>
            </a-switch>
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <!-- 选择 -->
          <a-form-item class="!mb-0" field="settingsStore.app.normalAuto.banSelect" label="选用英雄">
            <a-select
              :disabled="!settingsStore.app.normalAuto.ban"
              v-model="settingsStore.app.normalAuto.banSelect"
              placeholder="请选择需要秒选的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-row class="mt-2" :gutter="12" align="center">
      <a-col :span="12">
        <a-card :hoverable="true" :header-style="{ border: 'none' }">
          <a-form-item field="settingsStore.app.rankAuto.pick.enable" label="排位秒选">
            <!-- 开关 -->
            <a-switch v-model="settingsStore.app.rankAuto.pick.enable">
              <template #checked-icon>
                <icon-check />
              </template>
              <template #unchecked-icon>
                <icon-close />
              </template>
            </a-switch>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.pick.top" label="上路">
            <a-select
              :disabled="!settingsStore.app.rankAuto.pick.enable"
              v-model="settingsStore.app.rankAuto.pick.top"
              placeholder="请选择需要秒选的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.pick.jungle" label="打野">
            <a-select
              :disabled="!settingsStore.app.rankAuto.pick.enable"
              v-model="settingsStore.app.rankAuto.pick.jungle"
              placeholder="请选择需要秒选的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.pick.middle" label="中路">
            <a-select
              :disabled="!settingsStore.app.rankAuto.pick.enable"
              v-model="settingsStore.app.rankAuto.pick.middle"
              placeholder="请选择需要秒选的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.pick.bottom" label="下路">
            <a-select
              :disabled="!settingsStore.app.rankAuto.pick.enable"
              v-model="settingsStore.app.rankAuto.pick.bottom"
              placeholder="请选择需要秒选的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.pick.utility" label="辅助">
            <a-select
              :disabled="!settingsStore.app.rankAuto.pick.enable"
              v-model="settingsStore.app.rankAuto.pick.utility"
              placeholder="请选择需要秒选的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :hoverable="true" :header-style="{ border: 'none' }">
          <a-form-item field="settingsStore.app.rankAuto.pick.enable" label="排位禁选">
            <!-- 开关 -->
            <a-switch v-model="settingsStore.app.rankAuto.ban.enable">
              <template #checked-icon>
                <icon-check />
              </template>
              <template #unchecked-icon>
                <icon-close />
              </template>
            </a-switch>
          </a-form-item>
                    <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.ban.top" label="上路">
            <a-select
              :disabled="!settingsStore.app.rankAuto.ban.enable"
              v-model="settingsStore.app.rankAuto.ban.top"
              placeholder="请选择需要秒禁的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.ban.jungle" label="打野">
            <a-select
              :disabled="!settingsStore.app.rankAuto.ban.enable"
              v-model="settingsStore.app.rankAuto.ban.jungle"
              placeholder="请选择需要秒禁的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.ban.middle" label="中路">
            <a-select
              :disabled="!settingsStore.app.rankAuto.ban.enable"
              v-model="settingsStore.app.rankAuto.ban.middle"
              placeholder="请选择需要秒禁的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.ban.bottom" label="下路">
            <a-select
              :disabled="!settingsStore.app.rankAuto.ban.enable"
              v-model="settingsStore.app.rankAuto.ban.bottom"
              placeholder="请选择需要秒禁的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item field="settingsStore.app.rankAuto.ban.utility" label="辅助">
            <a-select
              :disabled="!settingsStore.app.rankAuto.ban.enable"
              v-model="settingsStore.app.rankAuto.ban.utility"
              placeholder="请选择需要秒禁的英雄"
              size="large"
              multiple
              :limit="2"
            >
              <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{ key }}</a-option>
            </a-select>
          </a-form-item>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/modules/settings';
import { useChampionsStore } from '@/stores/modules/champions';

const championsStore = useChampionsStore();
const settingsStore = useSettingsStore();
</script>
