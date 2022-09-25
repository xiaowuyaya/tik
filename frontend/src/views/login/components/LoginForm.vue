<template>
  <a-form :model="formData" @submit="onSubmit">
    <a-form-item field="username" hide-label :rules="[{ required: true, message: '登入用户名不能为空' }]">
      <template #prefix>
        <icon-user />
      </template>
      <a-input class="w-full" v-model="formData.username" size="large" placeholder="请输入登入用户名" />
    </a-form-item>
    <a-form-item field="password" hide-label :rules="[{ required: true, message: '登入密码用户名不能为空' }]">
      <template #prefix>
        <icon-lock />
      </template>
      <a-input-password class="w-full" v-model="formData.password" size="large" placeholder="请输入登入密码" allow-clear />
    </a-form-item>
    <a-form-item field="verifyCode" hide-label :rules="[{ required: true, message: '验证码不能为空' }]">
      <template #prefix>
        <icon-dice />
      </template>
      <a-input class="!w-[70%]" v-model="formData.verifyCode" size="large" placeholder="请输入右侧验证码" />
      <img class="w-[94px] ml-2 cursor-pointer" :src="captchaImg" alt="加载失败" @click="getCaptchaImg"/>
    </a-form-item>
    <a-form-item hide-label>
      <a-button type="primary" size="large" long html-type="submit">登入</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { getCaptcha } from '@/api/common';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { IconLock, IconUser, IconDice } from '@arco-design/web-vue/es/icon';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const { version, mac } = appStore;

const INITIAL_DATA = {
  username: '',
  password: '',
  captchaId: '',
  verifyCode: '',
  clientVersion: version,
  mac
}

const formData = reactive({ ...INITIAL_DATA });
const captchaImg = ref('')

onMounted(async () => {
  await getCaptchaImg()
})

const getCaptchaImg = async () => {
  const res = await getCaptcha();
  const { id, img } = res.data;
  formData.captchaId = id;
  captchaImg.value = img;
};

const onSubmit = async () => {
  try {
    await userStore.doLogin(formData);
    setTimeout(() => {
      router.push({ name: "home" });
    }, 1000);
  } catch (err) {
    await getCaptchaImg();
  }
}


</script>
