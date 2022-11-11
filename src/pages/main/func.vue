<template>
  <a-scrollbar style="height:710px; overflow: auto;">
    <div class="func-container">
      <div class="text-xl font-black py-2" style="color: var(--color-text-1)">功能及配置</div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">自动接受对局</div>
          <a-switch v-model="configStore.autoAccept.enable" @change="configStore.save" />
        </div>
        <div class="item-box__desc">
          当寻找到对局时Tik将自动接受，无需保持游戏前台操作。当前设置为
          <a-input-number v-model="configStore.autoAccept.delay" @change="configStore.save" class="!w-[50px] mx-2" size="small" placeholder="" :min="0" :max="8"/>
          秒后接受对局
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">自动开局禁言</div>
          <a-switch v-model="configStore.autoMuteAll" @change="configStore.save" />
        </div>
        <div class="item-box__desc">眼不见为净，在进入游戏30秒后将自动发送 "/mute all" 来禁言所有玩家，安静游戏。</div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">头像框与头衔</div>
          <a-space>
            <a-button class="" type="primary" size="small"  @click="avatarBoxHandle">取下头像框</a-button>
            <a-button class="" type="primary" size="small" @click="medalHandle">取下勋章头衔</a-button>
          </a-space>
        </div>
        <div class="item-box__desc">
          花里胡哨？就喜欢干干净净，点击上方按钮一键卸下头像框以及勋章头衔。注：取下头像框需要等级大于525级
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">游戏名修改</div>
          <a-space>
            <a-input class="!w-[160px]"  v-model="useForm.modifySummonerName" placeholder="请输入修改的游戏名">
            </a-input>
            <a-button type="primary"  @click="handleChange('name', $event)">修改</a-button>
          </a-space>
        </div>
        <div class="item-box__desc">
          在上方输入需要修改的id，点击修改按钮之后将修改游戏客户端的显示的游戏名称，仅自己可见，不包括生涯。
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">段位伪造</div>
          <a-select class="!w-[230px]"  v-model="useForm.ranked" @change="handleChange('ranked', $event)"  placeholder="请选择段位"
                    allow-clear allow-search>
            <a-option v-for="(item, idx) in rankOptions" :key="idx" :value="item.value">{{ item.label }}</a-option>
          </a-select>
        </div>
        <div class="item-box__desc">
          在上方选择需要修改的段位，鼠标悬停在游戏客户端头像上可见修改的段位信息，好友可见，不包括生涯。
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">游戏状态更改</div>
          <a-select class="!w-[230px]" v-model="useForm.status" @change="handleChange('status', $event)"
                    placeholder="请选择状态"
                    allow-clear allow-search>
            <a-option v-for="(item, idx) in statusOptions" :key="idx" :value="item.value">{{ item.label }}
            </a-option>
          </a-select>
        </div>
        <div class="item-box__desc">
          在上方选择需要修改的状态，游戏客户端在线状态即可更改，好友可见。
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">召唤师图标修改</div>
          <a-button class="" type="primary" size="small" @click="changeSumonerAvatar">选择图标</a-button>
        </div>
        <div class="item-box__desc">
          该功能可以修改客户端的显示头像，不确定是不是自慰，开发者是生效成功了。
          <a-link
              @click="shell.openExternal('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/')">
            点击此处
          </a-link>
          查看头像id素材。
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">5v5训练模式</div>
          <a-button class="" type="primary" size="small"  @click="handleCreatePracticeToolMode">创建房间</a-button>
        </div>
        <div class="item-box__desc">点击按钮即可创建5v5训练模式房间，国服仅可添加9个机器人，外服可拉好友。</div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">生涯背景修改</div>
          <a-button class="" type="primary" size="small" @click="showSummonerBackground = true" >选择生涯</a-button>
        </div>
        <div class="item-box__desc">请选择需要修改的生涯图片，即可在游戏客户端中生效，可改所有生涯图片且所有人可见。</div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">拉起观战</div>
          <a-input-search class="!w-[230px]" @search="handleSpectator" search-button placeholder="请输入玩家游戏名"/>
        </div>
        <div class="item-box__desc">无需好友位即可拉起观战，被观战玩家需要开始游戏3分钟，仅支持召唤师峡谷地图。</div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">隐藏分查询</div>
          <a-button class="" size="small">查看二维码</a-button>
        </div>
        <div class="item-box__desc">外宣需要...请前往小程序查询，鼠标悬浮显示二维码。</div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">本命英雄查询</div>
          <a-button class="" size="small">查看二维码</a-button>
        </div>
        <div class="item-box__desc">同上。</div>
      </div>
      <div class="text-xl font-black pt-4 pb-2" style="color: var(--color-text-1)">自动禁选</div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">自动锁定</div>
          <a-switch v-model="configStore.confirmSelect" @change="configStore.save" />
        </div>
        <div class="item-box__desc">
          当启用自动禁选，自动选择英雄是是否自动确定，如果未启动该选项，软件仅会表明配置的禁选英雄而不锁定。
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">启用秒选</div>
          <a-switch  v-model="autoPick.enable" @change="configStore.set('app.autoBP.pick.enable', autoPick.enable)" />
        </div>
        <div class="item-box__desc">
          在英雄选择阶段根据配置内容自动选择英雄,可配置多项，当选用发生异常如被抢/ban可有其他选择方案。
        </div>
        <div v-show="autoPick.enable" class="mt-4 flex justify-center" >
          <a-card class="w-[60%]">
            <a-form :model="configStore" auto-label-width label-align="left">
              <a-form-item class="mb-4" label="匹配">
                <a-select v-model="autoPick.normal"
                          placeholder="一般模式如匹配等下需要秒选的英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4" label="上单">
                <a-select v-model="autoPick.top"
                          placeholder="排位模式下需要选用的上路英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4" label="打野">
                <a-select v-model="autoPick.jungle"
                          placeholder="排位模式下需要选用的打野英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4" label="中路">
                <a-select v-model="autoPick.middle"
                          placeholder="排位模式下需要选用的中路英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4" label="下路">
                <a-select v-model="autoPick.bottom"
                          placeholder="排位模式下需要选用的下路英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4 !mb-0" label="辅助">
                <a-select v-model="autoPick.utility"
                          placeholder="排位模式下需要选用的辅助英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
            </a-form>
            <div class="mt-4 w-full flex justify-center" >
              <a-button @click="saveAutoBpConfig">保存</a-button>
            </div>
          </a-card>
        </div>
      </div>
      <div class="item-box">
        <div class="item-box__form">
          <div class="item-box__form__title">启用禁选</div>
          <a-switch v-model="autoBan.enable" @change="configStore.set('app.autoBP.ban.enable', autoBan.enable)"/>
        </div>
        <div class="item-box__desc">
          在英雄选择阶段根据配置内容自动禁用英雄,可配置多项，当选用发生异常如被抢/ban可有其他选择方案。
        </div>
        <div v-show="autoBan.enable" class="mt-4 flex justify-center">
          <a-card class="w-[60%]">
            <a-form :model="configStore" auto-label-width label-align="left">
              <a-form-item class="mb-4" label="上单">
                <a-select v-model="autoBan.top"
                          placeholder="排位模式下需要选用的上路英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4" label="打野">
                <a-select v-model="autoBan.jungle"
                          placeholder="排位模式下需要选用的打野英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4" label="中路">
                <a-select v-model="autoBan.middle"
                          placeholder="排位模式下需要选用的中路英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4" label="下路">
                <a-select v-model="autoBan.bottom"
                          placeholder="排位模式下需要选用的下路英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
              <a-form-item class="mb-4 !mb-0" label="辅助">
                <a-select v-model="autoBan.utility"
                          placeholder="排位模式下需要选用的辅助英雄 （可输入搜索）"
                          multiple :limit="3"
                          :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
                </a-select>
              </a-form-item>
            </a-form>
            <div class="mt-4 w-full flex justify-center" >
              <a-button @click="saveAutoBpConfig">保存</a-button>
            </div>
          </a-card>
        </div>
      </div>
    </div>
    <!-- 召唤师图标修改 -->
    <a-modal v-model:visible="showAvatarModel" width="50%" :simple="true" :draggable="true" @ok="updateNewAvatar">
      <template #title>召唤师图标修改</template>
      <!-- https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/ -->
      <div class="flex flex-row items-center justify-evenly">
        <div class="flex flex-col items-center justify-between">
          <img :src="summonerAvatarData.curSummonerAvatar" alt="">
          <div class="mt-2">当前召唤师图标</div>
        </div>
        <div class="flex flex-col items-center justify-between">
          <a-form-item label="">
            <a-input v-model="summonerAvatarData.modifySummonerAvatarId" placeholder="请输入头像id"
                     @input="getNewSummonerAvatar">
            </a-input>
            <a-button class="ml-2" type="primary" @click="getNewSummonerAvatar">预览</a-button>
          </a-form-item>
          <a-avatar v-show="summonerAvatarData.modifySummonerAvatarId" :size="86" shape="square">
            <img :src="summonerAvatarData.modifySummonerAvatar" />
          </a-avatar>
        </div>
      </div>
    </a-modal>
    <!-- 生涯背景修改 -->
    <a-modal v-model:visible="showSummonerBackground" width="70%" :simple="true" :draggable="true"
             @ok="handleChangeSummonerBg">
      <template #title>生涯背景修改</template>
      <div class="flex flex-col items-center justify-center">
        <div class="mb-2 flex w-full justify-center">
          <a-select class="!w-[40%]" v-model="summonerBackground.curChampionId"
                    @change="handleSummonerBackground('champions')" placeholder="请选择英雄 可搜索" allow-clear allow-search
                    :options="appStore.championsStore" :virtual-list-props="{ height: 200 }">
          </a-select>

          <a-select class="!w-[40%] ml-2" v-model="summonerBackground.curSkins"
                    @change="handleSummonerBackground('skins')" placeholder="请选择皮肤 可搜索" allow-clear allow-search>
            <a-option v-for="(value, index) in curChampionSkinList" :key="index" :value="value.id">{{ value.name }}
            </a-option>
          </a-select>
        </div>

        <a-image width="640" height="360" :src="summonerBackground.skinImg" :title="summonerBackground.imgTitle"
                 :description="summonerBackground.imgDesc" />
      </div>
    </a-modal>
  </a-scrollbar>
