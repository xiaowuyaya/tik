<template>
  <div class="flex flex-col w-full h-full">
    <a-card class="h-full" :hoverable="true"  :header-style="{ border: 'none' }">
      <div class="text-base font-medium text-gray-500 mb-0.5">账号信息修改</div>
      <a-form :model="userStore" :style="{ width: '600px' }">
        <a-form-item>
          <a-upload :action="uploadReq.url" :headers="uploadReq.headers as any" :fileList="file ? [file] : [] as any"
                    accept="image/png, image/jpeg, image/gif" :show-file-list="false" @success="handleAvatarSuccess"
                    @error="handleAvatarError">
            <template #upload-button>
              <div
                  :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''}`">
                <div class="arco-upload-list-picture custom-upload-avatar" v-if="file && file.url">
                  <img :src="file.url" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                  <a-progress v-if="file.status === 'uploading' && file.percent < 100" :percent="file.percent"
                              type="circle" size="mini" :style="{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                    }" />
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
          <a-input v-model="userStore.username" disabled />
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
          <a-button class="ml-2" type="primary" status="danger" @click="userStore.userLogout">退出账号</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../store/user';
import { getToken } from '../../utils/auth';
import { Message } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';

const userStore = useUserStore();

const uploadReq = reactive({
  url: $consts.ROOT_URI + '/user/updateAvatar',
  headers: { Authorization: getToken() },
});

const file = ref({
  url: userStore.avatarUrl,
  status: '',
  percent: 0
});

const handleAvatarSuccess = async () => {
  Message.success({
    content: '头像信息更新成功',
    duration: 1500
  })
  await userStore.userInfo({ mac: $tools.PC_MAC, clientVersion: $tools.APP_VERSION });
  file.value.url = userStore.avatarUrl;
};

const handleAvatarError = (error: any) => {
  Message.error({
    content: `头像更新失败:${error}`,
    duration: 3000
  })
};

const submit = async () => {
  await userStore.updateUser();
  await userStore.userInfo({ mac: $tools.PC_MAC, clientVersion: $tools.APP_VERSION });
};
</script>
