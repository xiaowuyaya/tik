<template>
  <div class="w-full h-full flex flex-row">
    <!-- 功能&配置 -->
    <a-card class="w-[50%] mr-1" :hoverable="true" :header-style="{ border: 'none' }"
      :body-style="{padding: '10px 16px'}">
      <a-form :model="configStore" auto-label-width label-align="left">
        <div class="text-base font-medium text-gray-500 !mb-5">功能及配置</div>
        <!-- 自动锁定英雄 & 自动开局禁言 -->
        <a-row :gutter="4" align="center" justify-content="center">
          <a-col :span="12">
            <a-form-item label="自动锁定英雄">
              <a-switch v-model="configStore.confirmSelect" @change="configStore.save">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="自动开局禁言">
              <a-switch v-model="configStore.autoMuteAll" @change="configStore.save">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 自动接收对局 -->
        <a-row :gutter="4" align="center" justify-content="center">
          <a-col :span="12">
            <a-form-item label="自动接收对局">
              <a-switch v-model="configStore.autoAccept.enable" @change="configStore.save">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item label="延迟接收时间">
              <a-input-number :disabled="!configStore.autoAccept.enable" v-model="configStore.autoAccept.delay"
                @change="configStore.save" placeholder="" :min="0" :max="8">
                <template #suffix>
                  秒
                </template>
              </a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 手动技能计时 -->
        <!-- <a-row :gutter="4" align="center" justify-content="center">
          <a-col :span="12">
            <a-form-item label="手动技能计时">
              <a-switch v-model="configStore.spellsWin.enable" @change="configStore.save">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
        </a-row> -->
        <!-- 段位伪造 -->
        <a-row :gutter="4" align="center" justify-content="center">
          <a-col :span="21">
            <a-form-item label="段位伪造">
              <a-select v-model="useForm.ranked" @change="handleChange('ranked', $event)" placeholder="请选择段位"
                allow-clear allow-search>
                <a-option v-for="(item, idx) in rankOptions" :key="idx" :value="item.value">{{ item.label }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 状态更改 -->
        <a-row :gutter="4" align="center" justify-content="center">
          <a-col :span="21">
            <a-form-item label="状态更改">
              <a-select v-model="useForm.status" @change="handleChange('status', $event)" placeholder="请选择状态"
                allow-clear allow-search>
                <a-option v-for="(item, idx) in statusOptions" :key="idx" :value="item.value">{{ item.label }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 5v5训练模式 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="21">
            <a-form-item class="" label="5v5训练模式">
              <a-button type="primary" long @click="handleCreatePracticeToolMode">点击创建</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 生涯背景修改 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="21">
            <a-form-item label="生涯背景修改">
              <a-button type="primary" long @click="showSummonerBackground = true">点击选择</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 拉起观战 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="24">
            <a-form-item class="" label="拉起观战">
              <a-input-search @search="handleSpectator" search-button placeholder="请输入需要观战的玩家游戏名" />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 选择游戏客户端 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="24">
            <a-form-item label="游戏客户端">
              <a-input v-model="configStore.gameClient.gameClientFilePath" placeholder="游戏目录下的TCLS\Client.exe">
              </a-input>
              <a-button class="ml-2" type="primary" @click="chooseGameClientFile">选择</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 客户端模式切换 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="24">
            <a-form-item label="客户端模式切换">
              <a-radio-group v-model="configStore.gameClient.gameType" type="button" @change="changeGameClientType"
                :disabled="configStore.gameClient.gameClientFilePath == '' || !configStore.gameClient.gameClientFilePath.includes('Client.exe')">
                <a-radio value=0>正式服</a-radio>
                <a-radio value=1>体验服</a-radio>
              </a-radio-group>
              <a-popover>
                <icon-question-circle-fill class="mx-4" size="20px" />
                <template #content>
                  <span>需要先配置游戏客户端地址后才可使用</span>
                </template>
              </a-popover>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="24">
            <a-form-item label="隐藏分查询">
              <a-popover>
                <a-input placeholder="请前往小程序查询，鼠标悬浮显示二维码" :disabled="true"></a-input>
                <template #content>
                  <img width="200" src="../../assets/mini_program_qr_code.jpg" alt="">
                </template>
              </a-popover>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="24">
            <a-form-item class="!mb-0" label="本命英雄查询">
              <a-popover>
                <a-input placeholder="请前往小程序查询，鼠标悬浮显示二维码" :disabled="true"></a-input>
                <template #content>
                  <img width="200" src="../../assets/mini_program_qr_code.jpg" alt="">
                </template>
              </a-popover>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <!-- 自动禁选 -->
    <div class="w-[50%] flex flex-row ml-1">
      <a-form class="w-full" :model="configStore" auto-label-width label-align="left">
        <a-card class="flex-auto mb-1" :hoverable="true" :header-style="{ border: 'none' }"
          :body-style="{padding: '10px 16px'}">
          <div class="text-base font-medium text-gray-500 !mb-3">秒选英雄</div>
          <!-- 启用 -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="启用秒选">
                <a-switch v-model="configStore.autoBP.pick.enable" @change="saveAndReload">
                  <template #checked-icon>
                    <icon-check />
                  </template>
                  <template #unchecked-icon>
                    <icon-close />
                  </template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- normal -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="匹配">
                <a-select :disabled="!configStore.autoBP.pick.enable" v-model="configStore.autoBP.pick.normal"
                  placeholder="一般模式如匹配等下需要秒选的英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- top -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="上路">
                <a-select :disabled="!configStore.autoBP.pick.enable" v-model="configStore.autoBP.pick.top"
                  placeholder="排位模式下需要选用的上路英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- jungle -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="打野">
                <a-select :disabled="!configStore.autoBP.pick.enable" v-model="configStore.autoBP.pick.jungle"
                  placeholder="排位模式下需要选用的打野英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- mid -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="中路">
                <a-select :disabled="!configStore.autoBP.pick.enable" v-model="configStore.autoBP.pick.middle"
                  placeholder="排位模式下需要选用的中路英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- bottom -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="下路">
                <a-select :disabled="!configStore.autoBP.pick.enable" v-model="configStore.autoBP.pick.bottom"
                  placeholder="排位模式下需要选用的下路英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- sup -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="辅助">
                <a-select :disabled="!configStore.autoBP.pick.enable" v-model="configStore.autoBP.pick.utility"
                  placeholder="排位模式下需要选用的辅助英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="flex-auto mt-1" :hoverable="true" :header-style="{ border: 'none' }"
          :body-style="{padding: '10px 16px'}">
          <!-- ban -->
          <div class="text-base font-medium text-gray-500 !mb-3">自动禁用英雄</div>
          <!-- 启用 -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="启用禁选">
                <a-switch v-model="configStore.autoBP.ban.enable" @change="saveAndReload">
                  <template #checked-icon>
                    <icon-check />
                  </template>
                  <template #unchecked-icon>
                    <icon-close />
                  </template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- top -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="上路">
                <a-select :disabled="!configStore.autoBP.ban.enable" v-model="configStore.autoBP.ban.top"
                  placeholder="排位模式下需要选用的上路英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- jungle -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="打野">
                <a-select :disabled="!configStore.autoBP.ban.enable" v-model="configStore.autoBP.ban.jungle"
                  placeholder="排位模式下需要选用的打野英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- mid -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="中路">
                <a-select :disabled="!configStore.autoBP.ban.enable" v-model="configStore.autoBP.ban.middle"
                  placeholder="排位模式下需要选用的中路英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- bottom -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="下路">
                <a-select :disabled="!configStore.autoBP.ban.enable" v-model="configStore.autoBP.ban.bottom"
                  placeholder="排位模式下需要选用的下路英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- sup -->
          <a-row :gutter="42" align="center" justify-content="space-between">
            <a-col :span="24">
              <a-form-item class="mb-4" label="辅助">
                <a-select :disabled="!configStore.autoBP.ban.enable" v-model="configStore.autoBP.ban.utility"
                  placeholder="排位模式下需要选用的辅助英雄 （可输入搜索）" multiple :limit="1" @change="saveAndReload"
                  :options="championsStore" :virtual-list-props="{height:200}">
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </div>
    <!-- 生涯背景修改 -->
    <a-modal v-model:visible="showSummonerBackground" width="70%" :simple="true" :draggable="true"
      @ok="handleChangeSummonerBg">
      <template #title>生涯背景修改</template>
      <div class="flex flex-col items-center justify-center">
        <div class="mb-2 flex w-full justify-center">
          <a-select class="!w-[40%]" v-model="(summonerBackground.curChampionId as any)"
            @change="handleSummonerBackground('champions')" placeholder="请选择英雄 可搜索" allow-clear allow-search :options="championsStore" :virtual-list-props="{height:200}">
          </a-select>

          <a-select class="!w-[40%] ml-2" v-model="summonerBackground.curSkins"
            @change="handleSummonerBackground('skins')" placeholder="请选择皮肤 可搜索" allow-clear allow-search>
            <a-option v-for="(value, index) in curChampionSkinList" :key="index" :value="value.id">{{ value.name }}
            </a-option>
          </a-select>
        </div>

        <a-image width="640" height="360" :src="summonerBackground.skinImg" :title="summonerBackground.imgTitle"
          :description="summonerBackground.imgDesc" />
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { inject, onBeforeMount, reactive, ref } from 'vue';
import { rankOptions, statusOptions } from '../../utils/options'
import { useConfigStore } from '../../store/config'
import { Message, SelectOptionData } from '@arco-design/web-vue';
import _ from 'lodash'

const reload = inject('reload')
const configStore = useConfigStore()
const useForm = reactive({
  ranked: '',
  status: '',
  spectator: '',
});
const championsData = $store.ddragonStore.get('ddragon.champions')
const championsStore = ref([])
const showSummonerBackground = ref(false);
const curChampionSkinList = ref<any>([]);
const summonerBackground = reactive({
  curChampionId: null,
  curSkins: '',
  skinImg: 'some-error.png',
  imgTitle: '',
  imgDesc: '',
});


onBeforeMount(() => {
  _.forIn(championsData, (v, k) => {
    const data: SelectOptionData = {}
    data.value = v.championId
    data.label = k
    championsStore.value.push(data)
  })
})

/* 不知道什么原因，单选择时组件不发生变动需要刷新一下页面 */
function saveAndReload() {
  configStore.save()
  // @ts-ignore 
  reload()
}

/* 段位伪造以及状态修改处理 */
async function handleChange(type: string, event: any) {
  let chatInfo = await $api.getPlayerChatInfo()

  if (type == 'ranked') {
    chatInfo.lol.rankedLeagueDivision = 'I'
    chatInfo.lol.rankedLeagueQueue = 'RANKED_SOLO_5x5'
    chatInfo.lol.rankedLeagueTier = event
    chatInfo.lol.rankedPrevSeasonDivision = 'I'

    const res = await $api.putPlayerChatInfo(chatInfo)
    showMessage(res, `段位伪造: ${event}， 成功`, `段位伪造发生异常，客户端链接可能断开`)
  } else if (type == 'status') {
    chatInfo.availability = event
    const res = await $api.putPlayerChatInfo(chatInfo)
    showMessage(res, `状态更改: ${event}， 成功`, `状态更改发生异常，客户端链接可能断开`)
  }
};

/* 观战 */
async function handleSpectator(summonerName: string) {
  const res = $api.spectatorLaunchByName(summonerName, 'RANKED_SOLO_5x5')
  showMessage(res, '拉起观战成功，等待客户端响应', '拉起观战发生异常，客户端未启动或对方不在召唤师峡谷地图游戏中')
}

/* 创建房间 */
async function handleCreatePracticeToolMode() {
  const res = await $api.createCustomLobby('PRACTICETOOL', 11, `Tik 英雄联盟对局助手5V5训练模式${Math.random() * 100}`)
  showMessage(res, '创建成功', '创建失败，请检查客户端是否启动')
}

/* 选择客户端地址 */
async function chooseGameClientFile() {
  Message.warning('该功能暂时禁用')
  // const res = await ipcRenderer.invoke('controller.common.chooseGameClientFilePath', {})
  // console.log(res);

  // if (res.code == 500) {
  //   Message.error({
  //     content: res.data,
  //     duration: 2000
  //   })
  // } else {
  //   Message.success({
  //     content: '选择成功'
  //   })
  //   configStore.gameClient.gameClientFilePath = res.data
  // }
}

async function changeGameClientType() {
  
  // configStore.changeConfig()
  // const res =  await ipcRenderer.invoke('controller.common.changeGameClientType', {type: configStore.gameClient.gameType})
  // if (res.code == 500) {
  //   Message.error({
  //     content: res.data,
  //     duration: 2000
  //   })
  // } else {
  //   Message.success({
  //     content: res.msg
  //   })
  // }
  // console.log(res);
}

async function handleSummonerBackground(type: 'champions' | 'skins') {
  if (type === 'champions') {
    const r = await $api.getChampionSkinListById(summonerBackground.curChampionId)
    curChampionSkinList.value = r.skins;
    summonerBackground.imgTitle = r.title;
    summonerBackground.imgDesc = r.shortBio;
  }
  if (type === 'skins') {
    _.forEach(curChampionSkinList.value, async (value) => {
      if (value.id === summonerBackground.curSkins) {
        const r = await $api.getLcuImgBase64(value.splashPath)
        summonerBackground.skinImg = r;
        return;
      }
    });
  }
}

async function handleChangeSummonerBg() {
  const r = await $api.setBackgroundSkinId({
    key: 'backgroundSkinId',
    value: summonerBackground.curSkins,
  })
  showMessage(r, '生涯背景修改成功', '修改失败')
}

function showMessage(res: any, successMsg: string, errMsg: string) {
  console.log(res);

  if (!res) {
    Message.error({
      content: errMsg,
      duration: 2000
    })
  } else {
    Message.success({
      content: successMsg,
      duration: 2000
    })
  }
}

</script>