<template>
  <div class="flex flex-col p-2">
    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <a-row :gutter="12" align="center">
        <!-- 匹配秒选 -->
        <a-col :span="4">
          <a-form-item label="匹配秒选">
            <!-- 开关 -->
            <a-switch v-model="configStore.normalAutoPB.enablePick" @change="configStore.changeConfig">
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
          <a-form-item label="选用英雄">
            <a-select :disabled="!configStore.normalAutoPB.enablePick" v-model="configStore.normalAutoPB.pickSelect"
              placeholder="请选择需要秒选的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="12" align="center">
        <!-- 征召秒禁 -->
        <a-col :span="4">
          <a-form-item class="!mb-0" label="征召秒禁">
            <!-- 开关 -->
            <a-switch v-model="configStore.normalAutoPB.enableBan" @change="configStore.changeConfig">
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
          <a-form-item class="!mb-0" label="选用英雄">
            <a-select :disabled="!configStore.normalAutoPB.enableBan" v-model="configStore.normalAutoPB.banSelect"
              placeholder="请选择需要秒选的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-row class="mt-2" :gutter="12" align="center">
      <a-col :span="12">
        <a-card :hoverable="true" :header-style="{ border: 'none' }">
          <a-form-item label="排位秒选">
            <!-- 开关 -->
            <a-switch v-model="configStore.rankAutoBP.pick.enable" @change="configStore.changeConfig">
              <template #checked-icon>
                <icon-check />
              </template>
              <template #unchecked-icon>
                <icon-close />
              </template>
            </a-switch>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="上路">
            <a-select :disabled="!configStore.rankAutoBP.pick.enable" v-model="configStore.rankAutoBP.pick.top"
              placeholder="请选择需要秒选的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="打野">
            <a-select :disabled="!configStore.rankAutoBP.pick.enable" v-model="configStore.rankAutoBP.pick.jungle"
              placeholder="请选择需要秒选的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="中路">
            <a-select :disabled="!configStore.rankAutoBP.pick.enable" v-model="configStore.rankAutoBP.pick.middle"
              placeholder="请选择需要秒选的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="下路">
            <a-select :disabled="!configStore.rankAutoBP.pick.enable" v-model="configStore.rankAutoBP.pick.bottom"
              placeholder="请选择需要秒选的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="辅助">
            <a-select :disabled="!configStore.rankAutoBP.pick.enable" v-model="configStore.rankAutoBP.pick.utility"
              placeholder="请选择需要秒选的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :hoverable="true" :header-style="{ border: 'none' }">
          <a-form-item field="settingsStore.app.rankAuto.pick.enable" label="排位禁选">
            <!-- 开关 -->
            <a-switch v-model="configStore.rankAutoBP.ban.enable" @change="configStore.changeConfig">
              <template #checked-icon>
                <icon-check />
              </template>
              <template #unchecked-icon>
                <icon-close />
              </template>
            </a-switch>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="上路">
            <a-select :disabled="!configStore.rankAutoBP.ban.enable" v-model="configStore.rankAutoBP.ban.top"
              placeholder="请选择需要秒禁的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="打野">
            <a-select :disabled="!configStore.rankAutoBP.ban.enable" v-model="configStore.rankAutoBP.ban.jungle"
              placeholder="请选择需要秒禁的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="中路">
            <a-select :disabled="!configStore.rankAutoBP.ban.enable" v-model="configStore.rankAutoBP.ban.middle"
              placeholder="请选择需要秒禁的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="下路">
            <a-select :disabled="!configStore.rankAutoBP.ban.enable" v-model="configStore.rankAutoBP.ban.bottom"
              placeholder="请选择需要秒禁的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
          <!-- 选择 -->
          <a-form-item label="辅助">
            <a-select :disabled="!configStore.rankAutoBP.ban.enable" v-model="configStore.rankAutoBP.ban.utility"
              placeholder="请选择需要秒禁的英雄" size="large" multiple :limit="2" @change="configStore.changeConfig">
              <a-option v-for="(value, key, index) in ddragonStore" :key="index" :value="value.championId">{{ key
              }}</a-option>
            </a-select>
          </a-form-item>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { ref } from 'vue';

const ddragonStore = ref(window.ddragonStore.get('champions'))
const configStore = useConfigStore()

</script>
