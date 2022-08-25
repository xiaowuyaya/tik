import { Message } from "@arco-design/web-vue";
import { defineStore } from "pinia";

const appStore = window.appStore

interface ConfigType {
  quitMethod: number | undefined
  autoAccept: boolean | undefined
  showChampTool: boolean | undefined
  confirmSelect: boolean | undefined
  autoMuteAll: boolean | undefined
  spellsWin: {
    enable: boolean | undefined
    key: number[] | undefined
  },
  normalAutoPB: {
    enablePick: boolean | undefined
    pickSelect: number[] | undefined
    enableBan: boolean | undefined
    banSelect: number[] | undefined
  },
  rankAutoBP: {
    pick: {
      enable: boolean | undefined
      top: number[] | undefined
      jungle: number[] | undefined
      middle: number[] | undefined
      bottom: number[] | undefined
      utility: number[] | undefined
    },
    ban: {
      enable: boolean | undefined
      top: number[] | undefined
      jungle: number[] | undefined
      middle: number[] | undefined
      bottom: number[] | undefined
      utility: number[] | undefined
    },
  },
  enableSendHourse: boolean | undefined
  onlyRankData: boolean | undefined
  matchCount: number | undefined
  blacklistNoticeAll: boolean | undefined
  typeTitle: [string,string,string,string,string] ,
  keys: {
    order: number[] | undefined
    chaos: number[] | undefined
    muteAll: number[] | undefined
  }
}

export const useConfigStore = defineStore({
  id: 'config',
  state: (): ConfigType => {
    return {
      quitMethod: undefined,
      autoAccept: undefined,
      showChampTool: undefined,
      confirmSelect: undefined,
      autoMuteAll: undefined,
      spellsWin: {
        enable: undefined,
        key: undefined,
      },
      normalAutoPB: {
        enablePick: undefined,
        pickSelect: undefined,
        enableBan: undefined,
        banSelect: undefined,
      },
      rankAutoBP: {
        pick: {
          enable: undefined,
          top: undefined,
          jungle: undefined,
          middle: undefined,
          bottom: undefined,
          utility: undefined,
        },
        ban: {
          enable: undefined,
          top: undefined,
          jungle: undefined,
          middle: undefined,
          bottom: undefined,
          utility: undefined,
        },
      },
      enableSendHourse: undefined,
      onlyRankData: undefined,
      matchCount: undefined,
      blacklistNoticeAll: undefined,
      typeTitle: ["","","","",""],
      keys: {
        order: undefined,
        chaos: undefined,
        muteAll: undefined,
      }
    }
  },
  actions: {
    init() {
      this.quitMethod = appStore.get('quitMethod')
      this.autoAccept = appStore.get('autoAccept')
      this.confirmSelect = appStore.get('confirmSelect')
      this.showChampTool = appStore.get('showChampTool')
      this.autoMuteAll = appStore.get('autoMuteAll')
      this.spellsWin.enable = appStore.get('spellsWin.enable')
      this.spellsWin.key = appStore.get('spellsWin.key')
      this.normalAutoPB.enablePick = appStore.get('normalAutoPB.enablePick')
      this.normalAutoPB.pickSelect = appStore.get('normalAutoPB.pickSelect')
      this.normalAutoPB.enableBan = appStore.get('normalAutoPB.enableBan')
      this.normalAutoPB.banSelect = appStore.get('normalAutoPB.banSelect')
      this.rankAutoBP.pick.enable = appStore.get('rankAutoBP.pick.enable')
      this.rankAutoBP.pick.top = appStore.get('rankAutoBP.pick.top')
      this.rankAutoBP.pick.jungle = appStore.get('rankAutoBP.pick.jungle')
      this.rankAutoBP.pick.middle = appStore.get('rankAutoBP.pick.middle')
      this.rankAutoBP.pick.bottom = appStore.get('rankAutoBP.pick.bottom')
      this.rankAutoBP.pick.utility = appStore.get('rankAutoBP.pick.utility')
      this.rankAutoBP.ban.enable = appStore.get('rankAutoBP.ban.enable')
      this.rankAutoBP.ban.top = appStore.get('rankAutoBP.ban.top')
      this.rankAutoBP.ban.jungle = appStore.get('rankAutoBP.ban.jungle')
      this.rankAutoBP.ban.middle = appStore.get('rankAutoBP.ban.middle')
      this.rankAutoBP.ban.bottom = appStore.get('rankAutoBP.ban.bottom')
      this.rankAutoBP.ban.utility = appStore.get('rankAutoBP.ban.utility')
      this.enableSendHourse = appStore.get('enableSendHourse')
      this.onlyRankData = appStore.get('onlyRankData')
      this.matchCount = appStore.get('matchCount')
      this.blacklistNoticeAll = appStore.get('blacklistNoticeAll')
      this.typeTitle = appStore.get('typeTitle')
      this.keys.order = appStore.get('keys.order')
      this.keys.chaos = appStore.get('keys.chaos')
      this.keys.muteAll = appStore.get('keys.muteAll')
    },
    changeConfig() {
      appStore.set(this.$state)
      
    }
  }
})