</template>
<script setup lang="ts">
import {shell} from 'electron'
import {rankOptions, statusOptions} from '@/utils/options'
import {useConfigStore} from '@/store/config'
import { onMounted, reactive, ref} from 'vue';
import {useAppStore} from "@/store/app";
import {Message} from "@arco-design/web-vue";
import _ from 'loadsh'

const utils = $utils
const configStore = useConfigStore()
const appStore = useAppStore()
const useForm = reactive({
  ranked: '',
  status: '',
  spectator: '',
  modifySummonerName: ''
});
const autoPick = ref<any>({
  enable: false,
  normal: [],
  top: [],
  jungle: [],
  middle: [],
  bottom: [],
  utility: [],
});
const autoBan = ref<any>({
  enable: false,
  top: [],
  jungle: [],
  middle: [],
  bottom: [],
  utility: [],
});
const showSummonerBackground = ref(false);
const showAvatarModel = ref(false);
const curChampionSkinList = ref<any>([]);
const summonerBackground = reactive({
  curChampionId: null,
  curSkins: '',
  skinImg: 'some-error.png',
  imgTitle: '',
  imgDesc: '',
});
const summonerAvatarData = reactive({
  curSummonerAvatar: '',
  modifySummonerAvatarId: '',
  modifySummonerAvatar: ''
})

