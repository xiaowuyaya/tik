<template>
  <div class="flex w-full h-full">
    <div class="flex flex-col w-[76%] h-full">
      <a-card class="flex-auto" :hoverable="true" :header-style="{ border: 'none' }">
        <c-scrollbar ref="scrollbarRef" width="100%" height="460px" trigger="hover">
          <block v-for="(item, index) in chatList" :key="index">
            <div :class="item.userId == userStore.userId ? 'flex-row-reverse':'reverse'"
              class="flex  flex-grow w-full mb-5  h-[60%]">
              <img class="w-[40px] h-[40px] rounded-lg" alt="avatar" :src="item.avatar" />
              <div :class="item.userId == userStore.userId ?'mr-2':'ml-2'" class="flex flex-col w-full max-w-[70%]">
                <div :class="item.userId == userStore.userId ?'justify-end':''" class="flex flex-row items-center">
                  <div class="font-bold text-[1.1rem] font-black">{{item.environment}} {{item.summonerName}}</div>
                  <div class="ml-2 font-normal leading-3">{{dayjs(item.time).format('MM-DD HH:mm:ss')}}</div>
                </div>
                <div :class="item.userId == userStore.userId ?'justify-end':''" class="flex">
                  <div
                    class="mt-2 text-black-900 bg-indigo-100 p-2 rounded w-[fit-content] backdrop-filter backdrop-blur-[30px]">
                    {{item.msg}}</div>
                </div>
              </div>
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
          <img class="w-[26px] h-[26px] rounded-full " alt="avatar" :src="item.avatar" />
          <div class="leading-3 text-black-900">【{{item.environment}}】{{item.summonerName}}</div>
        </div>
      </c-scrollbar>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import io from 'socket.io-client';
import { nextTick, ref, watch } from 'vue';
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const messageText = ref('')
const scrollbarRef = ref();
const summonerList = ref([
  {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  }, {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    userId: "1",
  },
])
const chatList = ref([
  {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    time: new Date(),
    userId: "1",
    msg: "这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息",
  },
  {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    time: new Date(),
    userId: "13",
    msg: "这是一条测试消息这是",
  },
  {
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    time: new Date(),
    userId: "1",
    msg: "这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测试消息这是一条测",
  }
])

userStore.userInfo({
  mac: $tools.PC_MAC,
  clientVersion: $tools.APP_VERSION,
}, false);


userStore.environment = 'development'
userStore.summonerName = 'test'

function sendMessage() {
  chatList.value.push({
    avatar: userStore.avatarUrl,
    environment: "艾欧尼亚",
    summonerName: "testtest1",
    time: new Date(),
    userId: "13",
    msg: messageText.value,
  })

  scrollbarRef.value.setScrollTop(999 * 999)

  messageText.value = ''
}

// const socket = io(`http://localhost:3000?userId=${userStore.userId}&environment=${userStore.environment}&avatar=${userStore.avatarUrl}&summonerName=${userStore.summonerName}`, { transports: ['websocket'], autoConnect: true, reconnection: true, reconnectionAttempts: 3, });
// socket.on('connection', function (connection) {
//   console.log('connection: ' + connection)
// })

// socket.on('message', function (data) {
//   console.log('data: ' + data)
// })
</script>
