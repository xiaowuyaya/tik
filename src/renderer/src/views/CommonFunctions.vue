<script setup>
import _ from 'lodash'
import { reactive, ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { useAppConfigStore } from '../store/appConfig'
import { ElMessage } from 'element-plus'
import { championOptions, rankOptions, statusOptions } from '../utils/options'
import SeraphineImg from '../assets/image/model/Seraphine.jpg'

const shell = $shell
const utils = $utils
const appStore = useAppConfigStore()
const positionOptions = ref([
  {
    label: '上路',
    value: 'TOP',
  },
  {
    label: '打野',
    value: 'JUNGLE',
  },
  {
    label: '中路',
    value: 'MIDDLE',
  },
  {
    label: '下路',
    value: 'BOTTOM',
  },
  {
    label: '辅助',
    value: 'SUPPORT',
  },
  {
    label: '补位',
    value: 'FILL',
  },
])

const state = reactive({
  ranked: '',
  status: '',
  modifySummonerName: '',
  modifyStatusMessage: '',
  spectator: '',
  profileIcon: {
    showModal: false,
    curSummonerAvatar: 0,
    modifySummonerAvatarId: 0,
    modifySummonerAvatar: '',
  },
  summonerBg: {
    showModal: false,
    curSkinOptions: [],
    curChampionSkinList: [],
    curChampionId: null,
    curSkins: '',
    skinImg: '',
    imgTitle: '',
  },
  friendRecord: {
    showModal: false,
    columns: [
      {
        title: '游戏名',
        dataIndex: 'nick',
        key: 'name',
      },
      {
        title: '添加时间',
        dataIndex: 'friendsSince',
        key: 'friendsSince',
      },
    ],
    data: [],
  },
})

function callMessage(res, successMsg, errMsg) {
  if (!res && errMsg) {
    ElMessage.warning(errMsg)
  }
  if (res && successMsg) {
    ElMessage.success(successMsg)
  }
}

async function handleSelectChange(type, event) {
  let chatInfo = await $api.getPlayerChatInfo()

  if (type === 'ranked') {
    chatInfo.lol.rankedLeagueDivision = 'I'
    chatInfo.lol.rankedLeagueQueue = 'RANKED_SOLO_5x5'
    chatInfo.lol.rankedLeagueTier = event
    chatInfo.lol.rankedPrevSeasonDivision = 'I'
    callMessage(await $api.putPlayerChatInfo(chatInfo), `段位伪造: ${event}， 成功(国服该功能可能异常)`, `段位伪造发生异常，客户端链接可能断开`)
  }
  if (type === 'status') {
    chatInfo.availability = event
    callMessage(await $api.putPlayerChatInfo(chatInfo), `状态更改: ${event}， 成功`, `状态更改发生异常，客户端链接可能断开`)
  }
  if (type === 'name') {
    chatInfo.name = state.modifySummonerName
    callMessage(await $api.putPlayerChatInfo(chatInfo), `修改召唤师名称成功`, `更改发生异常，客户端链接可能断开`)
  }
  if (type === 'StatusMessage') {
    let chatSettings = await $api.getChatSettings()
    chatSettings['chat-status-message'] = state.modifyStatusMessage
    await $api.updateChatSettings(chatSettings)
    chatInfo.statusMessage = state.modifyStatusMessage
    const res = await $api.putPlayerChatInfo(chatInfo)
    await $api.updateConversationsParticipants(chatInfo.pid, chatInfo)
    callMessage(res, `修改签名成功(国服不显示签名了)`, `更改发生异常，客户端链接可能断开`)
  }
}

async function avatarBoxHandle() {
  callMessage(
    await $api.regalia({
      preferredBannerType: 'lastSeasonHighestRank',
      preferredCrestType: 'prestige',
      selectedPrestigeCrest: 0,
    }),
    `取下头像框成功 （注意等级需要大于525级才能生效）`,
    `取下头像框失败`
  )
}

async function medalHandle() {
  callMessage(
    await $api.updatePlayerPreferences({
      challengeIds: [],
      title: '',
    }),
    `取下勋章头衔成功`,
    `取下勋章头衔失败`
  )
}

const handleChangeProfileIcon = async () => {
  state.profileIcon.showModal = true
  const summoner = await $api.getCurrentSummoner()
  state.profileIcon.curSummonerAvatar = utils.getProfileIcon(summoner.profileIconId)
}

function getNewProfileIcon(data) {
  state.profileIcon.modifySummonerAvatar = utils.getProfileIcon(data)
}

async function updateProfileIcon() {
  try {
    // 经常不生效 多请求几次
    for (let i = 0; i < 2; i++) {
      let chatInfo = await $api.getPlayerChatInfo()
      chatInfo.icon = state.profileIcon.modifySummonerAvatarId
      await $api.putPlayerChatInfo(chatInfo)
      await $api.updateIcon({ profileIconId: Number(state.profileIcon.modifySummonerAvatarId) })
    }
    ElMessage.success('请求已发送')
  } catch (err) {
    ElMessage.error('updateProfileIcon处理失败')
  }
}

async function handleSummonerBackground(type) {
  if (type === 'champions') {
    const r = await $api.getChampionSkinListById(state.summonerBg.curChampionId)
    state.summonerBg.curSkins = ''
    state.summonerBg.curSkinOptions = []
    let tempOptions = []
    for (let i = 0; i < r.skins.length; i++) {
      tempOptions.push({
        value: r.skins[i].id,
        label: r.skins[i].name,
      })
    }
    state.summonerBg.curSkinOptions = tempOptions
    state.summonerBg.curChampionSkinList = r.skins
    state.summonerBg.skinImg = await $api.getLcuImgBase64(r.skins[0].splashPath)
    state.summonerBg.imgTitle = r.title
  }
  if (type === 'skins') {
    _.forEach(state.summonerBg.curChampionSkinList, async value => {
      if (value.id === state.summonerBg.curSkins) {
        state.summonerBg.skinImg = await $api.getLcuImgBase64(value.splashPath)
        return
      }
    })
  }
  if (type === 'confirm') {
    if (state.summonerBg.curSkins) {
      callMessage(
        await $api.setBackgroundSkinId({
          key: 'backgroundSkinId',
          value: state.summonerBg.curSkins,
        }),
        '生涯背景修改成功',
        '修改失败'
      )
    } else {
      ElMessage.warning('请先选择生涯背景后再应用')
    }
  }
}

async function friendsRecordHandle() {
  let data = await $api.friendsRecord()
  data.sort((a, b) => {
    return a.friendsSince < b.friendsSince ? 1 : -1
  })
  state.friendRecord.data = data
  state.friendRecord.showModal = true
}

async function handleSpectator() {
  callMessage(await $api.spectatorLaunchByName(state.spectator, 'RANKED_SOLO_5x5'), '拉起观战成功，等待客户端响应', '拉起观战发生异常，客户端未启动或对方不在召唤师峡谷地图游戏中')
}

async function handleCreatePracticeToolMode() {
  callMessage(await $api.createCustomLobby('PRACTICETOOL', 11, `[TikLeagueTool] 5V5训练模式${Math.random() * 100}`), `5V5训练房间 创建成功`, `创建失败，请检查客户端是否启动`)
}
</script>

<template>
  <div class="container">
    <el-card shadow="nerver" :body-style="{ padding: '16px' }">
      <el-scrollbar max-height="660px">
        <h1 class="container-title font-semibold text-2xl">功能及配置</h1>
        <div class="flex flex-col mt-4 px-14">
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">自动接受对局</h3>
              <el-switch v-model="appStore.autoAccept.enable" size="large" inline-prompt :active-icon="Check" :inactive-icon="Close" />
            </div>
            <desc class="mt-1 text-[14px]">
              <span>当寻找到对局时Tik将自动接受，无需保持游戏前台操作当前设置为</span>
              <el-input-number v-model="appStore.autoAccept.delay" size="small" class="mx-1 !w-[5rem]" :min="1" :max="10" controls-position="right" />
              <span>秒后接受对局</span>
            </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">自动匹配下一场对局</h3>
              <div>
                <el-select v-model="appStore.autoMatchingGame.position" multiple :disabled="!appStore.autoMatchingGame.enable" placeholder="Select" class="mr-4" style="width: 164px">
                  <el-option v-for="item in positionOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-switch v-model="appStore.autoMatchingGame.enable" size="large" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </div>
            </div>
            <desc class="mt-1 text-[14px]"> 当游戏结束到对局数据界面时自动开始寻找下一场对局(模式按最近一把战绩创建,不支持自定义)，仅单人游戏可用 </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">自动应用符文</h3>
              <div>
                <el-switch v-model="appStore.autoUseRune" size="large" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </div>
            </div>
            <desc class="mt-1 text-[14px]">在英雄选择阶段确定英雄时，将自动查询OPGG最佳符文数据并自动应用</desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">开局禁言</h3>
              <div>
                <el-switch v-model="appStore.autoMute" size="large" inline-prompt :active-icon="Check" :inactive-icon="Close" />
              </div>
            </div>
            <desc class="mt-1 text-[14px]">眼不见为净，在进入游戏30秒后将自动发送 " /mute all" 来禁言所有玩家，安静游戏 </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">头像框与头衔</h3>
              <div>
                <el-button @click="avatarBoxHandle">取下头像框</el-button>
                <el-button @click="medalHandle">取下勋章头衔</el-button>
              </div>
            </div>
            <desc class="mt-1 text-[14px]">花里胡哨？就喜欢干干净净，点击上方按钮一键卸下头像框以及勋章头衔 注：取下头像框需要等级大于525级 </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">段位伪造</h3>
              <div>
                <el-select v-model="state.ranked" placeholder="请选择段位" @change="handleSelectChange('ranked', $event)">
                  <el-option v-for="item in rankOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </div>
            <desc class="mt-1 text-[14px]"> 在上方选择需要修改的段位，鼠标悬停在游戏客户端头像上可见修改的段位信息，好友可见，不包括生涯 </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">游戏状态更改</h3>
              <div>
                <el-select v-model="state.status" placeholder="请选择游戏状态" @change="handleSelectChange('status', $event)">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </div>
            <desc class="mt-1 text-[14px]">在上方选择需要修改的状态，游戏客户端在线状态即可更改，好友可见</desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">5v5训练模式</h3>
              <div>
                <el-button @click="handleCreatePracticeToolMode">创建房间</el-button>
              </div>
            </div>
            <desc class="mt-1 text-[14px]">点击按钮即可创建5v5训练模式房间，腾讯服仅可添加9个机器人。</desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">游戏名修改</h3>
              <div>
                <el-input class="w-[160px]" v-model="state.modifySummonerName" placeholder="请输入修改的游戏名">
                  <template #append>
                    <el-button @click="handleSelectChange('name', $event)">修改</el-button>
                  </template>
                </el-input>
              </div>
            </div>
            <desc class="mt-1 text-[14px]"> 在上方输入需要修改的游戏名，点击修改按钮之后将修改游戏客户端的显示的游戏名称，仅自己可见，不包括生涯 </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">签名修改</h3>
              <div class="flex">
                <el-input class="w-[160px]" v-model="state.modifyStatusMessage" placeholder="请输入修改的签名">
                  <template #append>
                    <el-button @click="handleSelectChange('StatusMessage', $event)">修改</el-button>
                  </template>
                </el-input>
              </div>
            </div>
            <desc class="mt-1 text-[14px]">在上方输入需要修改的签名，国服不显示签名文本</desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">召唤师图标修改</h3>
              <div class="flex">
                <el-button @click="handleChangeProfileIcon">选择图标</el-button>
              </div>
            </div>
            <desc class="mt-1 text-[14px]">
              该功能可以修改客户端的显示头像，但生涯以及列队界面大概率会变成默认头像
              <a class="!px-1 underline" href="javascript:;" @click="shell.openExternal('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/')">点击此处</a>
              查看头像素材id
            </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">生涯背景修改</h3>
              <div class="flex">
                <el-button @click="state.summonerBg.showModal = true">选择生涯</el-button>
              </div>
            </div>
            <desc class="mt-1 text-[14px]"> 请选择需要修改的生涯图片，即可在游戏客户端中生效，可改所有生涯图片且所有人可见 </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">好友记录</h3>
              <div class="flex">
                <el-button @click="friendsRecordHandle">点击查看</el-button>
              </div>
            </div>
            <desc class="mt-1 text-[14px]"> 该功能可展示当前账号下所有好友的添加时间，记录与他从何时相识。 </desc>
          </div>
          <div class="w-full !py-3 flex flex-col items-start border-b border-[var(--el-border-color)]">
            <div class="w-full flex items-center justify-between">
              <h3 class="font-semibold text-[16px]">拉起观战</h3>
              <div class="flex">
                <el-input class="w-[230px]" v-model="state.spectator" placeholder="请输入玩家游戏名">
                  <template #append>
                    <el-button @click="handleSpectator">拉起</el-button>
                  </template>
                </el-input>
              </div>
            </div>
            <desc class="mt-1 text-[14px]"> 无需好友位即可拉起观战，被观战玩家需要开始游戏3分钟，仅支持召唤师峡谷地图。 </desc>
          </div>
        </div>
      </el-scrollbar>
    </el-card>

    <!-- 弹窗 -->
    <!--    召唤师图标修改-->
    <el-dialog v-model="state.profileIcon.showModal" title="召唤师图标修改" width="30%">
      <div class="flex flex-col items-center justify-between">
        <div class="flex flex-row items-center justify-between h-[140px]">
          <div class="flex flex-col items-center justify-between mr-4">
            <el-avatar :size="64" shape="square" :src="state.profileIcon.curSummonerAvatar" />
            <div class="mt-2 font-normal">当前召唤师图标</div>
          </div>
          <div class="flex flex-col items-center justify-between">
            <el-avatar :size="64" :src="state.profileIcon.modifySummonerAvatar" />
            <div class="mt-2 font-normal">你选择的召唤师图标</div>
          </div>
        </div>
        <div class="flex">
          <el-input class="!w-[200px] mr-2" type="number" v-model="state.profileIcon.modifySummonerAvatarId" placeholder="头像id" @input="getNewProfileIcon"></el-input>
          <el-button type="primary" @click="updateProfileIcon">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!--    生涯背景修改-->
    <el-dialog v-model="state.summonerBg.showModal" title="生涯背景修改" width="70%">
      <div class="flex flex-col items-center justify-center">
        <el-card shadow="never" class="w-full flex flex-col items-center" body-style="padding: 16px">
          <el-form class="!w-full" :inline="true" :model="state.summonerBg">
            <el-form-item name="curChampionId" label="英雄">
              <el-select-v2 class="!w-[220px]" v-model="state.summonerBg.curChampionId" filterable placeholder="请选择英雄" :options="championOptions" @change="handleSummonerBackground('champions')" />
            </el-form-item>
            <el-form-item name="curChampionId" label="生涯背景">
              <el-select class="!w-[220px]" v-model="state.summonerBg.curSkins" filterable placeholder="请选择生涯背景" @change="handleSummonerBackground('skins')">
                <el-option v-for="item in state.summonerBg.curSkinOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleSummonerBackground('confirm')" type="primary"> 应用 </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <a-card class="w-full !mt-2 flex flex-col items-center" body-style="padding: 16px">
          <img class="w-[640px] h-[360px]" :src="state.summonerBg.skinImg ? state.summonerBg.skinImg : SeraphineImg" alt="选择生涯背景后显示图片" />
        </a-card>
      </div>
    </el-dialog>

    <!-- 召唤师图标修改 -->
    <el-dialog v-model="state.friendRecord.showModal" title="好友添加记录查询" width="45%">
      <el-table :data="state.friendRecord.data" max-height="320px">
        <el-table-column prop="nick" label="游戏名" />
        <el-table-column prop="friendsSince" label="添加时间" />
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.el-card {
  background: none;
}

.container {
  height: 100%;
  width: 100%;

  .container-title {
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
}
</style>
