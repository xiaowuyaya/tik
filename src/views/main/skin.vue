<template>
  <div class="w-full h-full flex flex-col">
    <a-card :hoverable="true" :header-style="{ border: 'none' }">
      <span>注：当前模块在未开启状态时不会对游戏进行任何操作，初次使用请先查看</span>
      <a-link status="danger" @click="showNotice = !showNotice">必读事项</a-link>
      <a-modal v-model:visible="showNotice" width="47%" simple title="必读事项" :closable="false" hide-cancel draggable
        ok-text="了解" @ok="showNotice = false">
        <p class="text-red-500">如果之前使用过其他换肤模块，建议重装游戏，保证游戏目录纯净，避免封号。</p>
        <p class="mt-2">
          如对当前功能页面无感，可无视当前菜单项，在未启用状态下该模块不会生效且不对游戏进行任何更改操作，放心使用。</p>
        <p class="mt-2">换肤快捷键无法自定义，切换快捷键为: PageUp PageDown。
          注意避免与程序其他设置快捷键发生冲突，如发送敌军/友军战绩。</p>
        <p class="mt-2">当前功能非Tik原生开发功能，系与第三方合作接入的模块，如有该相关问题可联系QQ: 2209087068。</p>
      </a-modal>
    </a-card>

    <a-row class="mt-2 flex-auto" :gutter="12">
      <a-col class="!h-full" :span="12">
        <a-card class="!h-full" :hoverable="true" :header-style="{ border: 'none' }">
          <a-form auto-label-width>
            <a-form-item class="" label="账号状态">
              <a-tag color="green" v-show="userStore.expiration">已启用 {{  userStore.expiration  }}</a-tag>
              <a-tag color="red" v-show="!userStore.expiration">不可用</a-tag>
            </a-form-item>
            <a-form-item class="" label="启用换肤">
              <a-switch :disabled="userStore.expiration == ''" v-model="configStore.specialFunc.enableSkin" type="round"
                @change="configStore.changeConfig">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item class="" label="启用无限视距">
              <a-switch :disabled="userStore.expiration == ''" v-model="configStore.specialFunc.enableSightDistance"
                type="round" @change="configStore.changeSkinConfig">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item class="" label="切换上一项皮肤">
              <a-select :disabled="true" default-value="0" placeholder="请选择快捷键组合" multiple :limit="2">
                <a-option value="0">PageUp</a-option>
              </a-select>
              <a-popover>
                <icon-question-circle-fill class="mx-4" size="20px" />
                <template #content>
                  <span class="ml-4 text-gray-600">该模块快捷键无法自定义，注意避免与程序其他设置快捷键发生冲突</span>
                </template>
              </a-popover>
            </a-form-item>
            <a-form-item class="" label="切换下一项皮肤">
              <a-select :disabled="true" default-value="0" placeholder="请选择快捷键组合" multiple :limit="2">
                <a-option value="0">PageDown</a-option>
              </a-select>
              <a-popover>
                <icon-question-circle-fill class="mx-4" size="20px" />
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
                placeholder="请输入兑换码" />
            </a-form-item>
            <div class="my-1 flex justify-end"><span>没有兑换码？ <a-link status="warning"
                  @click="shell.openExternal('https://faka.eiko.ren/')">点此购买</a-link></span>
            </div>
            <div class="my-1 flex justify-end"><span>初次使用可免费体验一天 <a-link status="warning" @click="checkFirstTime">获取体验资格
                </a-link></span>
            </div>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { useConfigStore } from "@/stores/config";
import { shell } from "electron";
import { onMounted, ref } from "vue";
import { bindKamiCode, toBeTempVip, vipCheck, wasVip } from "@/api/vip";
import { Message, Modal } from "@arco-design/web-vue";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import dayjs from "dayjs";
import { removeToken } from "@/utils/auth";
import { copyToClipboard } from "@/utils/tools";

const configStore = useConfigStore()
const userStore = useUserStore()
const appStore = useAppStore()

const showNotice = ref(false)
const kamiStr = ref('')
const expiration = ref('')
const isVip = ref(false)

onMounted(async () => {
  await userStore.vipCheck()
})

const handleKami = async () => {
  try {
    const r = await bindKamiCode({
      username: userStore.username,
      kamiCode: kamiStr.value,
      mac: appStore.mac,
    });
    Message.success({
      content: `卡密绑定成功，到期时间：${dayjs(r.data).format('YYYY-MM-DD HH:mm:ss')}`,
      duration: 4500,
    });
  } catch (err) {
    console.log(err);
  }
}

const checkFirstTime = async () => {
  const r = await wasVip()
  if (r.data == true) {
    Message.error({
      content: `当前账号非初次使用用户，无法申请`,
      duration: 4500,
    });
  } else {
    const res = await toBeTempVip()
    kamiStr.value = res.data.kami
    await copyToClipboard(res.data.kami)
    Message.success({
      content: `领取成功，您的兑换码为: ${kamiStr.value}, 已复制到剪贴板`,
      duration: 4500,
    });
  }
  console.log(r)
}


</script>