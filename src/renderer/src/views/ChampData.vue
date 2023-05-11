<script setup>
import { onMounted, reactive, ref } from 'vue'
import { champsDataByMode, champsRankData } from '../api/champ'
import { positionIcon } from '../assets/image/position'
import { tierList } from '../assets/image/tier'

const utils = $utils
const ROLE_CONSTS = $store.gameDataStore.get('constant.role')

const loading = ref(false)
const options = reactive({
  position: [
    {
      label: '上路',
      value: 'top',
      type: 'top',
      src: 'https://s-lol-web.op.gg/images/icon/icon-position-top-dark.svg',
    },
    {
      label: '中路',
      value: 'mid',
      type: 'mid',
      src: 'https://s-lol-web.op.gg/images/icon/icon-position-mid-dark.svg',
    },
    {
      label: '下路',
      value: 'adc',
      type: 'adc',
      src: 'https://s-lol-web.op.gg/images/icon/icon-position-bot-dark.svg',
    },
    {
      label: '打野',
      value: 'jungle',
      type: 'jungle',
      src: 'https://s-lol-web.op.gg/images/icon/icon-position-jng-dark.svg',
    },
    {
      label: '辅助',
      value: 'support',
      type: 'support',
      src: 'https://s-lol-web.op.gg/images/icon/icon-position-sup-dark.svg',
    },
  ],
  gameMode: [
    {
      label: '排位模式',
      value: 430,
    },
    {
      label: '极地乱斗',
      value: 450,
    },
    {
      label: '无限火力',
      value: 900,
    },
  ],
  tiger: [
    {
      label: '青铜',
      value: 'bronze',
    },
    {
      label: '白银',
      value: 'silver',
    },
    {
      label: '黄金',
      value: 'gold',
    },
    {
      label: '黄金+',
      value: 'gold_plus',
    },
    {
      label: '白金',
      value: 'platinum',
    },
    {
      label: '白金+',
      value: 'platinum_plus',
    },
    {
      label: '钻石',
      value: 'diamond',
    },
    {
      label: '钻石+',
      value: 'diamond_plus',
    },
    {
      label: '大师',
      value: 'master',
    },
    {
      label: '大师+',
      value: 'master_plus',
    },
    // {
    //   label: '宗师',
    //   value: 'grandmaster',
    // },
    // {
    //   label: '王者',
    //   value: 'challenger',
    // },
  ],
})
const stateData = reactive({
  currentGameMode: 430,
  currentPosition: 'top',
  currentTiger: 'diamond_plus',
  champData: { top: [], jungle: [], mid: [], adc: [], support: [] },
  tableData: [],
})
async function getData() {
  stateData.tableData = []
  if (stateData.currentGameMode == 430) {
    let { data } = await champsRankData(stateData.currentTiger)
    data.forEach(champ => {
      champ.positions.forEach(p => {
        const position = p.name.toLowerCase()
        stateData.champData[position].push(champ)
      })
    })
    handleChampData(stateData.currentPosition)
  }
  if (stateData.currentGameMode == 450) {
    let { data } = await champsDataByMode('aram')
    handleChampData('none', data)
  }
  if (stateData.currentGameMode == 900) {
    let { data } = await champsDataByMode('urf')
    handleChampData('none', data)
  }
}

async function handleChampData(position = 'none', data) {
  loading.value = true
  if (position != 'none') data = stateData.champData[position]
  let show_data = []
  stateData.tableData = []
  data.forEach(champ => {
    let r = {}
    const info = $utils.getChampionById(champ.id)
    r.avatar = $utils.getChampionAvatarById(champ.id)
    r.name = info.name
    r.alias = info.alias
    r.position = []
    r.roles = []
    if (position != 'none') {
      champ.positions.forEach(p => {
        if (position == p.name.toLowerCase()) {
          r.tier = p.stats.tier_data.tier
          r.kda = p.stats.kda
          r.rank = p.stats.tier_data.rank
          r.ban_rate = (p.stats.ban_rate * 100).toFixed(2)
          r.pick_rate = (p.stats.pick_rate * 100).toFixed(2)
          r.win_rate = (p.stats.win_rate * 100).toFixed(2)
          r.counters = p.counters
        }
        r.position.push(p.name.toLowerCase())
      })
    } else {
      if (champ.average_stats) {
        r.tier = champ.average_stats.tier || 9
        r.kda = champ.average_stats.kda
        r.rank = champ.average_stats.rank
        r.ban_rate = null
        r.pick_rate = (champ.average_stats.pick_rate * 100).toFixed(2)
        r.win_rate = (champ.average_stats.win_rate * 100).toFixed(2)
        r.counters = null
      } else {
        r.tier = null
        r.kda = null
        r.rank = 999
        r.ban_rate = null
        r.pick_rate = null
        r.win_rate = null
        r.counters = null
      }
    }
    champ.roles.forEach(role => {
      r.roles.push(role.name)
    })
    show_data.push(r)
  })
  show_data.sort((a, b) => {
    return a.rank - b.rank
  })
  stateData.tableData = show_data
  loading.value = false
}

