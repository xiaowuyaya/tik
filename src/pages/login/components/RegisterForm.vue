<template>
  <a-form :model="formState" @submit="onSubmit">
    <a-form-item field="username" hide-label :rules="[{ required: true, message: '登入用户名不能为空' }]">
      <template #prefix>
        <icon-user />
      </template>
      <a-input class="w-full" v-model="formState.username" size="large" placeholder="请输入登入用户名" />
    </a-form-item>
    <a-form-item field="password" hide-label :rules="[{ required: true, message: '登入密码用户名不能为空' }]">
      <template #prefix>
        <icon-lock />
      </template>
      <a-input-password class="w-full" v-model="formState.password" size="large" placeholder="请输入登入密码" allow-clear />
    </a-form-item>
    <a-form-item field="nickName" hide-label :rules="[{ required: true, message: '用户昵称不能为空' }]">
      <template #prefix>
        <icon-idcard />
      </template>
      <a-input class="w-full" v-model="formState.nickName" size="large" placeholder="该账号昵称" />
    </a-form-item>
    <a-form-item field="phone" hide-label :rules="[{ required: true, message: '用户昵称不能为空' }]">
      <template #prefix>
        <icon-mobile />
      </template>
      <a-input class="w-full" v-model="formState.phone" size="large" placeholder="手机号（用于找回账号）" />
    </a-form-item>
    <a-form-item hide-label>
      <a-button type="primary" size="large" long html-type="submit">注册账号</a-button>
    </a-form-item>
  </a-form>

</template>

<script setup lang="ts">
import { IconMobile, IconIdcard, IconLock, IconUser } from '@arco-design/web-vue/es/icon';
import { reactive } from 'vue';
import { register } from '../../../api/user';
import { Message } from '@arco-design/web-vue';


const formState = reactive({
  username: '',
  password: '',
  nickName: '',
  phone: '',
});

const onSubmit = async () => {
  try {
    await register(formState);
    Message.success({
      content: '注册成功，快快登入吧！',
      duration: 3 * 1000,
    })
  } catch (err) { }
}


</script>
