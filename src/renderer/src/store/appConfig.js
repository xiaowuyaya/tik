import { defineStore } from 'pinia'

export const useAppConfigStore = defineStore({
  id: 'appConfig',
  state: () => {
    return {
      close: {
        type: 0, // 0-退出程序  1-最小化
        remember: false,
      },
      autoTheme: true, // 自适应主题
      autoUseRune: false, // 自动应用符文
      onlyRankData: false, // 仅排位数据
      sendCoPlayer: true, // 发送组排信息
      sendPlayerLevelInfo: {
        enable: true, // 启用发送马匹信息
        title: ['老大', '老二', '老三', '老四', '老六'],
        template: '{称号}:{玩家名},kda:{kda},胜率:{胜率},近期:{对局}', // 战绩发送模板
        matchNum: 3, // 发送到KDA数量
      },
      blacklistNotice: false, // 黑名单提醒对所有人
      champToolWin: {
        enable: true, // 显示英雄工具小窗口
        flowGameWin: true, // 跟随游戏窗口
      },
      autoMatchingGame: {
        enable: false, // 自动匹配对局
        position: ['MIDDLE', 'FILL'],
      },
      autoAccept: {
        enable: true, // 自动接受对局
        delay: 3, // 延迟 秒
      },
      autoMute: false, // 开局禁言
      autoBanPick: {
        confirmSelect: true, // 自动确定英雄
        pick: {
          enable: false,
          normal: [],
          top: [],
          jungle: [],
          middle: [],
          bottom: [],
          utility: [],
        },
        ban: {
          enable: false,
          normal: [],
          top: [],
          jungle: [],
          middle: [],
          bottom: [],
          utility: [],
        },
      },
      /* 快捷键相关 */
      keys: {
        order: [61001],
        chaos: [61009],
        mute: [60999],
      },
    }
  },
  getters: {},
  actions: {
    init() {
      this.$state = $store.appConfigStore.store
    },
    syncLocal() {
      $store.appConfigStore.set(this.$state)
    },
  },
})
