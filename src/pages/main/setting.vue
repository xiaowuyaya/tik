<template>
  <a-form class="h-full w-full " :model="configStore" auto-label-width>
    <div class="w-full h-full flex">
      <!-- 左侧 -->
      <div class=" w-[68%] h-full !mr-1">
        <!-- 发送设置 -->
        <a-card :hoverable="true" :header-style="{ border: 'none' }">
          <div class="text-lg font-medium text-gray-500 !mb-3">发送设置</div>
          <div class="pl-3">
            <a-form-item class="!mb-3" label="发送组排信息">
              <a-switch v-model="configStore.sendTogetherGame" @change="configStore.save">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
            <a-form-item class="!mb-3" label="快捷键发送">
              <a-switch v-model="configStore.enableSendHourse" @change="configStore.save">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>

            <a-row>
              <a-col :span="8">
                <a-form-item class="!mb-3" label="仅排位数据">
                  <a-switch v-model="configStore.onlyRankData" @change="configStore.save">
                    <template #checked-icon>
                      <icon-check />
                    </template>
                    <template #unchecked-icon>
                      <icon-close />
                    </template>
                  </a-switch>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item class="!mb-3" label-col-flex="74px" label="发送局数">
                  <a-input-number v-model="configStore.matchCount" class="input-demo" :min="1" :max="5"
                    @change="configStore.save" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item class="!mb-2 ml-3" label-col-flex="74px" label="黑名单提醒">
              <a-space size="large">
                <a-radio v-model="configStore.blacklistNoticeAll" :value="true" @change="configStore.save">
                  所有人可见
                </a-radio>
                <a-radio v-model="configStore.blacklistNoticeAll" :value="false" @change="configStore.save">
                  仅自己可见</a-radio>
              </a-space>
            </a-form-item>
            <a-form-item class="!mb-0 ml-3" label-col-flex="74px" label="发送模板">
              <a-input class="mr-1" v-model="configStore.sendTextTemplate" @change="configStore.save" placeholder="玩家战绩发送模板"></a-input>
              <a-popover>
              <icon-question-circle-fill class="mx-5" size="20px" />
              <template #content>
                <p class=" text-gray-600">发送模板必须满足格式并包含如下内容</p>
                <p class=" text-gray-600">1. <span class="text-red-500">{称号}</span> 为定义的称号类型</p>
                <p class=" text-gray-600">2. <span class="text-red-500">{玩家名}</span> 为当前发送的玩家游戏名</p>
                <p class=" text-gray-600">3. <span class="text-red-500">{kda}</span> 为发送玩家的近期kda</p>
                <p class=" text-gray-600">4. <span class="text-red-500">{胜率}</span> 为发送玩家的近期胜率</p>
                <p class=" text-gray-600">5. <span class="text-red-500">{对局}</span> 为发送玩家的近期对局数据，通过<span class="text-blue-500">发送局数</span>定义发送数量</p>
              </template>
            </a-popover>
            </a-form-item>
          </div>
        </a-card>
        <!-- 自定义快捷键 -->
        <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="text-lg font-medium text-gray-500 !mb-3">自定快捷键</div>

          <a-form-item field="settingsStore.app.spellsWin.key" label="技能窗口">
            <a-select class="mr-4" :disabled="!configStore.spellsWin.enable" v-model="configStore.spellsWin.key"
              placeholder="请选择快捷键组合" multiple :limit="2" @change="handleNotice('spellsWin')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <a-popover>
              <icon-question-circle-fill class="mx-1" size="20px" />
              <template #content>
                <span class=" text-gray-600">设置为：{{ hotKeyNotice.spellsWin }}</span>
              </template>
            </a-popover>
          </a-form-item>
          <a-form-item label="发送友军">
            <a-select class="mr-4" :disabled="!configStore.enableSendHourse" v-model="configStore.keys.order"
              placeholder="请选择快捷键组合" multiple :limit="2" @change="handleNotice('order')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <a-popover>
              <icon-question-circle-fill class="mx-1" size="20px" />
              <template #content>
                <span class="text-gray-600">设置为：{{ hotKeyNotice.order }}</span>
              </template>
            </a-popover>
          </a-form-item>
          <a-form-item label="发送敌军">
            <a-select class="mr-4" :disabled="!configStore.enableSendHourse" v-model="configStore.keys.chaos"
              placeholder="请选择快捷键组合" multiple :limit="2" @change="handleNotice('chaos')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <a-popover>
              <icon-question-circle-fill class="mx-1" size="20px" />
              <template #content>
                <span class="text-gray-600">设置为：{{ hotKeyNotice.chaos }}</span>
              </template>
            </a-popover>
          </a-form-item>
          <a-form-item class="!mb-0" label="全体禁言">
            <a-select class="mr-4" :disabled="!configStore.enableSendHourse" v-model="configStore.keys.muteAll"
              placeholder="请选择快捷键组合" multiple :limit="2" @change="handleNotice('muteAll')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
            <a-popover>
              <icon-question-circle-fill class="mx-1" size="20px" />
              <template #content>
                <span class=" text-gray-600">设置为：{{ hotKeyNotice.muteAll }}</span>
              </template>
            </a-popover>
          </a-form-item>
        </a-card>
        <!-- 称号 -->
        <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
          <div class="text-base font-medium text-gray-500 !mb-4">自定义称号</div>
          <a-row align="center">
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第一">
                <a-input v-model="configStore.typeTitle[0]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.save" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第二">
                <a-input v-model="configStore.typeTitle[1]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.save" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第三">
                <a-input v-model="configStore.typeTitle[2]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.save" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第四">
                <a-input v-model="configStore.typeTitle[3]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.save" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label-col-flex="50px" label="第五">
                <a-input v-model="configStore.typeTitle[4]" placeholder="请输入该排名称号" allow-clear
                  @change="configStore.save" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </div>
      <!-- 右侧 -->
      <a-card class="flex flex-col flex-auto h-full !ml-2" :hoverable="true" :header-style="{ border: 'none' }">
        <div class="text-lg font-medium text-gray-500 !mb-4">应用设置</div>
        <a-row class="py-2" :gutter="12" align="center" justify="center">
          <a-col :span="6" class="font-medium">关闭按钮</a-col>
          <a-col :span="16">
            <a-radio-group v-model="configStore.quitMethod" type="button" @change="configStore.save">
              <a-radio value="1">最小化到托盘</a-radio>
              <a-radio value="0">退出应用程序</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row class="py-2" :gutter="12" align="center" justify="center">
          <a-col :span="6" class="">当前版本</a-col>
          <a-col :span="8">
            <span>{{ APP_VERSION }}</span>
          </a-col>
          <a-col :span="8">
            <a-button type="text" @click="checkUpdate">检查更新</a-button>
          </a-col>
        </a-row>
        <a-row class="py-2" :gutter="12" align="center" justify="center">
          <a-col :span="6" class="">设备编码</a-col>
          <a-col :span="8">
            <span>{{ PC_MAC }}</span>
          </a-col>
          <a-col :span="8">
            <a-button type="text" @click="copy(PC_MAC)">点击复制</a-button>
          </a-col>
        </a-row>
        <a-row class="py-2" :gutter="12" align="center" justify="center">
          <a-col :span="6" class="">交流反馈</a-col>
          <a-col :span="8">
            <span>914241626</span>
          </a-col>
          <a-col :span="8">
            <a-button type="text" @click="shell.openExternal(qGroupLink)">点击加群</a-button>
          </a-col>
        </a-row>
        <a-row class="py-2" :gutter="12" align="center" justify="center">
          <a-col :span="6" class="">日志路径</a-col>
          <a-col :span="8">
            <div class="truncate w-full cursor-pointer" @click="copy(LOGS_PATH)">
              {{ LOGS_PATH }}
            </div>
          </a-col>
          <a-col :span="8">
            <a-button type="text" @click="shell.openPath(LOGS_PATH)">打开路径</a-button>
          </a-col>
        </a-row>
        <a-row class="py-2" :gutter="12" align="center" justify="center">
          <a-col :span="6" class="">配置文件</a-col>
          <a-col :span="8">
            <div class="truncate w-full cursor-pointer" @click="copy(CONFIG_PATH)">
              {{ CONFIG_PATH }}
            </div>
          </a-col>
          <a-col :span="8">
            <a-button type="text" @click="shell.openPath(CONFIG_PATH)">打开文件</a-button>
          </a-col>
        </a-row>
        <a-row class="py-2" :gutter="12" align="center" justify="center">
          <a-col :span="6" class="">重置配置</a-col>
          <a-col :span="8">
            <div class="truncate w-full" >
             如遇配置问题请点此
            </div>
          </a-col>
          <a-col :span="8">
            <a-button type="text" @click="resetStore">点击重置</a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </a-form>
