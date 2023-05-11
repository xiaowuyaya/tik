<script setup>
import { reactive, ref } from 'vue'
import { useAppConfigStore } from '../store/appConfig'
import { Check, Close, QuestionFilled } from '@element-plus/icons-vue'
import { keyCodeOptions } from '../utils/options'
import { ElMessage } from 'element-plus'
import { copy } from '../utils'
import { recordVipConfirmStatus } from '../api/vip'
import { useUserStore } from '../store/user'
import { getClientUserConfig } from '../api/user'
import dayjs from '../utils/dateUtil'

const shell = $shell
const constant = $constant
const userStore = useUserStore()
const appConfigStore = useAppConfigStore()
const qqGroup = 'https://qm.qq.com/cgi-bin/qm/qr?k=9HNfbMmM3ISfaX2YBjyJrD5r_Xgt8Bio&jump_from=webapi'
const lastSyncConfigTime = ref('')

const playerTitle = ref([])
const showModal = reactive({
  playTitle: false,
  hotKey: false,
})
const sendTextTemplate = ref(appConfigStore.sendPlayerLevelInfo.template)

function savePlayTitle(){
  appConfigStore.sendPlayerLevelInfo.title = playerTitle.value
  showModal.playTitle = false
}

function handleSendTextTemplate(type) {
  if (type === 0) {
    appConfigStore.sendPlayerLevelInfo.template = sendTextTemplate.value
    ElMessage.success('称号模板修改成功')
  } else {
    appConfigStore.sendPlayerLevelInfo.template = '{称号}:{玩家名},kda:{kda},胜率:{胜率},近期:{对局}'
    ElMessage.success('称号模板重置成功')
  }
}

function resetStore() {
  $store.appConfigStore.reset()
  ElMessage.success('重置完成, 重启软件后生效')
}

