<template>
  <div class="h-full w-full flex flex-col">
    <div class="text-base flex justify-center items-center text-white user-drag">
      <span class="bg-sky-600 px-4 py-1">Eko 英雄联盟工具箱 手动技能提醒 (可拖动区)</span>
    </div>
    <div class="mt-2">
      <!-- 无数据 -->
      <div v-if="spellsData.length == 0" class="text-base font-extrabold text-center text-red-500">
        暂无数据,当前游戏状态：{{ gameStatus }}
      </div>
      <!-- 有数据 -->
      <div v-if="spellsData.length != 0" class="px-4 flex items-center justify-between">
        <div class="flex" v-for="(item, index) in spellsData" :key="index">
          <img class="w-[70px]" :src="item.championImg" />
          <div class="flex flex-col ml-1 items-center justify-center">
            <img class="w-[32px]" :src="item.summonerSpellOne.img" @click="
              spellTimeRecord(
                item.championName,
                item.summonerName,
                item.summonerSpellOne.name,
                item.summonerSpellOne.cooldownBurn,
              )
            " />
            <img class="w-[32px] mt-1" :src="item.summonerSpellTwo.img" @click="
              spellTimeRecord(
                item.championName,
                item.summonerName,
                item.summonerSpellTwo.name,
                item.summonerSpellTwo.cooldownBurn,
              )
            " />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { onMounted, ref } from 'vue'

const utils = $utils

interface SpellsItems {
  championName: string
  championImg: string
  summonerName: string
  summonerSpellOne: {
    name: string
    img: string
    cooldownBurn: number
  }
  summonerSpellTwo: {
    name: string
    img: string
    cooldownBurn: number
  }
}

const gameStatus = ref('')

const spellsData = ref<SpellsItems[]>([])

onMounted(async () => {
  const s = await $api.getGameStatus()
  gameStatus.value = utils.translate('status', s)
  await getSpellData(gameStatus.value)
})

// 持续监听玩家游戏状态变化,当状态满足条件时重新夹在数据
ipcRenderer.on('player-status', async (event, data) => {
  gameStatus.value = utils.translate('status', data)
  await getSpellData(data)
})

async function getSpellData(status: string) {
  if (status == 'InProgress' || status == '游戏中') {
    let playerList: any[] = []
    while (true) {
      try {
        playerList = await $api.getPlayerListInGame()
        if (playerList.length > 0) break
      } catch (err) { }
    }
    let r = []
    const summoner = await $api.getCurrentSummoner()
    let team: string = ''
    for (let j = 0; j < playerList.length; j++) {
      if (summoner.displayName == playerList[j].summonerName) {
        if (playerList[j].team == 'ORDER') {
          team = 'CHAOS'
        } else {
          team = 'ORDER'
        }
        break
      }
    }
    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].team == team) {
        let temp: any = {}
        const spellOne = $utils.getSpellInfoByName(playerList[i].summonerSpells.summonerSpellOne.displayName)
        const spellOneImg = spellOne.img
        const spellOneCooldownBurn = spellOne.cooldownBurn
        const spellTwo = $utils.getSpellInfoByName(playerList[i].summonerSpells.summonerSpellTwo.displayName)
        const spellTwoImg = spellTwo.img
        const spellTwoCooldownBurn = spellTwo.cooldownBurn
        temp.championName = playerList[i].championName
        temp.championImg = $utils.getChampionAvatarByCnName(playerList[i].championName)
        temp.summonerName = playerList[i].summonerName
        temp.summonerSpellOne = {
          name: playerList[i].summonerSpells.summonerSpellOne.displayName,
          img: spellOneImg,
          cooldownBurn: Number(spellOneCooldownBurn),
        }
        temp.summonerSpellTwo = {
          name: playerList[i].summonerSpells.summonerSpellTwo.displayName,
          img: spellTwoImg,
          cooldownBurn: Number(spellTwoCooldownBurn),
        }
        r.push(temp)
      }
    }

    console.log(r)
    spellsData.value = r
  }
  if (status == 'ReadyCheck' || status == '等待接受对局') {
    spellsData.value = []
  }
}

async function spellTimeRecord(championName: string, summonerName: string, spellName: string, cooldownBurn: number) {
  const status = await $api.getGameStatus()
  const curTime = setHis(parseInt(status.gameTime) + cooldownBurn)
  ipcRenderer.send('spell-info-send', {
    championName,
    summonerName,
    spellName,
    cooldownBurn,
    curTime
  })
}

function setHis(times: number = 0) {
  if (typeof times === 'number') {
    if (times <= 0) {
      return '00:00:00'
    } else {
      let hh = parseInt(`${times / 3600}`) //小时
      let shh = times - hh * 3600
      let ii = parseInt(`${shh / 60}`)
      let ss = shh - ii * 60
      return (hh < 10 ? '0' + hh : hh) + ':' + (ii < 10 ? '0' + ii : ii) + ':' + (ss < 10 ? '0' + ss : ss)
    }
  } else {
    return '00:00:00'
  }
}

</script>
