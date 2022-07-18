<template>
  <div class="flex flex-col items-center justify-center h-full">
    <!-- title -->
    <h2 class="text-2xl font-bold text-center w-[100%]">注册</h2>
    <!-- form -->
    <el-form
      class="w-[70%]"
      label-position="top"
      :model="registerForm"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="registerForm.username"
          size="large"
          clearable
          placeholder="请输入用户名（登入使用）"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerForm.password"
          type="Password"
          size="large"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input
          v-model="registerForm.rePassword"
          type="Password"
          size="large"
          show-password
          placeholder="请再次输入密码"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="registerForm.nickName"
          size="large"
          clearable
          placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="mail">
        <el-input
          v-model="registerForm.mail"
          size="large"
          placeholder="请输入邮箱"
        />
      </el-form-item>

      <el-form-item>
        <div class="w-full">
          <el-button
            class="w-full"
            type="primary"
            size="large"
            @click="submitForm(formRef)"
            >注册</el-button
          >
        </div>
        <div class="w-full mt-4">
          <el-button class="w-full" size="large" @click="toRegister"
            >已有账号？去登录</el-button
          >
        </div>
        <!-- <el-button @click="resetForm(formRef)">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { register } from "@/api/user";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

const formRef = ref<FormInstance>();

const registerForm = reactive({
  username: "",
  password: "",
  rePassword: "",
  mail: "",
  nickName: ""
});

const checkRePassword = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入登录密码"));
  } else {
    if (registerForm.password !== value) {
      callback(new Error("两次密码输入不同"));
    }
    callback();
  }
};

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { min: 3, max: 32, message: "用户名长度为3到32位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "登录密码不能为空", trigger: "blur" },
    { min: 6, max: 32, message: "密码长度为3到32位", trigger: "blur" },
  ],
  rePassword: [{ validator: checkRePassword, trigger: "blur" }],
  nickName: [
    { required: true, message: "昵称不能为空", trigger: "blur" },
  ]
});

const doRegister = async () => {
  try {
    await register(registerForm);
    ElMessage({
      message: "注册成功！",
      type: "success",
      duration: 3 * 1000,
      offset: 50
    });
    toRegister();
  } catch (err) {}
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      doRegister();
    }
  });
};

let registerEmit = defineEmits(["toRegister"]);
const toRegister = () => {
  registerEmit("toRegister", true);
};
</script>

<style>
</style>