const resetVipFunc = async () => {
  await recordVipConfirmStatus(0)
  ElMessage.success('重置成功')
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

function checkUpdater() {
  window.electron.ipcRenderer.send('check_updater', '')
}

async function init() {
  const { data } = await getClientUserConfig()
  lastSyncConfigTime.value = data.updatedAt
  playerTitle.value = appConfigStore.sendPlayerLevelInfo.title
}

init()
</script>

<template>
  <div class="settings-container">
    <el-form class="flex-1 mr-2 h-full flex flex-col" :model="appConfigStore" label-width="140px" label-position="left">
      <el-card shadow="nerver" class="w-full" :body-style="{ padding: '16px' }">
        <h1 class="font-semibold text-lg">功能设置</h1>
        <div class="mt-2 px-6">
          <el-form-item label="启用符文窗口">
            <el-switch v-model="appConfigStore.champToolWin.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            <el-tooltip content="在进入英雄选择阶段时自动弹出符文应用窗口，该窗口根据选择的英雄获取相应数据" placement="right">
              <el-icon class="ml-4" size="16px"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="符文窗口跟随客户端">
            <el-switch v-model="appConfigStore.champToolWin.flowGameWin" inline-prompt :active-icon="Check" :inactive-icon="Close" />
          </el-form-item>
          <el-form-item label="黑名单提醒方式" style="margin-bottom: 0">
            <el-radio-group v-model="appConfigStore.blacklistNotice">
              <el-radio :label="true">所有人可见</el-radio>
              <el-radio :label="false">仅自己可见</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-card>
      <el-card shadow="nerver" class="w-full mt-2" :body-style="{ padding: '16px' }">
        <h1 class="font-semibold text-lg">面板设置</h1>
        <div class="mt-2 px-6">
          <el-form-item label="启用发送组排信息">
            <el-switch v-model="appConfigStore.sendCoPlayer" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            <el-tooltip content="在进入选择英雄阶段将自动在聊天框发送那些玩家是组队游戏的信息" placement="right">
              <el-icon class="ml-4" size="16px"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="启用快捷键发送">
            <el-switch v-model="appConfigStore.sendPlayerLevelInfo.enable" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            <el-tooltip content="可以通过按下快捷键在“选择英雄界面”或“游戏中”发送友方或敌方的上等马信息（包括KDA，近期战绩情况等）" placement="right">
              <el-icon class="ml-4" size="16px"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="仅显示排位数据" style="margin-bottom: 0">
            <el-switch v-model="appConfigStore.onlyRankData" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            <el-tooltip content="对局面板以及快捷发送的对局数据仅保留单双排以及灵活组排的对局数据" placement="right">
              <el-icon class="ml-4" size="16px"><QuestionFilled /></el-icon>
            </el-tooltip>
          </el-form-item>
        </div>
      </el-card>
      <el-card shadow="nerver" class="w-full mt-2 flex-1" :body-style="{ padding: '16px' }">
        <h1 class="font-semibold text-lg">快捷键设置</h1>
        <div class="mt-2 px-6">
          <el-form-item label="称号更改">
            <el-button @click="showModal.playTitle = true">打开称号配置</el-button>
          </el-form-item>
          <el-form-item label="自定义快捷键">
            <el-button @click="showModal.hotKey = true">打开快捷键配置</el-button>
          </el-form-item>
          <el-form-item label="发送对局数量">
            <el-input-number v-model="appConfigStore.sendPlayerLevelInfo.matchNum" :min="1" :max="5" />
          </el-form-item>
          <el-form-item label="发送对局数量">
            <el-input class="!w-[71%]" v-model="sendTextTemplate" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" />
            <el-button-group class="ml-4">
              <el-button type="primary" @click="handleSendTextTemplate(0)">修改</el-button>
              <el-button @click="handleSendTextTemplate(1)">重置</el-button>
            </el-button-group>
          </el-form-item>
        </div>
      </el-card>

      <!-- 面板称号更改配置 -->
      <el-dialog v-model="showModal.playTitle" title="面板称号更改" width="33%">
        <div class="mb-3">* 部分称号在快捷发送时可能会被游戏屏蔽</div>
        <div class="mt-4 px-6">
          <el-form-item label="第一" label-width="68px">
            <el-input v-model="playerTitle[0]" placeholder="请输入排名第一的称号" />
          </el-form-item>
          <el-form-item label="第二" label-width="68px">
            <el-input v-model="playerTitle[1]" placeholder="请输入排名第二的称号" />
          </el-form-item>
          <el-form-item label="第三" label-width="68px">
            <el-input v-model="playerTitle[2]" placeholder="请输入排名第三的称号" />
          </el-form-item>
          <el-form-item label="第四" label-width="68px">
            <el-input v-model="playerTitle[3]" placeholder="请输入排名第四的称号" />
          </el-form-item>
          <el-form-item label="第五" label-width="68px">
            <el-input v-model="playerTitle[4]" placeholder="请输入排名第五的称号" />
          </el-form-item>
            <el-button class="w-full" type="primary" @click="savePlayTitle">保存</el-button>
        </div>
      </el-dialog>
      <!-- 面板称号更改配置 -->
      <el-dialog v-model="showModal.hotKey" title="快捷键更改 " width="38%">
        <div class="mb-3">* 当配置多个时，为同时按下组合键 <u>重启软件生效！</u></div>
        <div class="mt-4 px-6">
          <el-form-item label="发送友军面板" label-width="100px">
            <el-select class="w-full" v-model="appConfigStore.keys.order" filterable multiple placeholder="请选择发送友军面板快捷键">
              <el-option v-for="item in keyCodeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="发送敌军面板" label-width="100px">
            <el-select class="w-full" v-model="appConfigStore.keys.chaos" filterable multiple placeholder="请选择发送敌军面板面板快捷键">
              <el-option v-for="item in keyCodeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="快捷全体禁言" label-width="100px">
            <el-select class="w-full" v-model="appConfigStore.keys.mute" filterable multiple placeholder="请选择快捷全体禁言快捷键">
              <el-option v-for="item in keyCodeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
      </el-dialog>
    </el-form>

    <el-card shadow="nerver" class="w-[410px]" :body-style="{ padding: '16px' }">
      <h1 class="font-semibold text-lg">应用设置</h1>
      <div class="mt-2 px-4">
        <el-form class="flex-1 mr-2 h-full flex flex-col" :model="appConfigStore" label-width="120px" label-position="left">
          <el-form-item class="!mb-2" label="关闭按钮方式">
            <div class="flex items-center justify-between">
              <el-radio-group v-model="appConfigStore.close.type">
                <el-radio-button :label="0">退出应用程序</el-radio-button>
                <el-radio-button :label="1">隐藏至托盘</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item class="!mb-2" label="版本信息">
            <div class="w-full flex items-center justify-between">
              <div class="w-[150px]">正式版 {{ constant.APP_VERSION }}</div>
              <el-link type="primary" @click="checkUpdater">检查更新</el-link>
            </div>
          </el-form-item>
          <el-form-item class="!mb-2" label="日志路径">
            <div class="w-full flex items-center justify-between">
              <el-tooltip :content="constant.LOGS_PATH" placement="top-start">
                <div class="overflow-hidden overflow-ellipsis w-[150px]">{{ constant.LOGS_PATH }}</div>
              </el-tooltip>
              <el-link type="primary" @click="shell.openPath(constant.LOGS_PATH)">打开路径</el-link>
            </div>
          </el-form-item>
          <el-form-item class="!mb-2" label="配置文件">
            <div class="w-full flex items-center justify-between">
              <el-tooltip :content="constant.CONFIG_PATH" placement="top-start">
                <div class="overflow-hidden overflow-ellipsis w-[150px]">{{ constant.CONFIG_PATH }}</div>
              </el-tooltip>
              <el-link type="primary" @click="shell.openPath(constant.CONFIG_PATH)">打开路径</el-link>
            </div>
          </el-form-item>
          <el-form-item class="!mb-2" label="设备编码">
            <div class="w-full flex items-center justify-between">
              <div class="w-[150px]">{{ constant.PC_MAC }}</div>
              <el-link type="primary" @click="copy(constant.PC_MAC)">复制</el-link>
            </div>
          </el-form-item>
          <el-form-item class="!mb-2" label="交流群">
            <div class="w-full flex items-center justify-between">
              <div class="w-[150px]">914241626</div>
              <el-link type="primary" @click="shell.openPath(qqGroup)">加群</el-link>
            </div>
          </el-form-item>
          <el-form-item class="!mb-2" label="云端配置">
            <div class="w-full flex items-center justify-between">
              <el-tooltip :content="dayjs(lastSyncConfigTime).format('YYYY年MM月DD日 HH:mm:ss')">
                <div>查看上次同步时间</div>
              </el-tooltip>
              <el-link type="primary" @click="userStore.syncConfigLocal()">同步本地</el-link>
            </div>
          </el-form-item>
          <el-form-item class="!mb-2" label="应用初始化">
            <div class="w-full flex items-center justify-between">
              <div>重置配置</div>
              <el-link type="danger" @click="resetStore">重置</el-link>
            </div>
          </el-form-item>
          <el-form-item class="!mb-0" label="重置会员模块">
            <div class="w-full flex items-center justify-between">
              <div></div>
              <el-link type="warning" @click="resetVipFunc">重置</el-link>
            </div>
          </el-form-item>
        </el-form>
        <el-divider />
        <div>
          <h1 class="font-semibold text-lg">💖 赞助 *.。(๑･∀･๑)*.。</h1>
          <div class="mt-1">熬夜掉头发</div>
          <div class="text-base">如果你喜欢这个项目，不妨赞助一下开发者喝杯咖啡！</div>
          <div class="mt-4 w-full flex items-center justify-around">
            <img class="w-[120px]" src="../assets/image/common/alipay_qr.png" />
            <img class="w-[120px]" src="../assets/image/common/wechat_pay_qr.png" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="less">
.el-card {
  background: none;
}
.el-dialog__body {
  padding: 10px 20px;
}
.settings-container {
  width: 100%;
  height: 100%;
  display: flex;

  .settings-title {
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
}
</style>
