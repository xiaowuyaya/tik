<template>
  <div class="w-full h-full flex">
    <a-form class="flex flex-col h-full" :model="configStore" auto-label-width>
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <a-row :gutter="12" align="center" justify-content="space-between">
          <!-- 自动接受对局 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" label="自动接收对局">
              <a-switch v-model="configStore.autoAccept" @change="configStore.changeConfig">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <!--  -->
          <a-col :span="6">
            <a-form-item class="!mb-0" label="手动技能计时">
              <a-switch v-model="configStore.spellsWin.enable" @change="configStore.changeConfig">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <!-- 自动锁定英雄 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" label="自动锁定英雄">
              <a-switch v-model="configStore.confirmSelect" @change="configStore.changeConfig">
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </a-form-item>
          </a-col>
          <!-- 开局禁言 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" label="开局禁言">
              <a-switch v-model="configStore.autoMuteAll" @change="configStore.changeConfig">
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
      </a-card>

      <a-card class="mt-2 flex-auto" :hoverable="true" :header-style="{ border: 'none' }">
        <a-row :gutter="42" align="center" justify-content="space-between">
          <!-- 段位伪造 -->
          <a-col :span="12">
            <a-form-item class="" label="段位伪造">
              <a-select v-model="useForm.ranked" @change="handleChange('ranked', $event)" placeholder="请选择需要更改的段位"
                allow-clear allow-search>
                <a-option v-for="(item, idx) in rankOptions" :key="idx" :value="item.value">{{ item.label }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 状态更改 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="" label="状态更改">
              <a-select v-model="useForm.status" @change="handleChange('status', $event)" placeholder="请选择需要更改的状态"
                allow-clear allow-search>
                <a-option v-for="(item, idx) in statusOptions" :key="idx" :value="item.value">{{ item.label }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 拉起观战 -->
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="" label="拉起观战">
              <a-input-search @search="handleSpectator" search-button placeholder="请输入需要观战的玩家游戏名" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="" label="5v5训练模式">
              <a-button type="primary" long size="large" @click="handleCreatePracticeToolMode">点击创建</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item label="生涯背景修改">
              <a-button type="primary" long size="large" @click="showSummonerBackground = true">点击选择</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item label="隐藏分查询">
              <a-input placeholder="请前往小程序查看" :disabled="true"></a-input>
              <a-popover>
                <icon-question-circle-fill class="mx-1" size="20px" />
                <template #content>
                    <img width="200" src="@/assets/QrCode.jpg" alt="">
                </template>
              </a-popover>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="!mb-0" label="本命英雄查询">
              <a-input placeholder="请前往小程序查看" :disabled="true"></a-input>
              <a-popover>
                <icon-question-circle-fill class="mx-1" size="20px" />
                <template #content>
                    <img width="200" src="@/assets/QrCode.jpg" alt="">
                </template>
              </a-popover>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <!-- 生涯背景修改 -->
    <a-modal v-model:visible="showSummonerBackground" width="70%" :simple="true" :draggable="true"
      @ok="handleChangeSummonerBg">
      <template #title>生涯背景修改</template>
      <div class="flex flex-col items-center justify-center">
        <div class="mb-2 flex w-full justify-center">
          <a-select class="!w-[40%]" v-model="(summonerBackground.curChampionId as any)"
            @change="handleSummonerBackground('champions')" placeholder="请选择英雄 可搜索" allow-clear allow-search>
            <a-option v-for="(value, key, index) in championsStore" :key="index" :value="value.championId">{{
                key
            }}</a-option>
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
import { statusOptions, rankOptions } from '@/utils/options';
import { useConfigStore } from '@/stores/config';
import { reactive, ref } from 'vue';
import _ from 'lodash';
import { Message } from '@arco-design/web-vue';
import ipcRenderer from '@/utils/ipcRenderer';

const championsData = window.ddragonStore.get('champions')

const championsStore = ref(championsData)
const configStore = useConfigStore()

const useForm = reactive({
  ranked: '',
  status: '',
  spectator: '',
});

const showSummonerBackground = ref(false);
const curChampionSkinList = ref<any>([]);
const summonerBackground = reactive({
  curChampionId: null,
  curSkins: '',
  skinImg: 'some-error.png',
  imgTitle: '',
  imgDesc: '',
});

const handleChange = async (type: string, event: any) => {
  let r;
  console.log(event);
  console.log(type);
  if (type == 'ranked') {
    r =  await ipcRenderer.invoke('controller.lcuHandle.changeTiger', {tiger:event })

  } else if (type == 'status') {
    r = await ipcRenderer.invoke('controller.lcuHandle.changeStatus', {status:event })
  }
  showMessage(r, '操作成功', '操作异常，请检查客户端是否已正常启动')
};


const handleSpectator = async (summonerName: string) => {
  const r =  await ipcRenderer.invoke('controller.lcuHandle.spectatorLaunchByName',{summonerName, mode: 'RANKED_SOLO_5x5'} )
  showMessage(r, '拉起观战成功，等待客户端响应', '拉起观战发生异常，客户端未启动或对方不在召唤师峡谷地图游戏中')
}

const handleCreatePracticeToolMode = async () => {
  const r =  await ipcRenderer.invoke('controller.lcuHandle.createCustomLobby',{gameMode: 'PRACTICETOOL', mapId: 11, lobbyName: 'Tik 英雄联盟对局助手5V5训练模式' + Math.random() * 100} )
  showMessage(r, '创建成功', '创建失败，请检查客户端是否启动')
}

const handleSummonerBackground = async (type: 'champions' | 'skins') => {
  if (type === 'champions') {
    const r = await ipcRenderer.invoke('controller.lcuHandle.getChampionSkinListById',{skinId: summonerBackground.curChampionId} )
    curChampionSkinList.value = r.skins;
    summonerBackground.imgTitle = r.title;
    summonerBackground.imgDesc = r.shortBio;
  }
  if (type === 'skins') {
    _.forEach(curChampionSkinList.value, async (value) => {
      if (value.id === summonerBackground.curSkins) {
        const r =   await ipcRenderer.invoke('controller.lcuHandle.getLcuImgBase64',{imgUrl: value.splashPath} )
        summonerBackground.skinImg = r;
        return;
      }
    });
  }
};

const handleChangeSummonerBg = async () => {

  const r =  await ipcRenderer.invoke('controller.lcuHandle.setBackgroundSkinId',{
    key: 'backgroundSkinId',
    value: summonerBackground.curSkins,
  } )
  showMessage(r, '生涯背景修改成功', '修改失败')
};


const showMessage = (res: any, successMsg: string, errMsg: string) => {
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