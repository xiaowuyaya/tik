<script setup>
import { ref } from 'vue'
import { Search, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getRecentlySearchList, clearRecentlySearch, saveRecentlySearchList, deleteRecentlySearch } from '../../utils'
import { ElMessage } from 'element-plus'

const router = useRouter()
const summonerName = ref('')
const recentlySearchList = ref(getRecentlySearchList())

async function handleSearchSummoner() {
  summonerName.value = summonerName.value.trim()
  if (summonerName.value == '') {
    ElMessage.warning('搜索的玩家游戏名称不能为空哦')
    return
  }
  const summoner = (await $api.getSummonerInfoBySummonerName(summonerName.value)) || { errorCode: 'RPC_ERROR' }
  if (!(summoner.errorCode && summoner.errorCode === 'RPC_ERROR')) {
    // 判断这个名字是否存在
    saveRecentlySearchList(summonerName.value)
    recentlySearchList.value = getRecentlySearchList()
    router.push({ path: '/SummonerInfo', query: { summonerName: summonerName.value } })
  } else {
    ElMessage.error('当前搜索的玩家不存在，或是不在当前大区')
  }
}

function deleteRencently(name){
  deleteRecentlySearch(name)
  recentlySearchList.value = getRecentlySearchList()
}

const clearHistory = () => {
  clearRecentlySearch()
  recentlySearchList.value = getRecentlySearchList()
}
</script>

<template>
  <div class="search-container">
    <div class="w-full pt-10 flex flex-col items-center pt-22">
      <img class="w-52 h-52" src="../../assets/image/model/emote_skyglass.png" />
      <el-input class="!w-[50%]" v-model="summonerName" size="large" placeholder="请输入需要搜索的玩家名称，仅支持查詢当前大区" :prefix-icon="Search" @pressEnter="handleSearchSummoner" @search="handleSearchSummoner">
        <template #append>
          <el-button type="primary" @click="handleSearchSummoner">搜索玩家</el-button>
        </template>
      </el-input>
      <el-card class="!mt-6 w-[60%]" shadow="never">
        <div class="flex flex-col">
          <div class="text-base font-medium flex items-center justify-between">
            <div>最近搜索</div>
            <el-button :icon="Delete" link @click="clearHistory">清空记录</el-button>
          </div>
          <div class="mt-4 flex">
            <div v-show="recentlySearchList.length == 0">暂无搜索记录</div>
            <div class="flex flex-wrap" v-show="recentlySearchList.length != 0" style="max-height: 240px; overflow: hidden">
              <div class="m-2 cursor-pointer" v-for="(item, index) in recentlySearchList" :key="index">
                <el-tag closable type="info" @click="summonerName = item" @close="deleteRencently(item)"
                  ><span class="text-base" style="font-family: SmileySans; font-weight: 500">{{ item }}</span></el-tag
                >
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search-container {
  width: 100%;
  height: 100%;
  display: flex;

  .el-card {
    background: none;
  }
}
</style>
