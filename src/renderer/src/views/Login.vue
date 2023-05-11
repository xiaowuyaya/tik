<script setup>
import { User, Lock, Close } from '@element-plus/icons-vue'
import { reactive, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { getCaptcha } from '../api/common'
import { getToken } from '../utils/auth'

const router = useRouter()
const userStore = useUserStore()

const constant = $constant
const shell = $shell
const captchaImg = ref('')
const loginFormRef = ref()
const loginFormState = reactive({
  username: '',
  password: '',
  captchaId: '',
  verifyCode: '',
  clientVersion: $constant.APP_VERSION,
  mac: $constant.PC_MAC,
})
const loginFormRules = reactive({
  username: [{ required: true, message: '用户名不能为空哦', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空哦', trigger: 'blur' }],
  verifyCode: [{ required: true, message: '验证码不能为空哦', trigger: 'blur' }],
})

onBeforeMount(async () => {
  const token = getToken()
  if (token) {
    await userStore.currentUserInfo({ mac: $constant.PC_MAC, clientVersion: $constant.APP_VERSION })
    router.push('/LoadingLaunch')
  }
  await getCaptchaImg()
})

const getCaptchaImg = async () => {
  const res = await getCaptcha()
  const { id, img } = res.data
  loginFormState.captchaId = id
  captchaImg.value = `data:image/png;base64,${img}`
}

const submitForm = async formEl => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      try {
        await userStore.login(loginFormState)
        setTimeout(() => {
          router.push('/LoadingLaunch')
        }, 2500)
      } catch (err) {
        loginFormState.verifyCode = ''
        await getCaptchaImg()
      }
    }
  })
}

function exitApp() {
  window.electron.ipcRenderer.send('exit-app', '')
}
</script>

<template>
  <div class="login-container user-drag">
    <el-button class="absolute top-4 right-4 !no-drag" circle :icon="Close" @click="exitApp" />
    <div class="w-[43%] h-full bg-white px-[5rem] pt-16 flex flex-col border-r border-gray-100">
      <img class="w-16" src="../assets/logo.png" alt="logo" />
      <h1 class="login-title text-[2rem] mt-10 font-semibold">登入</h1>
      <h3 class="mt-2 font-semibold text-lg text-gray-800">登入到 <span class="text-sky-500">TikLeagueTool</span> 以获取完整服务内容</h3>
      <el-divider></el-divider>
      <!-- 表单 -->
      <el-form class="mt-8 no-drag" label-position="top" ref="loginFormRef" :model="loginFormState" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginFormState.username" maxlength="16" size="large" placeholder="请输入登入用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginFormState.password" type="password" maxlength="24" show-password size="large" placeholder="请输入密码" :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="verifyCode" class="flex">
          <el-input v-model="loginFormState.verifyCode" class="!w-[78%]" size="large" placeholder="请输入右侧验证码" />
          <img class="h-[var(--el-component-size-large)] ml-1 flex-1 border cursor-pointer" :src="captchaImg" alt="" @click="getCaptchaImg" />
        </el-form-item>
        <div class="flex justify-between w-full mb-4">
          <a class="font-bold text-gray-700" href="#" @click="shell.openExternal(`${constant.HOME_URI}/account?type=1`)">忘记密码？</a>
          <a class="font-bold" style="color: #5046e5" @click="shell.openExternal(`${constant.HOME_URI}/account?type=0`)">注册账号</a>
        </div>
        <el-form-item>
          <el-button class="w-full" size="large" color="#5046e5" @click="submitForm(loginFormRef)">登入</el-button>
        </el-form-item>
      </el-form>
      <div class="tracking-tight text-gray-800 text-sm absolute bottom-2 pl-[5rem]">
        <span>Copyright © 2022 - {{ new Date().getFullYear() }} <i>xiaowuyaya</i> Contributors.</span>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.el-input-group__append {
  padding: 0;
}

.login-container {
  width: 100%;
  height: 100%;
  background-image: url('../assets/login_bg.jpg');
  background-size: cover;

  .login-title {
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
}
</style>
