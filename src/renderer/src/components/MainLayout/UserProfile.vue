<script setup>
import { MoreFilled, User, SwitchButton, Unlock } from '@element-plus/icons-vue'
import { useUserStore } from '../../store/user'

const props = defineProps({
  username: { type: String, required: true },
  nickname: { type: String, required: true },
  avatar: { type: String, required: true },
})

const shell = $shell
const constant = $constant
const userStore = useUserStore()
</script>

<template>
  <el-dropdown>
    <div class="inline-block px-3 text-left w-full">
      <div class="group w-full rounded-md px-3.5 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#1d1e1f]">
        <span class="flex w-full items-center justify-between">
          <span class="flex min-w-0 items-center justify-between space-x-4">
            <img class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" v-if="props.avatar" :src="props.avatar" alt="avatar" />
            <img class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" v-if="!props.avatar" src="../../assets/default_avatar.png" alt="avatar" />
            <span class="flex min-w-0 flex-1 flex-col pr-2">
              <span class="font-bold truncate">{{ props.nickname }}</span>
              <span class="truncate text-sm text-gray-500 dark:text-gray-400">@{{ props.username }}</span>
            </span>
          </span>
          <MoreFilled class="h-5 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
        </span>
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-icon size="16px"><User /></el-icon>
          <div class="px-2 text-sm">检阅资料</div>
        </el-dropdown-item>
        <el-dropdown-item @click="shell.openExternal(`${constant.HOME_URI}/account?type=1`)">
          <el-icon size="16px"><Unlock /></el-icon>
          <div class="px-2 text-sm">忘记密码</div>
        </el-dropdown-item>
        <el-dropdown-item @click="userStore.logout()">
          <el-icon size="16px"><SwitchButton class="!text-red-500" /></el-icon>
          <div class="px-2 text-red-500 text-sm">退出登入</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="less"></style>
