<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { onBeforeMount, reactive } from 'vue'
import { bindSecretCode, checkBingXueVipAvailability } from '../../api/vip'
import dayjs from '../../utils/dateUtil'
import { copy } from '../../utils'
const shell = $shell
const expirationInfo = reactive({
  expiration: '',
  updateAt: '',
})

async function inject() {
  const res = await $dll.callBingxueServerInject()
  if (res == 0) {
    ElMessage.success('启动成功')
  } else {
    ElMessage.error('启动失败')
  }
}

function uninstall() {
  $dll.callBingxueServerUninstall()
  ElMessage.success('卸载成功')
}

async function bindSecret() {
  ElMessageBox.prompt('请输入你所购买的Tik-冰雪卡密', '绑定卡密', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(async ({ value }) => {
      await bindSecretCode(value)
      ElMessage.success('Tik-冰雪 卡密绑定成功')
    })
    .catch(() => {})
}

onBeforeMount(async () => {
  try {
    const resp = await checkBingXueVipAvailability()
    expirationInfo.expiration = resp.data.expiration
    expirationInfo.updateAt = resp.data.updateAt
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <el-card class="w-full" shadow="never" :body-style="{ padding: '8px' }">
      <el-descriptions :column="3" border>
        <el-descriptions-item label="当前账号状态">
          <el-tag type="success" v-show="dayjs().isBefore(dayjs(expirationInfo.expiration))">正常使用中</el-tag>
          <el-tag type="danger" v-show="!dayjs().isBefore(dayjs(expirationInfo.expiration))">非会员或已到期</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="到期时间">
          <span>{{ dayjs(expirationInfo.expiration).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="绑定时间">
          <span>{{ dayjs(expirationInfo.updateAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="绑定卡密">
          <el-link @click="bindSecret">点击绑定</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="获取卡密">
          <el-link @click="shell.openExternal('https://fffkkk.ookk.space/')">打开网址</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="咨询">
          <span>实时了解内容最新通知群：162408513</span>
          <el-link class="ml-3" @click="copy(162408513)">复制群号</el-link>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="w-full flex-1 mt-2" shadow="never" :body-style="{ padding: '8px' }">
      <div class="relative mx-auto max-w-7xl px-6 mt-32 text-center">
        <div class="mx-auto max-w-3xl">
          <p class="mt-2 text-4xl font-bold tracking-tight">冰雪英雄联盟换肤盒子</p>
          <p class="mt-6 text-lg leading-8">游戏中按F7呼出菜单，pageUp/pageDown换肤</p>
          <p class="text-left text-base leading-8">在游戏大厅中点击“启动”按钮，在弹出启动成功时代表已成功开启，待进入游戏后即可呼出菜单</p>
          <p class="text-left text-base leading-8">需要关闭功能时，点击“卸载”按钮即可，注意，卸载时会退出您的游戏客户端</p>
          <div class="flex mt-10 items-center justify-evenly">
            <el-button type="primary" :disabled="!dayjs().isBefore(dayjs(expirationInfo.expiration))" size="large" @click="inject">启动助手</el-button>
            <el-button type="danger" :disabled="!dayjs().isBefore(dayjs(expirationInfo.expiration))" size="large" @click="uninstall">关闭助手</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
el-card {
  background: none;
}
.container {
  height: 100%;
  width: 100%;
}
</style>
