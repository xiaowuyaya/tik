<template>
  <a-scrollbar style="height:710px; overflow: auto;">
    <div class="setting-container">
      <a-affix :offsetTop="80">
        <div>
          <a-anchor :change-hash="false">
            <a-anchor-link href="#send_setting">发送设置
              <template #sublist>
                <a-anchor-link href="#send_setting_1">启用组排告知</a-anchor-link>
                <a-anchor-link href="#send_setting_2">启用快捷键</a-anchor-link>
                <a-anchor-link href="#send_setting_3">仅显示排位数据</a-anchor-link>
                <a-anchor-link href="#send_setting_4">发送局数</a-anchor-link>
                <a-anchor-link href="#send_setting_5">黑名单提醒</a-anchor-link>
                <a-anchor-link href="#send_setting_6">发送模板</a-anchor-link>
                <a-anchor-link href="#send_setting_7">称号更改</a-anchor-link>
              </template>
            </a-anchor-link>
            <a-anchor-link href="#hot_key">快捷键设置</a-anchor-link>
            <a-anchor-link href="#app_setting">应用相关
              <template #sublist>
                <a-anchor-link href="#app_setting_0">主题自适应</a-anchor-link>
                <a-anchor-link href="#app_setting_1">关闭按钮</a-anchor-link>
                <a-anchor-link href="#app_setting_2">版本</a-anchor-link>
                <a-anchor-link href="#app_setting_3">设备号</a-anchor-link>
                <a-anchor-link href="#app_setting_4">日志</a-anchor-link>
                <a-anchor-link href="#app_setting_5">配置</a-anchor-link>
                <a-anchor-link href="#app_setting_6">重置</a-anchor-link>
              </template>
            </a-anchor-link>
          </a-anchor>
          <div class="w-full mt-5 flex items-center justify-between absolute b-20 pt-4"
               style="border-top: 1px solid var(--color-border-2)">
            <img class="w-5 cursor-pointer" src="../../assets/icon/home.svg" @click="shell.openExternal('https://lol-tool.com/')">
            <img class="w-5 cursor-pointer" src="../../assets/icon/bilibili.svg"
                 @click="shell.openExternal('https://space.bilibili.com')">
            <img class="w-5 cursor-pointer" src="../../assets/icon/qq.svg"
                 @click="shell.openExternal('https://qm.qq.com/cgi-bin/qm/qr?k=9HNfbMmM3ISfaX2YBjyJrD5r_Xgt8Bio&jump_from=webapi')">
            <img class="w-5 cursor-pointer" src="../../assets/icon/github.svg"
                 @click="shell.openExternal('https://github.com/xiaowuyaya')">
          </div>
        </div>
      </a-affix>
      <div class="w-[710px]">
        <!--   发送设置   -->
        <div id="send_setting" class="text-2xl font-black py-2" style="color: var(--color-text-1)">游戏发送相关</div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="send_setting_1" class="item-box__form__title">开启发送组排信息</div>
            <a-switch v-model="configStore.sendTogetherGame" @change="configStore.save"/>
          </div>
          <div class="item-box__desc">在进入选择英雄阶段将自动在聊天框发送那些玩家是组队游戏的信息。</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="send_setting_2" class="item-box__form__title">开启快捷键发送</div>
            <a-switch v-model="configStore.enableSendHourse" @change="configStore.save"/>
          </div>
          <div class="item-box__desc">
            可以通过按下快捷键在“选择英雄界面”或“游戏中”发送友方或敌方的上等马信息（包括KDA，近期战绩情况等）
          </div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="send_setting_3" class="item-box__form__title">仅显示排位数据</div>
            <a-switch v-model="configStore.onlyRankData" @change="configStore.save"/>
          </div>
          <div class="item-box__desc">对局面板以及快捷发送的对局数据仅保留单双排以及灵活组排的对局数据</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="send_setting_4" class="item-box__form__title">发送局数</div>
            <a-input-number class="!w-28" mode="button" v-model="configStore.matchCount" :min="1" :max="5" @change="configStore.save" />
          </div>
          <div class="item-box__desc">自定义通过快捷键发送的上等马数据中历史对局的数量。</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="send_setting_5" class="item-box__form__title">黑名单提醒方式</div>
            <a-space size="large">
              <a-radio v-model="configStore.blacklistNoticeAll" :value="true" @change="configStore.save">
                所有人可见
              </a-radio>
              <a-radio v-model="configStore.blacklistNoticeAll" :value="false" @change="configStore.save">
                仅自己可见
              </a-radio>
            </a-space>
          </div>
          <div class="item-box__desc">自定义通过快捷键发送的上等马数据中历史对局的数量。</div>
        </div>

        <div class="item-box">
          <div class="item-box__form">
            <div id="send_setting_7" class="item-box__form__title">称号更改</div>
            <a-button type="primary" @click="showTitleChangeModal = true">点击更改</a-button>
          </div>
          <div class="item-box__desc">更改面板数据以及快捷发送中的称号，请注意部分词为屏蔽词（如：下等马等）将无法发送。
          </div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="send_setting_6" class="item-box__form__title">上等马发送模板</div>
            <a-input class="!w-[450px]" placeholder="玩家战绩发送模板" v-model="configStore.sendTextTemplate"
                     @change="configStore.save"></a-input>
          </div>
          <div class="item-box__desc">自定义通过快捷键发送的上等马数据文本模板内容。<br>其中：<span
              class="font-bold">{称号}</span> 为定义的称号类型，<span class="font-bold">{玩家名}</span> 为当前发送的玩家游戏名，<span
              class="font-bold">{kda}</span> 为发送玩家的近期kda，<span class="font-bold">{胜率}</span> 为发送玩家的近期胜率，<span
              class="font-bold">{对局}</span> 为发送玩家的近期对局数据，通过发送局数定义发送数量。
          </div>
        </div>

        <!--称号更改弹出层-->
        <a-modal v-model:visible="showTitleChangeModal" title="称号更改" width="350px" :simple="true" closable hide-cancel>
          <a-form :model="form">
            <a-form-item label="第一">
              <a-input v-model="configStore.typeTitle[0]" placeholder="请输入排名第一的称号" allow-clear
                       @change="configStore.save"/>
            </a-form-item>
            <a-form-item label="第二">
              <a-input v-model="configStore.typeTitle[1]" placeholder="请输入排名第二的称号" allow-clear
                       @change="configStore.save"/>
            </a-form-item>
            <a-form-item label="第三">
              <a-input v-model="configStore.typeTitle[2]" placeholder="请输入排名第三的称号" allow-clear
                       @change="configStore.save"/>
            </a-form-item>
            <a-form-item label="第四">
              <a-input v-model="configStore.typeTitle[3]" placeholder="请输入排名第四的称号" allow-clear
                       @change="configStore.save"/>
            </a-form-item>
            <a-form-item label="第五">
              <a-input v-model="configStore.typeTitle[4]" placeholder="请输入排名第五的称号" allow-clear
                       @change="configStore.save"/>
            </a-form-item>
          </a-form>
        </a-modal>

        <!--快捷键自定义-->
        <div id="hot_key" class="text-2xl font-black py-2 mt-4" style="color: var(--color-text-1)">自定义快捷键 <span class="text-sm font-normal">（重启软件生效）</span></div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="hot_key_1" class="item-box__form__title">快捷发送友军</div>
            <a-select class="!w-[260px]" placeholder="请选择快捷键组合" multiple :limit="2"
                      :disabled="!configStore.enableSendHourse" v-model="configStore.keys.order"  @change="handleNotice('order')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
          </div>
          <div class="item-box__desc">
            发送队友数据的快捷键，当前快捷键为：{{ hotKeyNotice.order }}
          </div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="hot_key_2" class="item-box__form__title">快捷发送敌军</div>
            <a-select class="!w-[260px]" placeholder="请选择快捷键组合" multiple :limit="2"
                      :disabled="!configStore.enableSendHourse" v-model="configStore.keys.chaos"  @change="handleNotice('chaos')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
          </div>
          <div class="item-box__desc">
            发送敌方数据的快捷键，当前快捷键为：{{ hotKeyNotice.chaos }}
          </div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="hot_key_3" class="item-box__form__title">快捷全体禁言</div>
            <a-select class="!w-[260px]" placeholder="请选择快捷键组合" multiple :limit="2"
                      :disabled="!configStore.enableSendHourse" v-model="configStore.keys.muteAll"  @change="handleNotice('muteAll')">
              <a-option v-for="(item, index) in keyCodeOptions" :key="index" :value="item.value">{{ item.label }}
              </a-option>
            </a-select>
          </div>
          <div class="item-box__desc">发送全体禁言 /mute all 的快捷键，当前快捷键为：{{ hotKeyNotice.muteAll }}
          </div>
        </div>

        <!--应用设置-->
        <div id="app_setting" class="text-2xl font-black py-2 mt-4" style="color: var(--color-text-1)">应用相关</div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="app_setting_0" class="item-box__form__title">启用自适应主题</div>
            <a-switch v-model="configStore.autoTheme" @change="configStore.save"/>
          </div>
          <div class="item-box__desc">启用该项，Tik的主题将根据时间自动更改。当时间为8:00-17:59时为日间模式（白色调），18:00-7:59为夜间模式(暗色调)</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="app_setting_1" class="item-box__form__title">关闭按钮</div>
            <a-radio-group v-model="configStore.quitMethod" type="button" @change="configStore.save">
              <a-radio value="1">最小化到托盘</a-radio>
              <a-radio value="0">退出应用程序</a-radio>
            </a-radio-group>
          </div>
          <div class="item-box__desc">定义关闭按钮的事件方法。</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="app_setting_2" class="item-box__form__title">版本</div>
            <a-button type="primary" @click="checkUpdate">检查更新</a-button>
          </div>
          <div class="item-box__desc">当前版本为：正式版{{APP_VERSION}}</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="app_setting_3" class="item-box__form__title">设备编码</div>
            <a-button type="primary" @click="copy(PC_MAC)">点击复制</a-button>
          </div>
          <div class="item-box__desc">当前设备号为为：{{PC_MAC}}</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="app_setting_4" class="item-box__form__title">日志</div>
            <a-button type="primary" @click="shell.openPath(LOGS_PATH)">打开路径</a-button>
          </div>
          <div class="item-box__desc">日路存储路径：{{LOGS_PATH}}</div>
        </div>
        <div class="item-box">
          <div class="item-box__form">
            <div id="app_setting_5" class="item-box__form__title">配置</div>
            <a-button type="primary" @click="shell.openPath(CONFIG_PATH)">打开文件</a-button>
          </div>
          <div class="item-box__desc">配置文件存储路径为：{{CONFIG_PATH}}</div>
        </div>
        <div class="item-box mb-20">
          <div class="item-box__form">
            <div id="app_setting_6" class="item-box__form__title">重置</div>
            <a-button type="primary" status="danger" @click="resetStore">点击重置</a-button>
          </div>
          <div class="item-box__desc">可以通过当前按钮重置所有本地相关数据，包括常用功能配置信息以及设置的配置信息。</div>
        </div>
      </div>
    </div>
  </a-scrollbar>
