<template>
  <t-form class="w-full" ref="form" :data="formData" :rules="FORM_RULES" label-width="0" @submit="onSubmit">
    <t-form-item name="username">
      <t-input class="w-full" v-model="formData.username" size="large" placeholder="请输入登入用户名">
        <template #prefix-icon>
          <user-icon />
        </template>
      </t-input>
    </t-form-item>
    <t-form-item name="password">
      <t-input v-model="formData.password" size="large" :type="showPsw ? 'text' : 'password'" clearable
        placeholder="请输入登入密码">
        <template #prefix-icon>
          <lock-on-icon />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>
    <t-form-item name="nickName">
      <t-input v-model="formData.nickName" size="large" clearable placeholder="该账号昵称">
        <template #prefix-icon>
          <control-platform-icon />
        </template>
      </t-input>
    </t-form-item>
    <t-form-item name="nickName">
      <t-input v-model="formData.phone" size="large" clearable placeholder="手机号（用于找回账号）">
        <template #prefix-icon>
          <mobile-icon />
        </template>
      </t-input>
    </t-form-item>
    <t-form-item>
      <t-button block size="large" type="submit"> 注册账号 </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { UserIcon, BrowseIcon, BrowseOffIcon, LockOnIcon, ControlPlatformIcon, MobileIcon } from 'tdesign-icons-vue-next'
import { FormInstanceFunctions } from 'tdesign-vue-next';
import { useAppStore } from '../../../stores/app'
import { ref } from 'vue';

const appStore = useAppStore()

const INITIAL_DATA = {
  username: '',
  password: '',
  nickName: '',
  phone: '',
}

const FORM_RULES: any = {
  username: [{ required: true, message: '登入用户名不能为空', type: 'error' }],
  password: [{ required: true, message: '登入密码用户名不能为空', type: 'error' }],
  nickName: [{ required: true, message: '用户昵称不能为空', type: 'error' }],
  phone: [{ required: true, message: '手机号不能为空', type: 'error' }],
};

const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const onSubmit = async () => { }


</script>
