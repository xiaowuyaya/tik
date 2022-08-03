<template>
  <div class="flex flex-col p-2">
    <a-form :model="settingsStore">
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <a-form-item class="!mb-0" field="settingsStore.app.accept" label-col-flex="90px" label="黑名单提醒">
          <a-space size="large">
            <a-radio v-model="settingsStore.send.blackListNotice" :value="true">所有人可见</a-radio>
            <a-radio v-model="settingsStore.send.blackListNotice" :value="false">仅自己可见</a-radio>
          </a-space>
        </a-form-item>
      </a-card>
      <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
        <a-row :gutter="12" align="center" justify-content="space-between">
          <!-- 快捷键发送 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="settingsStore.send.enable" label-col-flex="90px" label="快捷键发送">
              <a-switch v-model="settingsStore.send.enable">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <!-- 仅显示排位数据 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="settingsStore.send.onlyRank" label-col-flex="100px" label="仅显示排位数据">
              <a-switch v-model="settingsStore.send.onlyRank">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <!--  -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="settingsStore.send.matchCount" label-col-flex="90px" label="发送局数">
              <a-input-number v-model="settingsStore.send.matchCount" class="input-demo" :min="1" :max="10" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }" title="自定义快捷键">
        <a-form-item field="settingsStore.app.spellsWin.key" label-col-flex="74px" label="技能窗口">
          <a-select
            :disabled="!settingsStore.app.spellsWin.enable"
            class="!w-[46%]"
            v-model="settingsStore.app.spellsWin.key"
            placeholder="请选择快捷键组合"
            size="large"
            multiple
            :limit="3"
            @change="handleNotice('spellsWin')"
          >
            <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}</a-option>
          </a-select>
          <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.spellsWin }}</span>
        </a-form-item>
        <a-form-item field="settingsStore.send.keys.order" label-col-flex="74px" label="发送友军">
          <a-select
            :disabled="!settingsStore.send.enable"
            class="!w-[46%]"
            v-model="settingsStore.send.keys.order"
            placeholder="请选择快捷键组合"
            size="large"
            multiple
            :limit="3"
            @change="handleNotice('order')"
          >
            <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}</a-option>
          </a-select>
          <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.order }}</span>
        </a-form-item>
        <a-form-item field="settingsStore.send.keys.chaos" label-col-flex="74px" label="发送敌军">
          <a-select
            :disabled="!settingsStore.send.enable"
            class="!w-[46%]"
            v-model="settingsStore.send.keys.chaos"
            placeholder="请选择快捷键组合"
            size="large"
            multiple
            :limit="3"
            @change="handleNotice('chaos')"
          >
            <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}</a-option>
          </a-select>
          <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.chaos }}</span>
        </a-form-item>
        <a-form-item field="settingsStore.send.keys.muteAll" label-col-flex="74px" label="全体禁言">
          <a-select
            :disabled="!settingsStore.send.enable"
            class="!w-[46%]"
            v-model="settingsStore.send.keys.muteAll"
            placeholder="请选择快捷键组合"
            size="large"
            multiple
            :limit="3"
            @change="handleNotice('muteAll')"
          >
            <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}</a-option>
          </a-select>
          <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.muteAll }}</span>
        </a-form-item>
      </a-card>
      <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }" title="自定义称号">
        <a-row align="center">
          <a-col :span="8">
            <a-form-item field="settingsStore.send.title.no1" label-col-flex="50px" label="第一">
              <a-input v-model="settingsStore.send.title.no1" placeholder="请输入该排名称号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="settingsStore.send.title.no2" label-col-flex="50px" label="第二">
              <a-input v-model="settingsStore.send.title.no2" placeholder="请输入该排名称号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="settingsStore.send.title.no3" label-col-flex="50px" label="第三">
              <a-input v-model="settingsStore.send.title.no3" placeholder="请输入该排名称号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="settingsStore.send.title.no4" label-col-flex="50px" label="第四">
              <a-input v-model="settingsStore.send.title.no4" placeholder="请输入该排名称号" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="settingsStore.send.title.no5" label-col-flex="50px" label="第五">
              <a-input v-model="settingsStore.send.title.no5" placeholder="请输入该排名称号" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <a-button class="!absolute bottom-14 right-6" type="primary" status="danger" size="large" @click="submit">
      <template #icon>
        <icon-check />
      </template>
      提交设置
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { keyCodeOptions, keyCodeMap } from '@/utils/options';
import { useSettingsStore } from '@/stores/modules/settings';
import { onBeforeMount, reactive } from 'vue';

const settingsStore = useSettingsStore();

const hotKeyNotice = reactive({
  spellsWin: '',
  order: '',
  chaos: '',
  muteAll: '',
});

onBeforeMount(() => {
  handleNotice('spellsWin');
  handleNotice('order');
  handleNotice('chaos');
  handleNotice('muteAll');
});

const submit = async () => {
  await settingsStore.syncLocal();
};

/**
 * 快捷键提醒
 * @param {*} type
 */
const handleNotice = (type: string) => {
  let keys;
  if (type == 'spellsWin') {
    keys = settingsStore.app.spellsWin.key;
  } else {
    keys = settingsStore.send.keys[type];
  }
  let str = '';
  if (keys.length == 0) {
    str = '无快捷键';
  }
  if (keys.length == 1) {
    str = keyCodeMap[keys];
  }
  if (keys.length > 1) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i != keys.length - 1) {
        str += `${keyCodeMap[key]} + `;
      } else {
        str += `${keyCodeMap[key]}`;
      }
    }
  }
  hotKeyNotice[type] = str;
};
</script>
