<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'
import { getRankTigerImg } from '../assets/image/rank_emblems_opgg'
import { positionIcon } from '../assets/image/position'
import dayjs from '../utils/dateUtil'

const utils = $utils
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const currentSummoner = ref({})

const { summonerName } = route.query || ''

if (!summonerName) {
  window.electron.ipcRenderer.removeAllListeners('player-status')
  window.electron.ipcRenderer.on('player-status', (_event, data) => {
    currentSummoner.value.gameStatus = $utils.translate('status', data)
  })
}

const toHistoryDetail = (gameId = '') => {
  router.push({
    path: '/RecordDetail',
    query: {
      summonerName: currentSummoner.value.displayName,
      gameId,
    },
  })
}

onMounted(async () => {
  try {
    loading.value = true
    currentSummoner.value = await $service.summonerHomePageData(summonerName)
    userStore.environment = currentSummoner.value.environment
    userStore.summonerId = currentSummoner.value.summonerId
    userStore.summonerName = currentSummoner.value.displayName
    loading.value = false
    currentSummoner.value.rencentlyPosition

    if (!summonerName) {
      await userStore.registerEnvironment()
    }
  } catch (err) {
    ElMessage.error('lcu接口请求异常.')
    $log.error(`[SummonerInfo page] lcu接口请求异常: ${err}`)
  }
})
</script>