</template>
<script lang="ts" setup>
import {keyCodeOptions, keyCodeMap} from "@/utils/options";
import {ref, reactive, onBeforeMount} from "vue";
import {useConfigStore} from "@/store/config";
import {ipcRenderer,shell} from 'electron'
import {Message} from '@arco-design/web-vue'

const form = ref({name: 123})
const showTitleChangeModal = ref(false)

const configStore = useConfigStore()
const APP_VERSION = $consts.APP_VERSION
const PC_MAC = $consts.PC_MAC
const LOGS_PATH = $consts.LOGS_PATH
const CONFIG_PATH = $consts.CONFIG_PATH

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
  ipcRenderer.send('check-update', '')
}

function resetStore() {
  $store.appStore.reset()
  Message.success('重置完成, 重启软件后生效')
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
<style lang="less">

/* 横向滚动条显示有问题 找不到原因 应该也用不到 直接禁了 */
.arco-scrollbar-thumb-direction-horizontal {
  visibility: hidden !important;
}

.setting-container {
  max-width: 980px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  .item-box {
    width: 100%;
    padding: 14px 20px;
    border-bottom: 1px solid var(--color-border-2);

    .item-box__form {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-box__form__title {
        font-size: 16px;
        font-width: 600;
        color: var(--color-text-1)
      }
    }

    .item-box__desc {
      font-size: 14px;
      margin-top: 5px;
      color: var(--color-text-2)
    }
  }
}
</style>