onMounted(()=>{
  autoPick.value = configStore.autoBP.pick

  autoBan.value = configStore.autoBP.ban
})

function saveAutoBpConfig(){
  configStore.autoBP.pick = autoPick.value
  configStore.set('app.autoBP.pick', autoPick.value)
  console.log(autoPick)
  configStore.autoBP.ban = autoBan.value
  configStore.set('app.autoBP.ban', autoBan.value)
}

async function changeSumonerAvatar() {
  showAvatarModel.value = true
  const summoner: any = await $api.getCurrentSummoner()
  summonerAvatarData.curSummonerAvatar = utils.getProfileIcon(summoner.profileIconId)
}

async function getNewSummonerAvatar() {
  summonerAvatarData.modifySummonerAvatar = utils.getProfileIcon(summonerAvatarData.modifySummonerAvatarId)
}

async function updateNewAvatar() {
  if (!summonerAvatarData.modifySummonerAvatarId) {
    Message.error('请输入正确的头像id')
  }
  let chatInfo:any  = await $api.getPlayerChatInfo()
  chatInfo.icon = summonerAvatarData.modifySummonerAvatarId
  await $api.putPlayerChatInfo(chatInfo)
  await $api.updateIcon({ "profileIconId": Number(summonerAvatarData.modifySummonerAvatarId) })
  chatInfo = await $api.getPlayerChatInfo()
  chatInfo.icon = summonerAvatarData.modifySummonerAvatarId
  await $api.putPlayerChatInfo(chatInfo)
  await $api.updateIcon({ "profileIconId": Number(summonerAvatarData.modifySummonerAvatarId) })
}

