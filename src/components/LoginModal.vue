<template>
  <a-modal v-model:visible="modelValue" width="35%" :mask-closable="false" :hide-cancel="true" simple
           :esc-to-close="false" :closable="false">
    <template #title>
      <div class="w-full pb-4" style="border-bottom: 1px solid var(--color-border-2)">
        <div class="text-xl font-bold">登入</div>
        <div class="text-base mt-2">登入到<span class="text-blue-500 font-bold px-1">Tik League Tool</span>以获取完整服务内容。
        </div>
      </div>
      <icon-close class="text-[20px] absolute right-[16px] top-[16px] cursor-pointer" @click="quit"/>
    </template>
    <a-form :model="formState" @submit="onSubmit">
      <a-form-item field="username" hide-label :rules="[{ required: true, message: '登入用户名不能为空' }]">
        <template #prefix>
          <icon-user/>
        </template>
        <a-input class="w-full" v-model="formState.username" size="large" placeholder="请输入登入用户名"/>
      </a-form-item>
      <a-form-item field="password" hide-label :rules="[{ required: true, message: '登入密码用户名不能为空' }]">
        <template #prefix>
          <icon-lock/>
        </template>
        <a-input-password class="w-full" v-model="formState.password" size="large" placeholder="请输入登入密码"
                          allow-clear/>
      </a-form-item>
      <a-form-item field="verifyCode" hide-label :rules="[{ required: true, message: '验证码不能为空' }]">
        <template #prefix>
          <icon-dice/>
        </template>
        <a-input class="!w-[70%]" v-model="formState.verifyCode" size="large" placeholder="请输入右侧验证码"/>
        <img class="w-[94px] ml-2 cursor-pointer" :src="captchaImg" alt="加载失败" @click="getCaptchaImg"/>
      </a-form-item>
      <a-form-item hide-label>
        <a-button type="primary" size="large" long html-type="submit">登入</a-button>
      </a-form-item>
    </a-form>
    <div class="flex items-center justify-between mt-2">
      <a-link>忘记密码</a-link>
      <a-link>注册账号</a-link>
    </div>

    <template #footer>
      <div></div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted} from "vue";
import {getCaptcha} from '@/api/common';
import {useUserStore} from '@/store/user';
import {useRouter} from 'vue-router';
import {ipcRenderer} from "electron";

const router = useRouter()
const userStore = useUserStore()
const formState = reactive({
  username: '',
  password: '',
  captchaId: '',
  verifyCode: '',
  clientVersion: $consts.APP_VERSION,
  mac: $consts.PC_MAC
});
const captchaImg = ref('')

onMounted(async () => {
  await getCaptchaImg()
})

function quit() {
  ipcRenderer.send('app-quit', '')
}

const getCaptchaImg = async () => {
  const res = await getCaptcha();
  const {id, img} = res.data;
  formState.captchaId = id;
  captchaImg.value = img;
};

const onSubmit = async () => {
  try {
    await userStore.userLogin(formState);
    setTimeout(() => {
      emmits('update:modelValue', false)
    }, 1000);
  } catch (err) {
    await getCaptchaImg();
  }
}


const emmits = defineEmits(['update:modelValue'])
let props = defineProps({
  modelValue: Boolean
})
</script>

<style scoped>

</style>