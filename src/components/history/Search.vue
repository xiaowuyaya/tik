<template>
  <div class="h-full w-full flex justify-center">

    <div class=" w-full pt-2 flex flex-col items-center">
      <div class="h-9">
        <a-alert v-show="showError" class="w-[70%]" type="error" banner>当前搜索的玩家不存在，或是不在当前大区</a-alert>
      </div>
      <img class="w-82" src="@/assets/rank-tiger/challenger.png">
      <div class="flex mt-[-32px]">
        <a-input-search :style="{
          'width': '462px',
          'height': '48px !important'
        }" v-model="summonerName" size="large" :max-length="18" placeholder="请输入需要搜索的玩家名称，仅支持当前大区"
          @enter="searchSummoner" @search="searchSummoner" />
      </div>
      <a-card class="!mt-4 bg-light-100 w-[580px] " :hoverable="true" :header-style="{ border: 'none' }">
        <div class="flex flex-col">
          <div class="text-base font-medium text-gray-500 flex justify-between">
            <div>最近搜索</div>
            <a-link theme="danger" @click="clearHisotrySearch">
              <template #icon>
                <icon-delete />
              </template>
              清空记录
            </a-link>
          </div>
          <div class="mt-4 flex text-gray-800">
            <div v-if="rencentlySearchList.length == 0">暂无数据</div>
            <div class="flex flex-wrap" v-if="rencentlySearchList.length != 0">
              <div class="m-2 cursor-pointer" v-for="(item, index) in rencentlySearchList" :key="index">
                <a-tag size="large" color="blue" closable @click="summonerName = item"
                  @close="deleteRencentlySearch(item)">{{ item }}</a-tag>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import _ from 'loadsh'
import { useRouter } from 'vue-router';


const summonerName = ref('')
const rencentlySearchList = ref<any>([])
const showError = ref(false)

const handle = window.handle

const router = useRouter()

onMounted(() => {
  getRencentlySearchList()
})

const searchSummoner = async () => {
  summonerName.value = summonerName.value.trim()
  if (summonerName.value == '') return
  saveRencentlySearchList(summonerName.value)
  const r = await handle.checkSummonerExist(summonerName.value)

  if (r) {
    router.push({ path: '/search-content', query: { summonerName: summonerName.value } })
  } else {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 2500)
  }

}

const deleteRencentlySearch = (summonerName: string) => {
  let data = rencentlySearchList.value
  _.remove(data, (item: string) => {
    return item == summonerName
  })
  localStorage.setItem('rencently:summoner:search', JSON.stringify(data))
  getRencentlySearchList()
}

const getRencentlySearchList = () => {
  let data = localStorage.getItem('rencently:summoner:search')
  if (data) {
    rencentlySearchList.value = JSON.parse(data)
    return
  }
  rencentlySearchList.value = []
}

const saveRencentlySearchList = (summonerName: string) => {
  let data = rencentlySearchList.value

  const isExit = _.findIndex(data, (item: string) => { return item == summonerName })

  if (isExit != -1) return
  data.push(summonerName)
  localStorage.setItem('rencently:summoner:search', JSON.stringify(data))
}

const clearHisotrySearch = () => {
  localStorage.clear()
  getRencentlySearchList()
}

</script>
