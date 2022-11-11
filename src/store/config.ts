import { defineStore } from 'pinia';

interface ConfigType {
  "rememberQuit": boolean,
  "quitMethod": number | string,
  "sendTogetherGame": boolean,
  "autoTheme": boolean,
  "gameClient": {
    "gameClientFilePath": string,
    "gameType": number
  },
  "showChampTool": string,
  "autoAccept": {
    "enable": boolean,
    "delay": number
  },
  "confirmSelect": boolean,
  "autoMuteAll": boolean,
  "spellsWin": {
    "enable": boolean,
    "key": number[]
  },
  autoBP: {
    pick: {
      enable: boolean,
      normal: number[]
      top: number[]
      jungle: number[]
      middle: number[]
      bottom: number[]
      utility: number[]
    },
    ban: {
      enable: boolean,
      normal: number[]
      top: number[]
      jungle: number[]
      middle: number[]
      bottom: number[]
      utility: number[]
    },
  },
  "enableSendHourse": boolean,
  "sendTextTemplate": string,
  "onlyRankData": boolean,
  "matchCount": number,
  "blacklistNoticeAll": boolean,
  "typeTitle": string[],
  "keys": {
    "order": number[],
    "chaos": number[],
    "muteAll": number[]
  }
}

export const useConfigStore = defineStore({
  id: 'config',
  state: (): ConfigType => {
    return {
      "rememberQuit": false,
      "quitMethod": 0,
      "autoTheme": true,
      "sendTogetherGame": false,
      "gameClient": {
        "gameClientFilePath": "",
        "gameType": 0
      },
      "showChampTool": "",
      "autoAccept": {
        "enable": false,
        "delay": 0
      },
      "confirmSelect": false,
      "autoMuteAll": false,
      "spellsWin": {
        "enable": false,
        "key": []
      },
      "autoBP": {
        "pick": {
          "enable": false,
          "normal": [],
          "top": [],
          "jungle": [],
          "middle": [],
          "bottom": [],
          "utility": []
        },
        "ban": {
          "enable": false,
          "normal": [],
          "top": [],
          "jungle": [],
          "middle": [],
          "bottom": [],
          "utility": []
        }
      },
      "enableSendHourse": false,
      "sendTextTemplate": "",
      "onlyRankData": false,
      "matchCount": 0,
      "blacklistNoticeAll": false,
      "typeTitle": [
      ],
      "keys": {
        "order": [
        ],
        "chaos": [
        ],
        "muteAll": [
        ]
      }
    }
  },
  actions: {
    init() {
      this.$state = $store.appStore.get('app')
    },
    save() {
      $store.appStore.set('app', this.$state)
    },
    set(key: string, data: any){
      $store.appStore.set(key, data)
    }
  }
})