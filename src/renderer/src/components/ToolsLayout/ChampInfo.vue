<script setup>
import { useAppConfigStore } from '../../store/appConfig'
import { onMounted, reactive } from 'vue'
import { champsDetail, getChampInfo } from '../../api/champ'
import { tierList } from '../../assets/image/tier'
import { DArrowRight, Select } from '@element-plus/icons-vue'

const appConfigStore = useAppConfigStore()
const utils = $utils
const ROLE_CONSTS = $store.gameDataStore.get('constant.role')
const positionIcon = {
  adc: 'https://s-lol-web.op.gg/images/icon/icon-position-bot-dark.svg',
  jungle: 'https://s-lol-web.op.gg/images/icon/icon-position-jng-dark.svg',
  mid: 'https://s-lol-web.op.gg/images/icon/icon-position-mid-dark.svg',
  support: 'https://s-lol-web.op.gg/images/icon/icon-position-sup-dark.svg',
  top: 'https://s-lol-web.op.gg/images/icon/icon-position-top-dark.svg',
}
const stateData = reactive({
  showRunesDrawer: false,
  selectChamp: null,
  champInfo: {
    curPosition: '',
    summary: {
      average_stats: {
        ban_rate: 0,
        tier: 0,
        pick_rate: 0,
        kda: 0,
        rank: 0,
        win_rate: 0,
      },
      positions: [],
      roles: [],
    },
    summoner_spells: [],
    core_items: [],
    last_items: [],
    mythic_items: [],
    runes: [{ primary_rune_ids: [], secondary_rune_ids: [], stat_mod_ids: [], primary_page_id: 0 }],
    skill_masteries: [{ ids: [], pick_rate: 0 }],
    spellInfo: { q: { icon: '' }, w: { icon: '' }, e: { icon: '' }, r: { icon: '' } },
  },
})

window.electron.ipcRenderer.removeAllListeners('tool-select-champ')
window.electron.ipcRenderer.on('tool-select-champ', async (event, data) => {
  stateData.selectChamp = data
  await handleChampInfo(data)
})

/* 自动应用符文 */
window.electron.ipcRenderer.removeAllListeners('tool-confirm-champ')
window.electron.ipcRenderer.on('tool-confirm-champ', async (event, data) => {
  if (!appConfigStore.autoUseRune) return
  stateData.selectChamp = data
  handleChampInfo(data).then(() => {
    useSelectRune(stateData.champInfo.runes[0])
  })
})

async function handleChampInfo(champId) {
  if (champId == 0) return

  function getGameModeByQueue(queue) {
    if (queue == 420 || queue == 430 || queue == 440) return 'rank'
    if (queue == 450) return 'aram'
    if (queue == 900 || queue == 1010 || queue == 1900) return 'urf'
    return 'rank'
  }

  stateData.selectChamp = champId
  const queueId = await $api.getCurrentGameMode()
  const res = await champsDetail(getGameModeByQueue(queueId), champId)
  const { champ, position } = res
  stateData.champInfo = champ
  stateData.champInfo.curPosition = position
  stateData.champInfo.avatar = $utils.getChampionAvatarById(champId)
  stateData.champInfo.name = $utils.getChampionById(champId).name
  stateData.champInfo.title = $utils.getChampionById(champId).title
  const champInfo = await getChampInfo(champId)
  let spell = {}
  champInfo.spells.forEach(item => {
    spell[item.spellKey] = {
      icon: item.abilityIconPath,
      name: item.name,
      description: item.description,
      spellKey: item.spellKey,
    }
  })
  stateData.champInfo.spellInfo = spell
}

async function useSelectRune(runeItem) {
  const perkIds = runeItem.primary_rune_ids.concat(runeItem.secondary_rune_ids).concat(runeItem.stat_mod_ids)
  const data = {
    name: `${$constant.APP_NAME}：${stateData.champInfo.name} `,
    order: runeItem.id,
    primaryStyleId: runeItem.primary_page_id,
    subStyleId: runeItem.secondary_page_id,
    selectedPerkIds: perkIds,
  }
  // 获取所有符文
  const RunesPage = await $api.getAllRunePage()
  // 删除最近的一个符文
  await $api.delRunePage(RunesPage[0].id)
  // 应用符文
  await $api.postRunePage(data)
  await $api.sendMsgInChampSelect('SELF', `${$constant.APP_NAME}：${stateData.champInfo.name} 符文已应用！`)
}

