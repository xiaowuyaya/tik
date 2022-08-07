<template>
  <div class="h-full w-full flex flex-col">
    <div class="text-base text-center text-white user-drag">
      <span class="bg-sky-600 px-4 ">Tik 对局助手 手动技能提醒 (可拖动区)</span>
    </div>
    <div class="mt-2">
      <!-- 无数据 -->
      <div v-if="spellsData.length == 0" class="text-base font-extrabold text-center text-red-500 ">暂无数据,当前游戏状态：{{ gameStatus }}</div>
      <!-- 有数据 -->
      <div v-if="spellsData.length != 0" class="px-4 flex items-center justify-between">
        <div class="flex" v-for="(item, index) in spellsData" :key="index">
          <img class="w-[70px]" :src="item.championImg" />
          <div class="flex flex-col ml-1 items-center justify-center">
            <img
              class="w-[32px]"
              :src="item.summonerSpellOne.img"
              @click="spellTimeRecord(item.championName, item.summonerName, item.summonerSpellOne.name, item.summonerSpellOne.cooldownBurn)"
            />
            <img
              class="w-[32px] mt-1"
              :src="item.summonerSpellTwo.img"
              @click="spellTimeRecord(item.championName, item.summonerName, item.summonerSpellTwo.name, item.summonerSpellTwo.cooldownBurn)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ipcRenderer from '@/utils/ipcRenderer';
import {  onMounted, ref } from 'vue';

interface SpellsItems {
  championName: string;
  championImg: string;
  summonerName: string;
  summonerSpellOne: {
    name: string;
    img: string;
    cooldownBurn: number;
  };
  summonerSpellTwo: {
    name: string;
    img: string;
    cooldownBurn: number;
  };
}

const gameStatus = ref('');

const spellsData = ref<SpellsItems[]>([]);

onMounted(async () => {
  gameStatus.value = await ipcRenderer.invoke('controller.lcu.getPlayerStatus', '');
  await getSpellData(gameStatus.value);
});

// 持续监听玩家游戏状态变化,当状态满足条件时重新夹在数据
ipcRenderer.ipc.removeAllListeners('controller.lcu.listenPlayerStatus');
ipcRenderer.ipc.on('controller.lcu.listenPlayerStatus', async (_event, data) => {
  gameStatus.value = data;
  await getSpellData(data);
});

async function getSpellData(status: string) {

  if (status == 'InProgress' || status == '游戏中') {
    spellsData.value = await ipcRenderer.invoke('controller.lcu.getPlayerSpells', '');
    console.log(spellsData.value);
  }
   if (status == 'ReadyCheck' || status == '等待接受对局') {
    spellsData.value = []
  }
}

async function spellTimeRecord(championName: string, summonerName: string, spellName: string, cooldownBurn: number) {
  const r = await ipcRenderer.invoke('controller.lcu.handleSpellsTime', { championName, summonerName, spellName, cooldownBurn });
  console.log(r);
}
</script>