async function handleChangeSummonerBg() {
  const r = await $api.setBackgroundSkinId({
    key: 'backgroundSkinId',
    value: summonerBackground.curSkins,
  })
  showMessage(r, '生涯背景修改成功', '修改失败')
}

async function handleSummonerBackground(type: 'champions' | 'skins') {
  if (type === 'champions') {
    const r: any = await $api.getChampionSkinListById(summonerBackground.curChampionId)
    curChampionSkinList.value = r.skins;
    summonerBackground.skinImg =  await $api.getLcuImgBase64(r.skins[0].splashPath )
    summonerBackground.imgTitle = r.title;
    summonerBackground.imgDesc = r.shortBio;
  }
  if (type === 'skins') {
    _.forEach(curChampionSkinList.value, async (value) => {
      if (value.id === summonerBackground.curSkins) {
        const r = await $api.getLcuImgBase64(value.splashPath)
        summonerBackground.skinImg = r;
        return;
      }
    });
  }
}

/* 段位伪造以及状态修改处理 */
async function handleChange(type: string, event: any) {
  let chatInfo: any = await $api.getPlayerChatInfo()
  console.log(chatInfo);

  if (type == 'ranked') {
    chatInfo.lol.rankedLeagueDivision = 'I'
    chatInfo.lol.rankedLeagueQueue = 'RANKED_SOLO_5x5'
    chatInfo.lol.rankedLeagueTier = event
    chatInfo.lol.rankedPrevSeasonDivision = 'I'

    const res = await $api.putPlayerChatInfo(chatInfo)
    showMessage(res, `段位伪造: ${event}， 成功(国服该功能可能异常)`, `段位伪造发生异常，客户端链接可能断开`)
  } else if (type == 'status') {
    chatInfo.availability = event
    const res = await $api.putPlayerChatInfo(chatInfo)
    showMessage(res, `状态更改: ${event}， 成功`, `状态更改发生异常，客户端链接可能断开`)
  } else if (type == 'name') {
    chatInfo.name = useForm.modifySummonerName
    const res = await $api.putPlayerChatInfo(chatInfo)
    showMessage(res, `修改召唤师名称成功`, `更改发生异常，客户端链接可能断开`)
  }
};

/* 观战 */
async function handleSpectator(summonerName: string) {
  const res = $api.spectatorLaunchByName(summonerName, '[ӎϷģʽ]')
  showMessage(res, '拉起观战成功，等待客户端响应', '拉起观战发生异常，客户端未启动或对方不在召唤师峡谷地图游戏中')
}

/* 创建房间 */
async function handleCreatePracticeToolMode() {
  const res = await $api.createCustomLobby('PRACTICETOOL', 11, `Tik 英雄联盟对局助手5V5训练模式${Math.random() * 100}`)
  showMessage(res, '创建成功（国服仅支持添加机器人，不能拉好友）', '创建失败，请检查客户端是否启动')
}

async function medalHandle() {
  const r = await $api.updatePlayerPreferences({
    "challengeIds": [],
    "title": ""
  })
}

async function avatarBoxHandle() {
  const r = await $api.regalia({
        "preferredBannerType": "lastSeasonHighestRank",
        "preferredCrestType": "prestige",
        "selectedPrestigeCrest": 0
      }
  )
  showMessage(r, '取下头像框成功 （注意等级需要大于525级才能生效）', '修改失败')
}

function showMessage(res: any, successMsg: string, errMsg: string) {
  if (!res) {
    Message.error({
      content: errMsg,
      duration: 2000
    })
  } else {
    Message.success({
      content: successMsg,
      duration: 2000
    })
  }
}

</script>
<style lang="less" scoped>
.func-container {
  max-width: 980px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;

  .item-box {
    width: 100%;
    padding: 10px 20px 14px 20px;
    border-bottom: 1px solid var(--color-border-2);

    .item-box__form {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-box__form__title {
        font-size: 16px;
        font-width: 600;
        color: var(--color-text-1)
      }
    }

    .item-box__desc {
      width: 100%;
      font-size: 14px;
      margin-top: 8px;
      color: var(--color-text-2);
      display: flex;
      align-items: center;
    }
  }
}
</style>