<template>
  <div class="summoner-info-container" v-loading="loading" element-loading-text="加载玩家信息中...">
    <!-- 左侧 -->
    <div class="flex-1 mr-2 relative flex flex-col">
      <el-card shadow="never" class="!p-2">
        <div class="flex justify-between w-full">
          <summoner class="flex items-center w-[33%]">
            <el-avatar shape="square" :size="86" :src="currentSummoner.profileIcon" />
            <div class="ml-4 flex-1">
              <div class="text-2xl font-semibold">{{ currentSummoner.displayName }}</div>
              <div class="!mt-2 flex items-center">
                <el-tag>{{ currentSummoner.environment || userStore.environment }}</el-tag>
                <div class="ml-4 text-sm" v-if="currentSummoner.gameStatus">
                  <span class="relative inline-block w-[6px] h-[6px] align-middle rounded-[50%] bg-blue-500 mr-1"></span>
                  <span class="text-blue-500 font-semibold">{{ currentSummoner.gameStatus }}</span>
                </div>
              </div>
              <el-tooltip :content="`当前经验值: ${currentSummoner.xpSinceLastLevel}xp, 距离升级还需要: ${currentSummoner.xpUntilNextLevel}xp`">
                <el-progress class="mt-2" :percentage="currentSummoner.progress" />
              </el-tooltip>
            </div>
          </summoner>
          <rank class="flex" v-if="currentSummoner.rank">
            <el-space size="large">
              <div class="flex flex-col items-center">
                <img class="!w-[78px]" :src="getRankTigerImg(currentSummoner.rank.rankedSoloTier)" />
                <el-tag effect="light" type="danger">单双排: {{ currentSummoner.rank.rankedSolo }}</el-tag>
              </div>
              <div class="flex flex-col items-center">
                <img class="!w-[78px]" :src="getRankTigerImg(currentSummoner.rank.rankedFlexTier)" />
                <el-tag effect="light" type="success">灵活组排: {{ currentSummoner.rank.rankedFlex }}</el-tag>
              </div>
              <div class="flex flex-col items-center">
                <img class="!w-[78px]" :src="getRankTigerImg(currentSummoner.rank.rankedHighestTier)" />
                <el-tag effect="light" type="warning">历史最高: {{ currentSummoner.rank.rankedHighest }}</el-tag>
              </div>
            </el-space>
          </rank>
        </div>
      </el-card>
      <el-row :gutter="8" v-if="currentSummoner.showData">
        <el-col class="mt-2" :span="12">
          <el-card shadow="never" :body-style="{ padding: '14px 20px' }">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <h3 class="">近期20场对局</h3>
                <div class="title ml-4 mt-4">
                  <span class="text-2xl font-youshe">KDA</span>
                  <span class="text-4xl font-semibold ml-5"
                    ><i>{{ currentSummoner.showData.kda }}</i></span
                  >
                </div>
              </div>
              <img class="w-[105px]" src="../assets/image/model/kda_banner.svg" />
            </div>
          </el-card>
        </el-col>
        <el-col class="mt-2" :span="12">
          <el-card shadow="never" :body-style="{ padding: '14px 20px' }">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <h3 class="">近期20场对局场均</h3>
                <div class="title ml-4 mt-4">
                  <span class="text-2xl font-youshe">输出</span>
                  <span class="text-4xl font-semibold ml-5"
                    ><i>{{ currentSummoner.showData.damage }}</i></span
                  >
                </div>
              </div>
              <img class="w-[105px]" src="../assets/image/model/damage_banner.svg" />
            </div>
          </el-card>
        </el-col>
        <el-col class="mt-2" :span="12">
          <el-card shadow="never" :body-style="{ padding: '14px 20px' }">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <h3 class="">近期20场对局场均</h3>
                <div class="title ml-4 mt-4">
                  <span class="text-2xl font-youshe">经济</span>
                  <span class="text-4xl font-semibold ml-5"
                    ><i>{{ currentSummoner.showData.money }}</i></span
                  >
                </div>
              </div>
              <img class="w-[105px]" src="../assets/image/model/money_banner.svg" />
            </div>
          </el-card>
        </el-col>
        <el-col class="mt-2" :span="12">
          <el-card class="h-[135px]" shadow="never" :body-style="{ padding: '14px 20px' }">
            <div class="flex flex-col justify-center">
              <div class="flex flex-col mt-4">
                <h3 class="">近期常用位置</h3>
                <div class="flex items-center justify-center">
                  <div class="flex items-center" v-for="(item, index) in currentSummoner.rencentlyPosition" :key="index">
                    <div class="mt-2 flex flex-col items-center justify-center">
                      <img class="w-11" :src="positionIcon[item.position]" />
                      <el-tag class="!mr-0 !mt-1" :type="item.wins / item.total >= 0.5 ? 'success' : 'danger'"> {{ item.wins }} 胜 / {{ item.total - item.wins }} 负 </el-tag>
                    </div>
                    <el-divider v-if="index != currentSummoner.rencentlyPosition.length - 1" direction="vertical" style="height: 40px; margin: 0 14px" />
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" class="!mt-2 !p-2 flex-1">
        <h3 class="">常用英雄熟练等级</h3>
        <div class="mt-10 flex items-center justify-between w-full" v-if="currentSummoner.championMastery">
          <div class="w-full flex flex-col justify-center items-center mx-2" v-for="(item, index) in currentSummoner.championMastery.masteries" :key="index">
            <el-avatar class="!mb-4" :src="utils.getChampionAvatarById(item.championId)" :size="72" />
            <el-tag v-if="item.highestGrade" type="danger"
              >成就等级： <span class="font-youshe !text-xl">{{ item.highestGrade }}</span></el-tag
            >
            <el-tag class="" v-if="!item.highestGrade" type="warning"
              >英雄荣誉： <span class="font-youshe !text-xl">{{ item.championLevel }}级</span></el-tag
            >
            <el-tag class="!mt-3 !text-lg" type="info">
              <span class="font-youshe !text-xl">{{ item.championPoints }} </span></el-tag
            >
          </div>
        </div>
      </el-card>
    </div>

    <!-- 右侧 -->
    <el-card shadow="never" class="!h-full w-[244px]">
      <template #header>
        <div class="flex justify-between items-center">
          <span>近期战绩</span>
          <el-button link type="primary" @click="toHistoryDetail">查看更多</el-button>
        </div>
      </template>
      <div
        v-if="currentSummoner.hisotryMatch"
        :class="index == 9 ? 'border-none' : 'border-b'"
        class="flex justify-between w-full my-0.5 py-[6px] cursor-pointer border-b border-[var(--el-border-color)] hover:bg-gray-100 dark:hover:bg-[#1d1e1f]"
        v-for="(item, index) in currentSummoner.hisotryMatch.slice(0, 10)"
        :key="index"
        @click="toHistoryDetail(item.gameId)"
      >
        <el-tooltip placement="left" :content="`查看 ${utils.getChampionById(item.participants[0].championId).label}(${dayjs(item.gameCreationDate).format('YYYY-MM-DD')}) 详情`">
          <el-avatar :size="48" shape="square" :src="utils.getChampionAvatarById(item.participants[0].championId)" />
        </el-tooltip>
        <div class="mx-2 flex flex-col justify-between">
          <img class="!w-[23px]" :src="utils.getSpellInfoById(item.participants[0].spell1Id).img" alt="" />
          <img class="!w-[23px]" :src="utils.getSpellInfoById(item.participants[0].spell2Id).img" alt="" />
        </div>
        <div class="flex-1 flex flex-col pl-1 items-start">
          <div :class="['font-semibold', item.participants[0].stats.win ? 'text-green-500' : 'text-red-500']">
            <span> {{ utils.translate('queue', item.queueId) }}</span>
            <span class="ml-1 text-base">({{ item.participants[0].stats.kills }}/{{ item.participants[0].stats.deaths }}/{{ item.participants[0].stats.assists }})</span>
          </div>
          <div class="flex mt-1">
            <el-tag effect="dark" :type="item.participants[0].stats.win ? 'success' : 'danger'" style="padding: 0px 4px">
              {{ item.participants[0].stats.win ? '胜利' : '失败' }}
            </el-tag>
            <el-tag class="ml-2" type="info">
              <!--              <template #icon>-->
              <!--                <field-time-outlined />-->
              <!--              </template>-->
              {{ dayjs(item.gameCreationDate).fromNow() }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.el-card {
  --el-card-padding: 10px;
  background: none;
}
.summoner-info-container {
  width: 100%;
  height: 100%;
  display: flex;
  .title {
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
}
</style>
