<template>
  <a-form :model="formData">
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
    <a-form-item field="nickName" hide-label :rules="[{ required: true, message: '用户昵称不能为空' }]">
      <template #prefix>
        <icon-idcard />
      </template>
      <a-input class="w-full" v-model="formData.nickName" size="large" placeholder="该账号昵称" />
    </a-form-item>
    <a-form-item field="phone" hide-label :rules="[{ required: true, message: '用户昵称不能为空' }]">
      <template #prefix>
        <icon-mobile />
      </template>
      <a-input class="w-full" v-model="formData.phone" size="large" placeholder="手机号（用于找回账号）" />
    </a-form-item>
    <a-form-item hide-label>
      <a-button type="primary" size="large" long @click="onSubmit">注册账号</a-button>
    </a-form-item>
  </a-form>

</template>

<script setup lang="ts">
import { IconMobile, IconIdcard, IconLock, IconUser } from '@arco-design/web-vue/es/icon';
import { useAppStore } from '@/stores/app'
import { ref } from 'vue';

const appStore = useAppStore()

const INITIAL_DATA = {
  username: '',
  password: '',
  nickName: '',
  phone: '',
}

const formData = ref({ ...INITIAL_DATA });

const onSubmit = async () => { }


</script>