onMounted(() => {
  setTimeout(() => {
    getData()
  }, 200)
})
</script>
<template>
  <div class="container">
    <el-card shadow="nerver" class="w-full" :body-style="{ padding: '16px' }">
      <div class="w-full flex items-center justify-between">
        <div class="flex items-center">
          <span class="mr-4">游戏模式</span>
          <el-select class="w-[180px]" v-model="stateData.currentGameMode" @change="getData">
            <el-option v-for="item in options.gameMode" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-show="stateData.currentGameMode == '430'" class="ml-3 w-[96px]" v-model="stateData.currentTiger" @change="getData">
            <el-option v-for="item in options.tiger" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="flex items-center">
          <el-radio-group v-show="stateData.currentGameMode == '430'" v-model="stateData.currentPosition" @change="handleChampData(stateData.currentPosition)">
            <el-radio-button v-for="(item, idx) in options.position" :key="idx" :label="item.value" size="small">
              <div class="flex items-center">
                <img :src="item.src" />
                <span class="ml-2">{{ item.label }}</span>
              </div>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </el-card>
    <el-card shadow="nerver" class="w-full flex-1 mt-2" :body-style="{ padding: '16px' }">
      <el-table :data="stateData.tableData" style="width: 100%" v-loading="loading" max-height="580px">
        <el-table-column label="英雄">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar :size="48" shape="square" :src="row.avatar" />
              <div class="flex flex-col ml-4">
                <span>
                  <span class="text-[16px] font-semibold">{{ row.name }}</span>
                  <span class="ml-2 text-gray-500">{{ row.alias }}</span>
                </span>
                <div class="flex">
                  <img v-for="(item, idx) in row.position" :key="idx" class="w-[22px] mr-3" :src="positionIcon[item]" alt="" />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="定位" align="center" width="180px">
          <template #default="{ row }">
            <div class="flex">
              <el-tag class="mr-2" v-for="(item, idx) in row.roles.slice(0, 3)" :key="idx" round type="info">
                <span style="font-size: 14px">{{ ROLE_CONSTS[item] || '无' }}</span>
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="层级" align="center" width="90px">
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <img class="w-[26px]" :src="tierList[row.tier]" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="win_rate" sortable label="胜率" align="center" width="110px">
          <template #default="{ row }">
            <span class="text-[#529b2e] font-semibold" v-show="row.win_rate">{{ row.win_rate }} %</span>
            <span class="!text-gray-400 font-semibold" v-show="!row.win_rate">无数据</span>
          </template>
        </el-table-column>
        <el-table-column prop="pick_rate" sortable label="登场率" align="center" width="110px">
          <template #default="{ row }">
            <span class="text-[#b88230] font-semibold" v-show="row.pick_rate">{{ row.pick_rate }} %</span>
            <span class="!text-gray-400 font-semibold" v-show="!row.pick_rate">无数据</span>
          </template>
        </el-table-column>
        <el-table-column prop="ban_rate" sortable label="禁用率" align="center" width="110px">
          <template #default="{ row }">
            <span class="text-[#c45656] font-semibold" v-show="row.ban_rate">{{ row.ban_rate }} %</span>
            <span class="!text-gray-400 font-semibold" v-show="!row.ban_rate">无数据</span>
          </template>
        </el-table-column>
        <el-table-column label="英雄克制" align="center" width="180px">
          <template #default="{ row }">
            <div v-show="row.counters" class="flex justify-center">
              <el-avatar class="!mr-3" v-for="(item, idx) in row.counters" :key="idx" :size="38" shape="round" :src="utils.getChampionAvatarById(item.champion_id)" />
            </div>
            <span class="!text-gray-400" v-show="!row.counters">无数据</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
.el-card {
  background: none;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
