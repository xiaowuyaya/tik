<template>
  <div class="w-full h-full flex">
    <div class="flex flex-col w-[60%] h-full !mr-1">
      <a-form :model="configStore">
        <a-card :hoverable="true" :header-style="{ border: 'none' }">
          <div class="text-base font-medium text-gray-500 !mb-4">发送设置</div>
          <div class="pl-3">
            <a-form-item class="" label-col-flex="74px" label="快捷键发送">
              <a-switch v-model="configStore.enableSendHourse" @change="configStore.changeConfig">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
            <a-row>
              <a-col :span="8">
                <a-form-item class="" label-col-flex="74px" label="仅排位数据">
                  <a-switch v-model="configStore.onlyRankData" @change="configStore.changeConfig">
                    <template #checked-icon>
                      <icon-check />
                    </template>
                    <template #unchecked-icon>
                      <icon-close />
                    </template>
                  </a-switch>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item class="" label-col-flex="74px" label="发送局数">
                  <a-input-number v-model="configStore.matchCount" class="input-demo" :min="1" :max="10"
                    @change="configStore.changeConfig" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item class="!mb-0" label-col-flex="74px" label="黑名单提醒">
              <a-space size="large">
                <a-radio v-model="configStore.blacklistNoticeAll" :value="true" @change="configStore.changeConfig">所有人可见
                </a-radio>
                <a-radio v-model="configStore.blacklistNoticeAll" :value="false" @change="configStore.changeConfig">
                  仅自己可见</a-radio>
              </a-space>
            </a-form-item>
          </div>
        </a-card>
        <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="text-base font-medium text-gray-500 !mb-4">自定快捷键</div>
          <a-form-item field="settingsStore.app.spellsWin.key" label-col-flex="74px" label="技能窗口">
            <a-select :disabled="!configStore.spellsWin.enable" class="!w-[46%]" v-model="configStore.spellsWin.key"
              placeholder="请选择快捷键组合" size="large" multiple :limit="3" @change="handleNotice('spellsWin')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.spellsWin }}</span>
          </a-form-item>
          <a-form-item label-col-flex="74px" label="发送友军">
            <a-select :disabled="!configStore.enableSendHourse" class="!w-[46%]" v-model="configStore.keys.order"
              placeholder="请选择快捷键组合" size="large" multiple :limit="3" @change="handleNotice('order')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.order }}</span>
          </a-form-item>
          <a-form-item label-col-flex="74px" label="发送敌军">
            <a-select :disabled="!configStore.enableSendHourse" class="!w-[46%]" v-model="configStore.keys.chaos"
              placeholder="请选择快捷键组合" size="large" multiple :limit="3" @change="handleNotice('chaos')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.chaos }}</span>
          </a-form-item>
          <a-form-item class="!mb-0" label-col-flex="74px" label="全体禁言">
            <a-select :disabled="!configStore.enableSendHourse" class="!w-[46%]" v-model="configStore.keys.muteAll"
              placeholder="请选择快捷键组合" size="large" multiple :limit="3" @change="handleNotice('muteAll')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <span class="ml-4 text-gray-600">当前快捷键为：{{ hotKeyNotice.muteAll }}</span>
          </a-form-item>
        </a-card>
        <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="text-base font-medium text-gray-500 !mb-4">自定义称号</div>
          <a-row align="center">
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第一">
                <a-input v-model="configStore.typeTitle[0]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.changeConfig" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第二">
                <a-input v-model="configStore.typeTitle[1]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.changeConfig" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第三">
                <a-input v-model="configStore.typeTitle[2]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.changeConfig" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="!mb-0" label-col-flex="50px" label="第四">
                <a-input v-model="configStore.typeTitle[3]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.changeConfig" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="!mb-0" label-col-flex="50px" label="第五">
                <a-input v-model="configStore.typeTitle[4]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.changeConfig" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </div>
    <a-card class="flex flex-col flex-auto h-full !ml-1" :hoverable="true" :header-style="{ border: 'none' }">
      <div class="text-base font-medium text-gray-500 !mb-4">应用设置</div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { keyCodeOptions, keyCodeMap } from '@/utils/options';
import { useConfigStore } from '@/stores/config';
import { onBeforeMount, reactive } from 'vue';

const configStore = useConfigStore();
const appStore = window.appStore

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

/**
 * 快捷键提醒
 * @param {*} type
 */
const handleNotice = (type: 'order' | 'chaos' | 'muteAll' | 'spellsWin') => {

  // 顺便更改一下配置
  configStore.changeConfig()

  let keys: number[];
  if (type == 'spellsWin') {
    keys = appStore.get('spellsWin.key')
  } else {
    keys = appStore.get(`keys.${type}`)
  }

  console.log(appStore.get('spellsWin.key'));
  console.log(appStore.get('keys.chaos'));


  let str = '';
  if (keys.length == 0) {
    str = '无快捷键';
  }
  if (keys.length == 1) {
    // @ts-ignore
    str = keyCodeMap[keys];
  }
  if (keys.length > 1) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i != keys.length - 1) {
        // @ts-ignore
        str += `${keyCodeMap[key]} + `;
      } else {
        // @ts-ignore
        str += `${keyCodeMap[key]}`;
      }
    }
  }
  hotKeyNotice[type] = str;
};
</script>
