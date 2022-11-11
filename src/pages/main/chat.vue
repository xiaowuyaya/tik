<template>
  <div class="flex w-full h-full">
    <div class="flex flex-col w-[76%] h-full">
      <a-card class="flex-auto" :hoverable="true" :header-style="{ border: 'none' }">
        <el-scrollbar ref="scrollbarRef" max-height="460px" always>
          <div ref="innerRef" class="w-full">
            <block v-for="(item, index) in chatList" :key="index">
              <div v-if="item.type == 'normal'" :class="item.userId == userStore.userId ? 'flex-row-reverse':'reverse'"
                   class="flex  flex-grow w-full mb-5 ">
                <img class="w-[36px] h-[36px] rounded-lg" alt="avatar" :src="utils.getProfileIcon(item.avatar)"/>
                <div :class="item.userId == userStore.userId ?'mr-2':'ml-2'" class="flex flex-col w-full max-w-[70%]">
                  <div :class="item.userId == userStore.userId ?'justify-end':''" class="flex flex-row items-center" style="color: var(--color-text-2)" >
                    <a-tooltip content="点击复制游戏id">
                      <div class="font-bold  font-black cursor-pointer" @click="copy(item.summonerName)">
                        {{ item.environment }} {{ item.summonerName }}
                      </div>
                    </a-tooltip>
                    <div class="ml-2 font-normal leading-3">{{ dayjs(item.time).format('MM-DD HH:mm:ss') }}</div>
                  </div>
                  <div :class="item.userId == userStore.userId ?'justify-end':''" class="flex">
                    <div
                        class="mt-2 text-black-900 bg-indigo-100 p-2 rounded w-[fit-content] backdrop-filter backdrop-blur-[30px]">
                      {{ item.msg }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.type == 'system'" class="flex justify-center items-center my-1">
                <div class="text-sm p-1 rounded w-[fit-content]" style="color: var(--color-text-2); background-color: var(--color-fill-2)" >{{ item.msg }}</div>
              </div>
            </block>
          </div>
        </el-scrollbar>
      </a-card>
      <a-card class="h-[38%] !mt-1" :hoverable="true" :header-style="{ border: 'none' }">
        <div class="flex mb-2 items-center">
          <div class="text-gray-500 text-sm">快捷输入：</div>
          <a-tag class="cursor-pointer" color="blue" bordered @click="addTextInfo(userStore.environment)">@我的大区
          </a-tag>
          <a-tag class="ml-2 cursor-pointer" color="blue" bordered @click="addTextInfo(userStore.summonerName)">@我的id
          </a-tag>
        </div>
        <a-textarea v-model="messageText" :placeholder="`${userStore.environment} 灵活4=1， 师兄弟就来砍我`"
                    :max-length="300"
                    allow-clear show-word-limit :auto-size="{minRows:4,maxRows:4}"/>
        <div class="flex justify-between">
          <div>
            <div class="text-red-500" v-show="!userStore.environment || !userStore.summonerName">
              未获取到客户端信息，无法发送
            </div>
          </div>
          <a-button class="" type="primary" size="medium" @click="sendMessage"
                    :disabled="!userStore.environment || !userStore.summonerName">发送
          </a-button>
        </div>
      </a-card>
    </div>
    <a-card class="h-full flex-auto ml-2" :hoverable="true">
      <template #title>
        <span class="text-base" style="color: var(--color-text-2)" >在线玩家</span>
      </template>
      <template #extra>
        <span class="text-base" style="color: var(--color-text-2)">{{ summonerList.length }}人</span>
      </template>
      <el-scrollbar max-height="630px">
        <div class="flex justify-start items-center px-1 py-1.5" v-for="(item, index) in summonerList" :key="index">
          <img class="w-[26px] h-[26px] rounded-full " alt="avatar" :src="utils.getProfileIcon(item.avatar)"/>
          <div class="ml-1 leading-3 overflow-ellipsis" style="color: var(--color-text-1)">{{ item.environment }}·{{ item.summonerName }}
          </div>
        </div>
      </el-scrollbar>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ElScrollbar} from 'element-plus'
import {copy} from '@/utils/tools'
import {Message} from '@arco-design/web-vue';
import dayjs from 'dayjs';
import io from 'socket.io-client';
import {onBeforeMount, onUnmounted, ref} from 'vue';
import {useUserStore} from '@/store/user'

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const utils = $utils
const userStore = useUserStore()
const messageText = ref('')
const innerRef = ref<HTMLDivElement>()
let socket: any = null
const summonerList = ref([])
const chatList = ref([])

userStore.userInfo({
  mac: $consts.PC_MAC,
  clientVersion: $consts.APP_VERSION,
}, false);

let KEEP_SOCKET_ALIVE: NodeJS.Timer | null = null;


onBeforeMount(() => {
  socket = io(`${$consts.ROOT_URI}?userId=${userStore.userId}&environment=${userStore.environment}&avatar=${userStore.gameAvatar}&summonerName=${userStore.summonerName}`, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 3,
  });

  socket.on('connect', function (connection) {
    socket.emit('activeUser', '')
    socket.emit('history', '')

    KEEP_SOCKET_ALIVE = setInterval(() => {
      socket.emit('ping', '')
    }, 10000)
  })

  socket.on('message', function (data: any) {
    chatList.value.push({...data.data, type: 'normal'})
    scrollbarRef.value!.setScrollTop(innerRef.value!.offsetHeight)
  })

  socket.on('activeUser', function (data: data) {
    summonerList.value = data.data
  })

  socket.on('history', function (data: data) {
    let list = data.data
    list.forEach(item => {
      item.type = 'normal'
    });
    list = list.reverse()

    chatList.value = list
    scrollbarRef.value!.setScrollTop(innerRef.value!.offsetHeight)
  })

  socket.on('leave', function (data) {
    chatList.value.push({...data, type: 'system'})
    scrollbarRef.value!.setScrollTop(innerRef.value!.offsetHeight)
  })

  socket.on('join', function (data) {
    chatList.value.push({...data, type: 'system'})
    console.log(data);

    scrollbarRef.value!.setScrollTop(innerRef.value!.offsetHeight)
  })

}),

    onUnmounted(() => {
      console.log('disconnect');
      if (KEEP_SOCKET_ALIVE) clearInterval(KEEP_SOCKET_ALIVE)
      if (socket) {
        socket.disconnect()
      }
    })

function addTextInfo(text: string) {
  messageText.value = messageText.value + text
}

function sendMessage() {
  if (messageText.value.length == 0) {
    Message.error('发送内容不能为空。')
    return
  }
  socket.emit('message', {msg: messageText.value})
  scrollbarRef.value!.setScrollTop(innerRef.value!.offsetHeight)
  messageText.value = ''
}

</script>
