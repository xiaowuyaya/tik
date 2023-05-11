<script setup>
import { useBlacklistStore } from '../store/blacklist'
import { useUserStore } from '../store/user'
import { reactive, ref } from 'vue'
import { environmentOption } from '../utils/options'
import { Check, Delete, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRankPage } from '../api/blacklist'
import dayjs from '../utils/dateUtil'

const blacklistStore = useBlacklistStore()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const blacklistData = ref([])
const blacklistRankData = ref([])
const formDataRules = ref({
  environment: [{ required: true, message: '所在大区不能为空哦', trigger: 'blur' }],
  summonerName: [{ required: true, message: '账号不能为空哦', trigger: 'blur' }],
  banName: [{ required: true, message: '拉黑玩家不能为空哦', trigger: 'blur' }],
})
const formData = reactive({
  environment: '',
  summonerName: '',
  summonerId: '',
  banName: '',
  reason: '',
})

async function submit(formEl) {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (valid) {
      await blacklistStore.add(formData)
    }
  })
}

async function handleDeleteBlacklist(record) {
  ElMessageBox.confirm(`是否确定将: ${record.banName}， 移除黑名单`, '移除黑名单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(async () => {
      await blacklistStore.del({ ids: [record.row.id] })
      // 重新获取数据
      await blacklistStore.get()
      blacklistData.value = blacklistStore.list
    })
    .catch(() => {})
}

async function reload() {
  loading.value = true
  await blacklistStore.get()
  const r = await getRankPage({ page: 1, limit: 1000 })
  blacklistRankData.value = []
  blacklistRankData.value = r.data.list
  loading.value = false
  ElMessage.success('刷新成功')
}

async function init() {
  loading.value = true
  await blacklistStore.get()
  blacklistData.value = blacklistStore.list
  formData.environment = userStore.environment
  formData.summonerName = userStore.summonerName
  formData.summonerId = userStore.summonerId

  const r = await getRankPage({ page: 1, limit: 99 })
  blacklistRankData.value = r.data.list
  loading.value = false
}

init()
</script>

<template>
  <div class="container">
    <el-card class="!w-full" shadow="never" body-style="padding: 10px 20px;">
      <el-form class="!w-full" :model="formData" ref="formRef" :rules="formDataRules" label-width="98px" label-position="left" hide-required-asterisk>
        <el-row class="w-full" :gutter="24">
          <el-col :span="8">
            <el-form-item label="玩家" prop="banName">
              <el-input v-model="formData.banName" placeholder="拉黑玩家的游戏名" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="拉黑原因" prop="reason">
              <el-input v-model="formData.reason" placeholder="拉黑玩家的原因（可为空）" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="w-full" :gutter="24">
          <el-col :span="8">
            <el-form-item label="所属账号" prop="summonerName">
              <el-input v-model="formData.summonerName" placeholder="绑定的玩家信息" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="所属大区" prop="environment">
              <el-select v-model="formData.environment" placeholder="请输入所在大区" filterable>
                <el-option v-for="(item, idx) in environmentOption" :key="idx" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-right">
            <el-button type="primary" :icon="Check" @click="submit(formRef)">确定拉黑</el-button>
            <el-button @click="reload" :icon="Refresh">刷新</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="!w-full flex-1 !mt-2" shadow="never" body-style="padding: 10px;">
      <el-table :data="blacklistData" style="width: 100%" v-loading="loading" max-height="540px" stripe>
        <el-table-column prop="environment" label="大区" align="center" width="100px" />
        <el-table-column prop="summonerName" label="账号" align="center" width="140px" />
        <el-table-column prop="banName" label="拉黑玩家" align="center" width="110px" />
        <el-table-column prop="reason" label="原因" />
        <el-table-column prop="createdAt" label="拉黑时间" align="center" width="170px">
          <template #default="scope">
            <span>{{ dayjs(scope.row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template #default="scope">
            <!--            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"-->
            <!--            >Edit</el-button-->
            <!--            >-->
            <el-button size="small" type="danger" :icon="Delete" @click="handleDeleteBlacklist(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
}
</style>