</template>
<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue'
import { shell } from 'electron'
import { keyCodeOptions, keyCodeMap } from '../../utils/options'
import { useConfigStore } from '../../store/config'
import { copy } from '../../utils/tools'
import { Message } from '@arco-design/web-vue'

const configStore = useConfigStore()

const APP_VERSION = $tools.APP_VERSION
const PC_MAC = $tools.PC_MAC
const LOGS_PATH = $tools.LOGS_PATH
const CONFIG_PATH = $tools.CONFIG_PATH
const qGroupLink = 'https://qm.qq.com/cgi-bin/qm/qr?k=9HNfbMmM3ISfaX2YBjyJrD5r_Xgt8Bio&jump_from=webapi'

const hotKeyNotice = reactive({
  spellsWin: '',
  order: '',
  chaos: '',
  muteAll: '',
})

onBeforeMount(async () => {
  handleNotice('spellsWin')
  handleNotice('order')
  handleNotice('chaos')
  handleNotice('muteAll')
})


function checkUpdate() {

}

function resetStore(){
  $store.appStore.reset()
  Message.success('重置完成')
}

/**
 * 快捷键提醒
 * @param {*} type
 */
function handleNotice(type: 'order' | 'chaos' | 'muteAll' | 'spellsWin') {
  // 顺便更改一下配置
  configStore.save()

  let keys: number[]
  if (type == 'spellsWin') {
    keys = $store.appStore.get('app.spellsWin.key')
  } else {
    keys = $store.appStore.get(`app.keys.${type}`)
  }

  let str = ''
  console.log(keys);

  if (keys.length == 0) {
    str = '无快捷键'
  }
  if (keys.length == 1) {
    // @ts-ignore
    str = keyCodeMap[keys]
  }
  if (keys.length > 1) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (i != keys.length - 1) {
        // @ts-ignore
        str += `${keyCodeMap[key]} + `
      } else {
        // @ts-ignore
        str += `${keyCodeMap[key]}`
      }
    }
  }
  hotKeyNotice[type] = str
}

</script>