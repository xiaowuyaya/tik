<script setup>
import { ref } from 'vue'
import { useBlacklistStore } from '../../store/blacklist'
import { useUserStore } from '../../store/user'

const props = defineProps({
  team: { type: String, required: true },
})

const panelData = $cache.get('panelData') || { orderList: [], chaosList: [], orderTogether: { arr1: [], arr2: [] }, chaosTogether: { arr1: [], arr2: [] } }
const blacklistStore = useBlacklistStore()
const userStore = useUserStore()
const banData = {
  environment: userStore.environment,
  summonerName: userStore.summonerName,
  summonerId: '',
  reason: '通过面板拉黑',
}
const utils = $utils
const playerList = ref([])
const positionIcon = {
  bottom: 'https://s-lol-web.op.gg/images/icon/icon-position-bot-dark.svg',
  jungle: 'https://s-lol-web.op.gg/images/icon/icon-position-jng-dark.svg',
  middle: 'https://s-lol-web.op.gg/images/icon/icon-position-mid-dark.svg',
  support: 'https://s-lol-web.op.gg/images/icon/icon-position-sup-dark.svg',
  top: 'https://s-lol-web.op.gg/images/icon/icon-position-top-dark.svg',
}

async function sendSummonerInfo(summoner) {
  const count = $store.appConfigStore.get('sendPlayerLevelInfo.matchNum')
  // 拼接历史对局KDA
  let matchHistoryStr = ''
  // 判断历史对局是否存在
  if (summoner.matches.data) {
    for (let j = 0; j < count; j++) {
      let historyMatche = summoner.matches.data[j]
      const temp = `(${historyMatche.kills || 0},${historyMatche.deaths || 0},${historyMatche.assists || 0} ) `
      matchHistoryStr += temp
    }
  }

  const textTemplate = $store.appConfigStore.get('sendPlayerLevelInfo.template')
  const msg = textTemplate
    .replace('{称号}', summoner.type)
    .replace('{玩家名}', summoner.summonerName)
    .replace('{kda}', summoner.matches.kda || '0.0')
    .replace('{胜率}', summoner.matches.winRate || '00.0%')
    .replace('{对局}', matchHistoryStr)

  await $utils.sendMessage(msg, 'ALL')
}

async function init() {
  playerList.value = panelData[`${props.team}List`]
  console.log(playerList.value[0])
}

init()
</script>
<template>
  <div v-if="playerList.length !== 0" class="w-full h-[80vh] flex flex-col justify-between">
    <el-card
      :class="[
        panelData[`${props.team}Together`].arr1.includes(item.summonerName) ? '!border-2 !border-green-500' : '',
        panelData[`${props.team}Together`].arr2.includes(item.summonerName) ? '!border-2 !border-blue-500' : '',
      ]"
      shadow="never"
      body-style="padding: 16px 12px"
      v-for="(item, index) in playerList"
      :key="index"
    >
      <div class="flex items-center">
        <el-avatar class="rounded cursor-pointer" :size="64" shape="square" :src="item.profileIcon" />
        <div class="ml-3 flex justify-between items-center flex-1">
          <div class="font-bold !w-full">
            <span class="font-semibold text-lg">{{ item.summonerName }}</span>
            <el-tag class="ml-3" effect="light" round size="small">{{ item.type }}</el-tag>
            <el-tag class="ml-2" type="warning" effect="light" round size="small">{{ item.matches.winRate }}</el-tag>
            <div class="mt-3 flex items-center justify-between !w-full">
              <div class="flex">
                <div class="flex">
                  <block v-for="(imgItem, index) in item.matches.recentChampionsCount" :key="index">
                    <img class="w-[28px] mr-1" :src="utils.getChampionAvatarById(imgItem.championId)" alt="" />
                  </block>
                </div>
                <div class="flex ml-2">
                  <block v-for="(itemPosition, pidx) in item.matches.recentlyPosition" :key="pidx">
                    <el-tooltip :content="`${itemPosition.wins}胜 / ${itemPosition.total - itemPosition.wins}负 `">
                      <img class="w-[28px] ml-1" :src="positionIcon[itemPosition.position.toLowerCase()]" alt="" />
                    </el-tooltip>
                  </block>
                </div>
              </div>
              <div class="flex flex-col">
                <el-dropdown>
                  <el-button size="small">操作</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="sendSummonerInfo(item)">发送</el-dropdown-item>
                      <el-dropdown-item @click="blacklistStore.add({ ...banData, banName: item.summonerName })">拉黑</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <div v-if="playerList.length === 0" class="!h-[60vh] w-full flex flex-col items-center justify-center">
    <img class="w-[128px]" src="../../assets/image/model/no_game_data.svg" alt="" />
    <div class="!mt-6">未获取到{{ props.team === 'order' ? '友军' : '敌军' }}数据...</div>
  </div>
</template>
<style lang="less" scoped>
.el-card {
  background: none;
}
</style>
