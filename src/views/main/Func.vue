<template>
  <div class="w-full h-full flex">
    <a-form :model="configStore" auto-label-width>
      <a-card :hoverable="true" :header-style="{ border: 'none' }">
        <a-row :gutter="12" align="center" justify-content="space-between">
          <!-- 自动接受对局 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="configStore.app.accept" label="自动接收对局">
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
          <!-- 自动锁定英雄 -->
          <a-col :span="6">
            <a-form-item class="!mb-0" field="configStore.app.confirm" label="自动锁定英雄">
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
            <a-form-item class="!mb-0" field="configStore.app.muteAll" label="开局禁言">
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

      <a-card class="mt-2" :hoverable="true" :header-style="{ border: 'none' }">
        <a-row :gutter="42" align="center" justify-content="space-between">
          <!-- 段位伪造 -->
          <a-col :span="12">
            <a-form-item class="" field="useForm.ranked" label="段位伪造">
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
            <a-form-item class="" field="useForm.status" label="状态更改">
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
            <a-form-item class="" field="useForm.spectator" label="拉起观战">
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
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="42" align="center" justify-content="space-between">
          <a-col :span="12">
            <a-form-item class="!mb-0" label="本命英雄查询">
              <a-input placeholder="请前往小程序查看" :disabled="true"></a-input>
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
            <a-option v-for="(value, key, index) in championsStore.champions" :key="index" :value="value.championId">{{
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

const championsStore = ref(window.ddragonStore.get('champions'))
const configStore = useConfigStore()
const lcuApi = window.lcuApi
const handle = window.handle

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
  if (type === 'ranked') {
    r = await handle.changeTiger(event)
  } else if (type === 'status') {
    r = await handle.changeStatus(event)
  }
};


const handleSpectator = async (summonerName: string) => {
  await lcuApi.spectatorLaunchByName(summonerName, 'RANKED_SOLO_5x5')
}

const handleCreatePracticeToolMode = async () => {
  const r = await lcuApi.createCustomLobby('PRACTICETOOL', 11, 'PRACTICETOOL' + Math.random() * 100)

}

const handleSummonerBackground = async (type: 'champions' | 'skins') => {
  if (type === 'champions') {
    const r = await lcuApi.getChampionSkinListById(summonerBackground.curChampionId)
    curChampionSkinList.value = r.skins;
    summonerBackground.imgTitle = r.title;
    summonerBackground.imgDesc = r.shortBio;
  }
  if (type === 'skins') {
    _.forEach(curChampionSkinList.value, async (value) => {
      if (value.id === summonerBackground.curSkins) {
        const r = await lcuApi.getLcuImgBase64(value.splashPath)
        summonerBackground.skinImg = r;
        return;
      }
    });
  }
};

const handleChangeSummonerBg = async () => {
  await lcuApi.setBackgroundSkinId({
    key: 'backgroundSkinId',
    value: summonerBackground.curSkins,
  })
};

</script>