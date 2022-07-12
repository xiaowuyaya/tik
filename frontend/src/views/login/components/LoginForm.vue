<template>
  <div class="flex flex-col items-center justify-center h-full">
    <!-- title -->
    <h2 class="text-2xl font-bold text-center w-[100%]">登录</h2>
    <!-- form -->
    <el-form
      class="w-[70%]"
      label-position="top"
      :model="loginForm"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="loginForm.username"
          size="large"
          clearable
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="Password"
          size="large"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <!-- <el-form-item label="Activity form">
        <el-input v-model="" />
      </el-form-item> -->
      <el-form-item>
        <div class="w-full">
          <el-button
            class="w-full"
            type="primary"
            size="large"
            @click="submitForm(formRef)"
            >登录</el-button
          >
        </div>
        <div class="w-full mt-4">
          <el-button class="w-full" size="large" @click="toRegister"
            >注册</el-button
          >
        </div>
        <!-- <el-button @click="resetForm(formRef)">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

const formRef = ref<FormInstance>();

const loginForm = reactive({
  username: "",
  password: "",
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { min: 3, max: 32, message: "用户名长度为3到32位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "登录密码不能为空", trigger: "blur" },
    { min: 6, max: 32, message: "密码长度为3到32位", trigger: "blur" },
  ],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // TODO:LOGIN
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