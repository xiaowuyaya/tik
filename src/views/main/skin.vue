<template>
  <div class="w-full h-full flex flex-col">
    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <span>注：当前模块在未开启状态时不会对游戏进行任何操作，初次使用请先查看</span>
      <a-link status="danger" @click="showNotice = !showNotice">必读事项</a-link>
      <a-modal v-model:visible="showNotice" width="47%" simple title="必读事项" :closable="false" hide-cancel draggable
               ok-text="了解" @ok="showNotice = false">
        <p class="text-red-500">如果之前使用过其他换肤模块，建议重装游戏，保证游戏目录纯净，避免封号。</p>
        <p class="mt-2">如对当前功能页面无感，可无视当前菜单项，在未启用状态下该模块不会生效且不对游戏进行任何更改操作，放心使用。</p>
        <p class="mt-2">换肤快捷键无法自定义，切换快捷键为: PageUp PageDown。 注意避免与程序其他设置快捷键发生冲突，如发送敌军/友军战绩。</p>
        <p class="mt-2">当前功能非Tik原生开发功能，系与第三方合作接入的模块，如有该相关问题可联系QQ: 2209087068。</p>
      </a-modal>
    </a-card>

    <a-row class="mt-2 flex-auto" :gutter="12">
      <a-col class="!h-full" :span="12">
        <a-card class="!h-full" :hoverable="true" :header-style="{ border: 'none' }">
          <a-form auto-label-width>
            <a-form-item class="" label="账号状态">
              <a-tag color="green">已启用 ( 2022-09-23 23:58 )</a-tag>
              <a-tag color="red">不可用</a-tag>
            </a-form-item>
            <a-form-item class="" label="启用换肤">
              <a-switch v-model="configStore.specialFunc.enableSkin" type="round" @change="configStore.changeConfig">
                <template #checked-icon>
                  <icon-check/>
                </template>
                <template #unchecked-icon>
                  <icon-close/>
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item class="" label="启用无限视距">
              <a-switch v-model="configStore.specialFunc.enableSightDistance" type="round"
                        @change="configStore.changeConfig">
                <template #checked-icon>
                  <icon-check/>
                </template>
                <template #unchecked-icon>
                  <icon-close/>
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item class="" label="切换上一项皮肤">
              <a-select :disabled="true" default-value="0"
                        placeholder="请选择快捷键组合" multiple :limit="2" @change="handleNotice('muteAll')">
                <a-option value="0">PageUp</a-option>
              </a-select>
              <a-popover>
                <icon-question-circle-fill class="mx-4" size="20px"/>
                <template #content>
                  <span class="ml-4 text-gray-600">该模块快捷键无法自定义，注意避免与程序其他设置快捷键发生冲突</span>
                </template>
              </a-popover>
            </a-form-item>
            <a-form-item class="" label="切换下一项皮肤">
              <a-select :disabled="true" default-value="0"
                        placeholder="请选择快捷键组合" multiple :limit="2" @change="handleNotice('muteAll')">
                <a-option value="0">PageDown</a-option>
              </a-select>
              <a-popover>
                <icon-question-circle-fill class="mx-4" size="20px"/>
                <template #content>
                  <span class="ml-4 text-gray-600">该模块快捷键无法自定义，注意避免与程序其他设置快捷键发生冲突</span>
                </template>
              </a-popover>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col class="!h-full" :span="12">
        <a-card class="!h-full p-2" :hoverable="true" :header-style="{ border: 'none' }">
          <a-form auto-label-width>
            <a-form-item class="" label="兑换时长">
              <a-input-search v-model="kamiStr" @search="handleKami" size="large" button-text="兑换" search-button
                              placeholder="请输入兑换码"/>
            </a-form-item>
            <div class="my-1 flex justify-end"><span>没有兑换码？ <a-link status="warning" @click="showNotice = !showNotice">点此购买</a-link></span></div>
            <div class="my-1 flex justify-end"><span>初次使用可免费体验一天 <a-link status="warning" @click="showNotice = !showNotice">点此领取</a-link></span></div>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {useConfigStore} from "@/stores/config";
import {ref} from "vue";

const configStore = useConfigStore()

const showNotice = ref(false)
const kamiStr = ref('')

const handleKami = async () => {

}


</script>