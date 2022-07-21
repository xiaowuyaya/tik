<template>
  <div class="flex flex-col p-2">
    <a-card class="h-full" :hoverable="true" title="账号信息修改" :header-style="{ border: 'none' }">
      <a-form :model="userStore" :style="{ width: '600px' }">
        <a-form-item>
          <a-upload
            :action="uploadReq.url"
            :headers="uploadReq.headers"
            :fileList="file ? [file] : []"
            accept="image/png, image/jpeg, image/gif"
            :show-file-list="false"
            @success="handleAvatarSuccess"
            @error="handleAvatarError"
          >
            <template #upload-button>
              <div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''}`">
                <div class="arco-upload-list-picture custom-upload-avatar" v-if="file && file.url">
                  <img :src="file.url" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                  <a-progress
                    v-if="file.status === 'uploading' && file.percent < 100"
                    :percent="file.percent"
                    type="circle"
                    size="mini"
                    :style="{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                    }"
                  />
                </div>
                <div class="arco-upload-picture-card" v-else>
                  <div class="arco-upload-picture-card-text">
                    <IconPlus />
                    <div style="margin-top: 10px; font-weight: 600">Upload</div>
                  </div>
                </div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
        <a-form-item field="nickName" label="登入账号">
          <a-input v-model="userStore.username"  disabled />
        </a-form-item>
        <a-form-item field="nickName" label="用户昵称">
          <a-input v-model="userStore.nickName" max-length="8" placeholder="请输入显示的昵称" />
        </a-form-item>
        <a-form-item field="email" label="邮箱">
          <a-input v-model="userStore.email" max-length="32" placeholder="请输入您的邮箱地址" />
        </a-form-item>
        <a-form-item field="phone" label="手机号">
          <a-input v-model="userStore.phone" max-length="11" placeholder="请输入你的手机号" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submit">提交更新</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useAppInfoStore } from '@/stores/modules/appInfo';
import { useUserStore } from '@/stores/modules/user';
import { getToken } from '@/utils/auth';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

const userStore = useUserStore();
const appInfoStore = useAppInfoStore();

const baseUrl = import.meta.env.VITE_APP_BASE_API;

const uploadReq = reactive({
  url: baseUrl + '/user/updateAvatar',
  headers: { Authorization: getToken() },
});

const file = ref({
  url: baseUrl + userStore.avatarUrl,
  status: '',
  percent: 0
});

const handleAvatarSuccess = async () => {
  ElMessage({
    message: `头像更新成功`,
    type: 'success',
    duration: 3 * 1000,
    offset: 45,
  });
  await userStore.myInfo({ mac: appInfoStore.macAddr, clientVersion: appInfoStore.appVersion });
  file.value.url = baseUrl + userStore.avatarUrl;
};

const handleAvatarError = (error) => {
  ElMessage({
    message: `头像更新失败:${error}`,
    type: 'error',
    duration: 3 * 1000,
    offset: 45,
  });
};

const submit = async () => {
  await userStore.updateUser();
  await userStore.myInfo({ mac: appInfoStore.macAddr, clientVersion: appInfoStore.appVersion });
};
</script>
