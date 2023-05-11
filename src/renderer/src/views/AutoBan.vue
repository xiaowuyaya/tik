<script setup>
import { useAppConfigStore } from '../store/appConfig'
import { Check, Close, QuestionFilled } from '@element-plus/icons-vue'
import { championOptions } from '../utils/options'
import {ElMessage} from "element-plus";

const appConfigStore = useAppConfigStore()
ElMessage.warning('如有遇到无法更改的问题，请开关相关项目即可！')
</script>

<template>
  <div class="container">
    <el-card shadow="nerver" class="w-full" :body-style="{ padding: '16px' }">
      <h1 class="container-title font-semibold text-2xl">自动禁选英雄配置</h1>
      <div class="flex flex-col mt-4 px-14">
        <div class="w-full !py-2 flex flex-col items-start border-b border-[var(--el-border-color)]">
          <div class="w-full flex items-center justify-between">
            <h3 class="font-semibold text-[16px]">自动锁定</h3>
            <div>
              <el-switch v-model="appConfigStore.autoBanPick.confirmSelect" size="large" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            </div>
          </div>
          <desc class="mt-1 text-[14px]">当启用自动禁选，自动选择英雄是是否自动确定，如果未启动该选项，软件仅会选择到配置的禁选英雄而不锁定。 </desc>
        </div>
        <div class="w-full !py-2 flex flex-col items-start border-b border-[var(--el-border-color)]">
          <div class="w-full flex items-center justify-between">
            <h3 class="font-semibold text-[16px]">启用秒选</h3>
            <div>
              <el-switch v-model="appConfigStore.autoBanPick.pick.enable" size="large" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            </div>
          </div>
          <desc class="mt-1 text-[14px]">在`英雄选择`的选择英雄阶段根据配置内容自动选择英雄 </desc>
        </div>
        <div class="w-full !py-2 flex flex-col items-start">
          <div class="w-full flex items-center justify-between">
            <h3 class="font-semibold text-[16px]">启用禁选</h3>
            <div>
              <el-switch v-model="appConfigStore.autoBanPick.ban.enable" size="large" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            </div>
          </div>
          <desc class="mt-1 text-[14px]">在`英雄选择`的禁用阶段根据配置内容自动禁用英雄 </desc>
        </div>
      </div>
    </el-card>
    <div class="flex mt-2 flex-1">
      <el-card shadow="nerver" class="!w-full h-full mr-2" :body-style="{ padding: '16px' }">
        <h1 class="font-semibold text-lg flex items-center">
          选取相关
          <el-tooltip content="可以配置多项，当英雄已被其他玩家选择或被禁用时，将按照顺序先后尝试选用英雄">
            <el-icon class="ml-2"><QuestionFilled /></el-icon>
          </el-tooltip>
        </h1>
        <el-form class="mt-2 px-6" :model="appConfigStore.autoBanPick.pick">
          <el-form-item label="普通">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.pick.normal" filterable :options="championOptions" placeholder="可以直接选取英雄的游戏模式, 如匹配等" multiple />
          </el-form-item>
          <el-form-item label="上单">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.pick.top" filterable :options="championOptions" placeholder="排位模式下需要选用的上路英雄" multiple />
          </el-form-item>
          <el-form-item label="打野">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.pick.jungle" filterable :options="championOptions" placeholder="排位模式下需要选用的打野英雄" multiple />
          </el-form-item>
          <el-form-item label="中单">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.pick.middle" filterable :options="championOptions" placeholder="排位模式下需要选用的中单英雄" multiple />
          </el-form-item>
          <el-form-item label="下路">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.pick.bottom" filterable :options="championOptions" placeholder="排位模式下需要选用的下路英雄" multiple />
          </el-form-item>
          <el-form-item label="辅助">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.pick.utility" filterable :options="championOptions" placeholder="排位模式下需要选用的辅助英雄" multiple />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="nerver" class="!w-full" :body-style="{ padding: '16px' }">
        <h1 class="font-semibold text-lg">
          禁用相关
          <el-tooltip content="可以配置多项，当英雄已被其他玩家选择或被禁用时，将按照顺序先后尝试禁用英雄">
            <el-icon class="ml-2"><QuestionFilled /></el-icon>
          </el-tooltip>
        </h1>
        <el-form class="mt-2 px-6" :model="appConfigStore.autoBanPick.pick">
          <el-form-item label="普通">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.ban.normal" filterable :options="championOptions" placeholder="可以直接选取英雄的游戏模式, 如匹配等" multiple />
          </el-form-item>
          <el-form-item label="上单">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.ban.top" filterable :options="championOptions" placeholder="排位模式下需要禁用的上路英雄" multiple />
          </el-form-item>
          <el-form-item label="打野">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.ban.jungle" filterable :options="championOptions" placeholder="排位模式下需要禁用的打野英雄" multiple />
          </el-form-item>
          <el-form-item label="中单">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.ban.middle" filterable :options="championOptions" placeholder="排位模式下需要禁用的中单英雄" multiple />
          </el-form-item>
          <el-form-item label="下路">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.ban.bottom" filterable :options="championOptions" placeholder="排位模式下需要禁用的下路英雄" multiple />
          </el-form-item>
          <el-form-item label="辅助">
            <el-select-v2 class="w-full" v-model="appConfigStore.autoBanPick.ban.utility" :options="championOptions" placeholder="排位模式下需要禁用的辅助英雄" multiple />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.el-card {
  background: none;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .container-title {
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
}
</style>
