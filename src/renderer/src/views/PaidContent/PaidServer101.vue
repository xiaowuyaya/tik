<script setup>
import { usePaidConfigStore } from '../../store/paidConfig'
import { useAppConfigStore } from '../../store/appConfig'
import { onBeforeMount, reactive } from 'vue'
import { bindSecretCode, checkVipAvailability } from '../../api/vip'
import dayjs from '../../utils/dateUtil'
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import { copy } from '../../utils'
import { Check, Close } from '@element-plus/icons-vue'
import { vipSkinOptions } from '../../utils/options'

const paidConfigStore = usePaidConfigStore()
const shell = $shell

const keysDefault = reactive({
  send: 0,
  skinDown: 0,
  skinUp: 0,
})
const expirationInfo = reactive({
  expiration: '',
  updateAt: '',
})

async function bindSecret() {
  ElMessageBox.prompt('请输入你所购买的Tik-101卡密', '绑定卡密', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(async ({ value }) => {
      await bindSecretCode(value)
      ElMessage.success('Tik-101 卡密绑定成功')
    })
    .catch(() => {})
}

onBeforeMount(async () => {
  paidConfigStore.server = '101'
  try {
    const resp = await checkVipAvailability()
    expirationInfo.expiration = resp.data.expiration
    expirationInfo.updateAt = resp.data.updateAt
    await paidConfigStore.init()

    ElNotification({
      title: '注意',
      message: '如果开关项无法使用，重新开关总开关即可。部分轨迹功能可能会导致游戏闪退',
      duration: 0,
    })
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
      <el-scrollbar max-height="100%">
        <el-form class="h-[564px] w-full p-2" :model="paidConfigStore" label-position="right" label-width="100px">
          <el-row class="!w-full px-4 border-b border-gray-200 dark:border-[var(--el-border-color)]" :gutter="24">
            <el-col :span="4">
              <el-form-item label="功能总开关">
                <el-switch v-model="paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="技能CD发送">
                <el-select v-model="keysDefault.send">
                  <el-option label="~" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="皮肤切换 上">
                <el-select v-model="keysDefault.skinUp">
                  <el-option label="PageUp" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="皮肤切换 下">
                <el-select v-model="keysDefault.skinUp">
                  <el-option label="PageDown" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <h1 class="font-semibold text-lg mt-3 mb-2">一般</h1>
          <el-row class="!w-full px-4 border-b border-gray-200 dark:border-[var(--el-border-color)]" :gutter="24">
            <el-col :span="4">
              <el-form-item label="自动换肤">
                <el-switch v-model="paidConfigStore.server101.Func.自动换肤" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="云顶换肤">
                <el-switch v-model="paidConfigStore.server101.Func.云顶换肤" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="血液补丁">
                <el-switch v-model="paidConfigStore.server101.Func.血液补丁" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="无限视距">
                <el-switch v-model="paidConfigStore.server101.Func.无限视距" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="补刀提示">
                <el-switch v-model="paidConfigStore.server101.Func.补刀提示" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="血蓝数值">
                <el-switch v-model="paidConfigStore.server101.Func.血蓝显示" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="特殊皮肤修复">
                <el-switch v-model="paidConfigStore.server101.Func.皮肤修复" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="人物模型调整">
                <el-switch v-model="paidConfigStore.server101.Func.人物大小" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="皮肤提示">
                <el-switch v-model="paidConfigStore.server101.Func.皮肤提示" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="经验显示">
                <el-switch v-model="paidConfigStore.server101.Func.经验显示" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
          </el-row>

          <h1 class="font-semibold text-lg mt-3 mb-2">敌方相关</h1>
          <el-row class="!w-full px-4 border-b border-gray-200 dark:border-[var(--el-border-color)]" :gutter="24">
            <el-col :span="4">
              <el-form-item label="技能计时">
                <el-switch v-model="paidConfigStore.server101.Func.敌方计时" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="技能CD发送">
                <el-switch v-model="paidConfigStore.server101.Func.敌方推送" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="技能轨迹">
                <el-switch v-model="paidConfigStore.server101.Func.敌方轨迹" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="陷阱透视">
                <el-switch v-model="paidConfigStore.server101.Func.陷阱透视" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="陷阱计时">
                <el-switch v-model="paidConfigStore.server101.Func.陷阱计时" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="眼位透视">
                <el-switch v-model="paidConfigStore.server101.Func.眼位透视" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="眼位计时">
                <el-switch v-model="paidConfigStore.server101.Func.眼位计时" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="眼位范围">
                <el-switch v-model="paidConfigStore.server101.Func.眼位范围" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="走位轨迹">
                <el-switch v-model="paidConfigStore.server101.Func.走位轨迹" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="敌方野怪">
                <el-switch v-model="paidConfigStore.server101.Func.敌方野怪" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="野怪计时">
                <el-switch v-model="paidConfigStore.server101.Func.敌方野计" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="普攻范围">
                <el-switch v-model="paidConfigStore.server101.Func.敌方普攻" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="炮塔范围">
                <el-switch v-model="paidConfigStore.server101.Func.敌方炮塔" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
          </el-row>

          <h1 class="font-semibold text-lg mt-3 mb-2">友方相关</h1>
          <el-row class="!w-full px-4 border-b border-gray-200 dark:border-[var(--el-border-color)]" :gutter="24">
            <el-col :span="4">
              <el-form-item label="技能计时">
                <el-switch v-model="paidConfigStore.server101.Func.友方计时" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="技能CD发送">
                <el-switch v-model="paidConfigStore.server101.Func.友方推送" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="技能轨迹">
                <el-switch v-model="paidConfigStore.server101.Func.友方轨迹" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="野怪监控">
                <el-switch v-model="paidConfigStore.server101.Func.友方野怪" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="野怪计时">
                <el-switch v-model="paidConfigStore.server101.Func.友方野计" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="普攻范围">
                <el-switch v-model="paidConfigStore.server101.Func.友方普攻" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="炮塔范围">
                <el-switch v-model="paidConfigStore.server101.Func.友方炮塔" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
          </el-row>

          <h1 class="font-semibold text-lg mt-3 mb-2">自己相关</h1>
          <el-row class="!w-full px-4 border-b border-gray-200 dark:border-[var(--el-border-color)]" :gutter="24">
            <el-col :span="4">
              <el-form-item label="Q技能范围">
                <el-switch v-model="paidConfigStore.server101.Func.Q技能范围" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="W技能范围">
                <el-switch v-model="paidConfigStore.server101.Func.W技能范围" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="E技能范围">
                <el-switch v-model="paidConfigStore.server101.Func.E技能范围" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="R技能范围">
                <el-switch v-model="paidConfigStore.server101.Func.R技能范围" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="普攻范围">
                <el-switch v-model="paidConfigStore.server101.Func.普攻范围" :disabled="!paidConfigStore.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </el-form-item>
            </el-col>
          </el-row>

          <h1 class="font-semibold text-lg mt-3 mb-2">效果相关</h1>
          <el-row class="!w-full px-4 border-b border-gray-200 dark:border-[var(--el-border-color)]" :gutter="24">
            <el-col :span="6">
              <el-form-item label="回城特效">
                <el-select v-model="paidConfigStore.server101.Skin.Telepor">
                  <el-option v-for="item in vipSkinOptions.Telepor" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="纳什男爵">
                <el-select v-model="paidConfigStore.server101.Skin.Baron">
                  <el-option v-for="item in vipSkinOptions.Baron" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="小兵">
                <el-select v-model="paidConfigStore.server101.Skin.Minion">
                  <el-option v-for="item in vipSkinOptions.Minion" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="蓝BUFF">
                <el-select v-model="paidConfigStore.server101.Skin.Blue">
                  <el-option v-for="item in vipSkinOptions.Blue" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="红BUFF">
                <el-select v-model="paidConfigStore.server101.Skin.Red">
                  <el-option v-for="item in vipSkinOptions.Red" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="河蟹">
                <el-select v-model="paidConfigStore.server101.Skin.Crab">
                  <el-option v-for="item in vipSkinOptions.Crab" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="六鸟">
                <el-select v-model="paidConfigStore.server101.Skin.Razorbeak">
                  <el-option v-for="item in vipSkinOptions.Razorbeak" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="石头人">
                <el-select v-model="paidConfigStore.server101.Skin.Krug">
                  <el-option v-for="item in vipSkinOptions.Krug" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
el-card {
  background: none !important;
}
</style>
