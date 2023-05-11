<script setup>
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { bindSecretCode, checkBingXueVipAvailability, checkVipAvailability } from '../../api/vip'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { usePaidConfigStore } from '../../store/paidConfig'

const shell = $shell
const router = useRouter()
const paidConfigStore = usePaidConfigStore()

async function handleServer(name) {
  try {
    if (name === '101') {
      await checkVipAvailability()
      paidConfigStore.server = '101'
      router.push('/PaidServer101')
    }
    if (name === 'bingxue') {
      await checkBingXueVipAvailability()
      paidConfigStore.server = 'bingxue'
      router.push('/PaidServerBingxue')
    }
  } catch (err) {
    ElMessage.error('暂无权限进入功能页，非付费用户或已到期')
  }
}

async function bindSecret(name) {
  try {
    ElMessageBox.prompt(`请输入你所购买的Tik卡密`, '绑定卡密', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(async ({ value }) => {
        await bindSecretCode(value)
        ElMessage.success(`Tik卡密绑定成功`)
      })
      .catch(() => {})
  } catch (err) {
    ElMessage.error(err.msg)
  }
}
</script>

<template>
  <div class="container relative overflow-hidden pt-4 pb-96">
    <div class="relative mx-auto max-w-7xl px-6 text-center">
      <div class="mx-auto max-w-2xl">
        <p class="mt-2 text-4xl font-bold tracking-tight">TikLeagueTool 付费内容</p>
        <p class="mt-6 text-lg leading-8">请选择你所购买的服务，并进入功能页面</p>
      </div>
      <div class="mt-4 mx-auto max-w-3xl flex items-center justify-between">
        <el-card shadow="hover" class="w-[288px] h-[440px]">
          <div class="flex flex-col text-left">
            <h3 class="text-2xl font-semibold leading-8 title">Tik for 101换肤</h3>
            <desc class="text-left mt-2 mb-2 text-[var(--el-color-info)]"> 最早与Tik合作的局内助手工具，系101对战助手衍生付费内容。 </desc>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">适用国服</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">全系统支持</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">局内换肤、无限视距</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">技能CD计时</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">攻击范围、技能范围</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">补刀提醒</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">局外换肤</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">局外开关配置</h3>
            </div>
            <el-divider>还有更多</el-divider>
            <el-button class="w-full mt-2" type="primary" @click="handleServer('101')">进入工具</el-button>
            <el-button class="w-full !ml-0 mt-2" @click="bindSecret('101')">绑定卡密</el-button>
          </div>
        </el-card>
        <el-card shadow="hover" class="w-[288px] h-[440px]">
          <div class="flex flex-col text-left">
            <h3 class="text-2xl font-semibold leading-8 title">冰雪换肤</h3>
            <desc class="text-left mt-2 mb-2 text-[var(--el-color-info)]">老牌换肤，系冰雪英雄联盟助手衍生付费内容。 </desc>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">适用国服</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">局内换肤、无限视距、防Gank提醒</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">技能CD计时</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">攻击范围、技能范围</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">补刀提醒</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">局内换肤、自定义皮肤</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#409eff" size="1.3rem">
                <SuccessFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">局内菜单</h3>
            </div>
            <div class="flex items-center py-1">
              <el-icon color="#f56c6c" size="1.3rem">
                <CircleCloseFilled />
              </el-icon>
              <h3 class="text-[14px] ml-2">不支持win11</h3>
            </div>
            <el-divider>还有更多</el-divider>
            <el-button class="w-full mt-2" type="primary" @click="handleServer('bingxue')">进入工具</el-button>
            <el-button class="w-full !ml-0 mt-2" @click="bindSecret('bingxue')">绑定卡密</el-button>
          </div>
        </el-card>
      </div>
      <el-card shadow="never" class="mt-4 mx-auto max-w-3xl">
        <div class="text-left">
          <p>您可以点击右侧链接购买商品使用 <el-link type="primary" @click="shell.openExternal('https://fffkkk.ookk.space/')">前往商城</el-link> <span>或添加付费群：162408513</span></p>
          <p>本模块内容均由第三方服务商提供，TikLeagueTool本身不包含相关组件，付费模块所需组件将在开通服务后下载，盒子功能都差不多，供用户按自己习惯选择。</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.el-divider--horizontal {
  margin: 12px 0 !important;
}

el-card {
  padding: 20px !important;
}

.container {
  .title {
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
}
</style>