onMounted(async () => {
  // 大乱斗 无限火力适配
  setTimeout(async () => {
    const currentChampId = await $api.getCurrentChampion()
    stateData.selectChamp = currentChampId
    await handleChampInfo(currentChampId)
  }, 800)
})
</script>
<template>
  <div v-if="!stateData.selectChamp" class="w-full flex flex-col items-center justify-center">
    <img class="w-[128px]" src="../../assets/image/model/emote_gizmos.png" alt="" />
    <div class="!mt-6">正在获取当前选择的英雄数据...</div>
  </div>
  <div v-if="stateData.selectChamp" class="!h-[90vh] w-full">
    <!--              champ_info-->
    <div class="flex px-2" v-show="stateData.champInfo">
      <el-avatar :size="68" shape="square" :src="stateData.champInfo.avatar" />
      <div class="flex flex-col ml-4">
        <div>
          <span class="text-[22px] font-semibold">{{ stateData.champInfo.name }}</span>
          <span class="ml-2 text-[16px]">{{ stateData.champInfo.title }}</span>
          <span class="ml-2 text-[var(--el-text-color-regular)]">Build for {{ stateData.champInfo.curPosition }}</span>
        </div>
        <div class="flex items-center">
          <img class="w-[28px]" :src="tierList[stateData.champInfo.summary.average_stats.tier]" alt="" />
          <img v-for="(item, idx) in stateData.champInfo.summary.positions" :key="idx" class="w-[32px] mx-2" :src="positionIcon[item.name.toLowerCase()]" alt="" />
          <el-tag class="ml-2" v-for="(item, idx) in stateData.champInfo.summary.roles.slice(0, 2)" :key="idx">
            <span> {{ ROLE_CONSTS[item.name] }}</span>
          </el-tag>
        </div>
      </div>
    </div>
    <el-card shadow="never" class="!w-full !mt-3" :body-style="{ padding: '8px' }">
      <h1 class="font-semibold mb-2">应用设置</h1>
      <div class="flex font-bold justify-between items-center">
        <div class="flex" v-if="stateData.champInfo.spellInfo">
          <div class="flex items-center" v-for="(item, idx) in stateData.champInfo.skill_masteries[0].ids">
            <img class="w-10 mr-1" :src="stateData.champInfo.spellInfo[item.toLowerCase()].icon" alt="" />
            <el-icon v-if="idx != 2" class="mx-1">
              <DArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="text-[14px] text-[var(--el-color-primary)]">{{ (stateData.champInfo.skill_masteries[0].pick_rate * 100).toFixed(2) }}%</div>
      </div>
    </el-card>
    <el-card shadow="never" class="!w-full !mt-3" :body-style="{ padding: '8px' }">
      <h1 class="font-semibold mb-2">召唤师技能</h1>
      <div
        class="flex font-bold justify-between items-center"
        :class="idx == 1 ? '' : ' border-b border-gray-200 dark:border-[var(--el-border-color)] mb-1.5 pb-1.5'"
        v-for="(item, idx) in stateData.champInfo.summoner_spells.slice(0, 2)"
        :key="idx"
      >
        <div class="flex">
          <img class="w-10 mr-1" v-for="(spellId, sidx) in item.ids" :key="sidx" :src="utils.getSpellInfoById(spellId).img" alt="" />
        </div>
        <div class="flex flex-col justify-center items-center">
          <span class="">{{ ((item.win / item.play) * 100).toFixed(2) }}%</span>
          <span class="text-[var(--el-text-color-regular)] text-[13px]">{{ item.play }} 场对局</span>
        </div>
        <div class="text-[14px] text-[var(--el-color-primary)]">{{ (item.pick_rate * 100).toFixed(2) }}%</div>
      </div>
    </el-card>
    <el-card shadow="never" class="!w-full !mt-3" :body-style="{ padding: '8px' }">
      <h1 class="font-semibold mb-2">核心装备</h1>
      <div
        class="flex font-bold justify-between items-center"
        :class="idx == 1 ? '' : 'border-b border-gray-200 dark:border-[var(--el-border-color)] mb-1.5 pb-1.5'"
        v-for="(item, idx) in stateData.champInfo.mythic_items.slice(0, 2)"
        :key="idx"
      >
        <div class="flex">
          <img class="w-10 mr-1" v-for="(idItem, itemIdx) in item.builds[0].ids" :key="itemIdx" :src="utils.getItemsImgById(idItem)" alt="" />
        </div>
        <div class="flex flex-col justify-center items-center">
          <span class="">{{ ((item.builds[0].win / item.builds[0].play) * 100).toFixed(2) }}%</span>
          <span class="text-[14px] text-[var(--el-color-primary)]">{{ item.builds[0].play }} 场对局</span>
        </div>
        <div class="text-[14px] text-[var(--el-color-primary)]">{{ (item.builds[0].pick_rate * 100).toFixed(2) }}%</div>
      </div>
    </el-card>
    <el-card shadow="never" class="!w-full !mt-3" :body-style="{ padding: '8px' }">
      <div class="w-full flex items-center justify-between">
        <h3 class="font-semibold mb-2">符文</h3>
        <a href="javascript:;" class="text-[var(--el-text-color-regular)] text-sm" @click="stateData.showRunesDrawer = true">查看更多</a>
      </div>
      <div class="flex font-bold justify-between items-center">
        <el-tooltip placement="top-start">
          <template #content>
            <div class="flex">
              <img class="w-8 h-8 mr-3" v-for="(perkItem, perkIdx) in stateData.champInfo.runes[0].primary_rune_ids" :key="perkIdx" :src="utils.getPerkInfoById(perkItem).icon" />
            </div>
            <div class="flex mt-1">
              <img class="w-8 h-8 mr-2" v-for="(perkItem, perkIdx) in stateData.champInfo.runes[0].secondary_rune_ids" :key="perkIdx" :src="utils.getPerkInfoById(perkItem).icon" />
              <div class="flex items-center"><img class="w-6 h-6 mx-1" v-for="(perkItem, perkIdx) in stateData.champInfo.runes[0].stat_mod_ids" :key="perkIdx" :src="utils.getPerkInfoById(perkItem).icon" /></div>
            </div>
          </template>
          <div class="flex py-1 items-end">
            <img class="w-[40px]" :src="utils.getPerkInfoById(stateData.champInfo.runes[0].primary_page_id).icon" alt="" />
            <img class="w-[30px] h-[30px]" :src="utils.getPerkInfoById(stateData.champInfo.runes[0].secondary_page_id).icon" alt="" />
          </div>
        </el-tooltip>

        <div class="text-[14px] text-[var(--el-color-primary)]">{{ (stateData.champInfo.runes[0].pick_rate * 100).toFixed(2) }}%</div>
        <el-button type="primary" :icon="Select" size="small" @click="useSelectRune(stateData.champInfo.runes[0])">应用</el-button>
      </div>
    </el-card>

    <el-drawer v-model="stateData.showRunesDrawer" direction="btt" size="80%" :lock-scroll="false" :with-header="false" append-to-body>
      <el-card shadow="never" class="!w-full !mt-3" :body-style="{ padding: '8px' }" v-for="(runeItem, runeIdx) in stateData.champInfo.runes" :key="runeIdx">
        <div class="flex justify-between mb-1">
          <span class="font-semibold text-[#529b2e]">胜率: {{ (runeItem.pick_rate * 100).toFixed(2) }}% </span>
          <span class="font-semibold text-[#b88230]">选取率: {{ ((runeItem.win / runeItem.play) * 100).toFixed(2) }}% </span>
          <span class="font-semibold text-[#909399]">{{ runeItem.play }} 场</span>
        </div>
        <div class="flex font-bold justify-between items-center">
          <el-tooltip placement="top-start">
            <template #content>
              <div class="flex">
                <img class="w-8 h-8 mr-3" v-for="(perkItem, perkIdx) in runeItem.primary_rune_ids" :key="perkIdx" :src="utils.getPerkInfoById(perkItem).icon" />
              </div>
              <div class="flex mt-1">
                <img class="w-8 h-8 mr-2" v-for="(perkItem, perkIdx) in runeItem.secondary_rune_ids" :key="perkIdx" :src="utils.getPerkInfoById(perkItem).icon" />
                <div class="flex items-center"><img class="w-6 h-6 mx-1" v-for="(perkItem, perkIdx) in runeItem.stat_mod_ids" :key="perkIdx" :src="utils.getPerkInfoById(perkItem).icon" /></div>
              </div>
            </template>
            <div class="flex py-1 items-end">
              <img class="w-[40px]" :src="utils.getPerkInfoById(runeItem.primary_page_id).icon" alt="" />
              <img class="w-[30px] h-[30px]" :src="utils.getPerkInfoById(runeItem.secondary_page_id).icon" alt="" />
            </div>
          </el-tooltip>

          <div class="text-[14px] text-[var(--el-color-primary)]">{{ (runeItem.pick_rate * 100).toFixed(2) }}%</div>
          <el-button type="primary" :icon="Select" size="small" @click="useSelectRune(runeItem)">应用</el-button>
        </div>
      </el-card>
    </el-drawer>
  </div>
</template>
<style lang="less" scoped>
.el-card {
  background: none;
}
</style>
