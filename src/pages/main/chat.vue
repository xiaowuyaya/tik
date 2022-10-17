<template>
  <div class="flex w-full h-full">
    <div class="flex flex-col w-[76%] h-full">
      <a-card class="flex-auto" :hoverable="true" :header-style="{ border: 'none' }">
        <c-scrollbar ref="scrollbarRef" width="100%" height="460px" trigger="hover">
          <block v-for="(item, index) in chatList" :key="index">
            <div v-if="item.type == 'normal'" :class="item.userId == userStore.userId ? 'flex-row-reverse':'reverse'"
              class="flex  flex-grow w-full mb-5  h-[60%]">
              <img class="w-[36px] h-[36px] rounded-lg" alt="avatar" :src="utils.getProfileIcon(item.avatar)" />
              <div :class="item.userId == userStore.userId ?'mr-2':'ml-2'" class="flex flex-col w-full max-w-[70%]">
                <div :class="item.userId == userStore.userId ?'justify-end':''" class="flex flex-row items-center">
                  <a-tooltip content="点击复制游戏id">
                    <div class="font-bold text-base font-black cursor-pointer" @click="copy(item.summonerName)">
                      {{item.environment}} {{item.summonerName}}</div>
                  </a-tooltip>
                  <div class="ml-2 font-normal leading-3">{{dayjs(item.time).format('MM-DD HH:mm:ss')}}</div>
                </div>
                <div :class="item.userId == userStore.userId ?'justify-end':''" class="flex">
                  <div
                    class="mt-2 text-black-900 bg-indigo-100 p-2 rounded w-[fit-content] backdrop-filter backdrop-blur-[30px]">
                    {{item.msg}}</div>
                </div>
              </div>
            </div>
            <div v-if="item.type == 'system'" class="flex justify-center items-center my-1">
              <div class="bg-gray-100 text-sm p-1 rounded w-[fit-content]">{{item.msg}}</div>
            </div>
          </block>
        </c-scrollbar>
      </a-card>
      <a-card class="h-[38%] !mt-2" :hoverable="true" :header-style="{ border: 'none' }">
        <a-textarea v-model="messageText" placeholder="Please enter something" :max-length="300" allow-clear
          show-word-limit :auto-size="{minRows:5,maxRows:5}" />
        <div class="flex justify-end">
          <a-button class="" type="primary" size="medium" @click="sendMessage" :disabled="messageText.length == 0">发送
          </a-button>
        </div>
      </a-card>
    </div>
    <a-card class="h-full flex-auto ml-2" :hoverable="true">
      <template #title>
        <span class="text-gray-500 text-base">在线玩家</span>
      </template>
      <template #extra>
        <span class="text-gray-500 text-base">{{summonerList.length}}人</span>
      </template>
      <c-scrollbar width="100%" height="630px" trigger="hover">
        <div class="flex justify-start items-center px-1 py-1.5" v-for="(item, index) in summonerList" :key="index">
          <img class="w-[26px] h-[26px] rounded-full " alt="avatar" :src="utils.getProfileIcon(item.avatar)" />
          <div class="ml-1 leading-3 text-black-900 overflow-ellipsis">{{item.environment}}·{{item.summonerName}}</div>
        </div>
      </c-scrollbar>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { copy } from '../../utils/tools'
import { Message } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import io from 'socket.io-client';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { useUserStore } from '../../store/user'

const utils = $utils
const userStore = useUserStore()
const messageText = ref('')
const scrollbarRef = ref();
let socket = null
const summonerList = ref([])
const chatList = ref([])

console.log(userStore.gameAvatar);


userStore.userInfo({
  mac: $tools.PC_MAC,
  clientVersion: $tools.APP_VERSION,
}, false);


onBeforeMount(() => {
  socket = io(`http://localhost:3000?userId=${userStore.userId}&environment=${userStore.environment}&avatar=${userStore.gameAvatar}&summonerName=${userStore.summonerName}`, { transports: ['websocket'], autoConnect: true, reconnection: true, reconnectionAttempts: 3, });

  socket.on('connect', function (connection) {
    socket.emit('activeUser', '')
    socket.emit('history', '')
  })

  socket.on('message', function (data) {
    chatList.value.push({ ...data.data, type: 'normal' })
    scrollbarRef.value.setScrollTop(999 * 999)
  })

  socket.on('activeUser', function (data) {
    summonerList.value = data.data
  })

  socket.on('history', function (data) {
    let list = data.data
    list.forEach(item  => {
      item.type = 'normal'
    });
    console.log(list);
    
    chatList.value =list
    scrollbarRef.value.setScrollTop(999 * 999)
  })

  socket.on('leave', function (data) {
    chatList.value.push({ ...data, type: 'system' })
    scrollbarRef.value.setScrollTop(999 * 999)
  })

  socket.on('join', function (data) {
    chatList.value.push({ ...data, type: 'system' })
    console.log(data);

    scrollbarRef.value.setScrollTop(999 * 999)
  })

}),

  onUnmounted(() => {
    console.log('disconnect');
    if (socket) socket.disconnect()
  })

function sendMessage() {
  socket.emit('message', { msg: messageText.value })
  scrollbarRef.value.setScrollTop(999999)
  messageText.value = ''
}

</script>
