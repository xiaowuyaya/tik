<script setup>
import PaidServiceAuth from './PaidServiceAuth.vue'
import PaidContent from './PaidContent.vue'
import { useUserStore } from '../../store/user'
import {usePaidConfigStore} from "../../store/paidConfig";
import {ElMessage} from "element-plus";

const userStore = useUserStore()
const paidConfigStore = usePaidConfigStore()

try {
  paidConfigStore.init()
}catch (err) {
  ElMessage.error('付费配置文件初始化失败')
}
</script>

<template>
  <component :is="userStore.vipConfirmStatus === 1 ? PaidContent : PaidServiceAuth"></component>
</template>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
