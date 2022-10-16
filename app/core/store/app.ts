import Store from 'electron-store'

/**
 * 应用程序配置
 */
export const appStore = new Store({
  defaults: {
    app: {
      /* 记住退出方式 */
      rememberQuit: false,
      /* 退出设置 */
      quitMethod: 0, // 0: 退出 1: 隐藏
      /* 启用发送组排信息 */
      sendTogetherGame: true,
      /* 客户端相关 */
      gameClient: {
        gameClientFilePath: '', // 客户端启动程序路径
        gameType: 0, // 0: 正式服， 1: 测试服
      },
      /* 显示符文小窗 */
      showChampTool: '',
      /* 自动接收对局 */
      autoAccept: {
        enable: true,
        delay: 3
      },
      /* 自动确定英雄 */
      confirmSelect: true,
      /* 自动禁言所有人 */
      autoMuteAll: false,
      /* 技能提醒窗口 */
      spellsWin: {
        enable: true,
        key: [],
      },
      /* 排位自动禁选 */
      autoBP: {
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
      /* 启用马匹信息 */
      enableSendHourse: true,
      /* 仅排位数据 */
      onlyRankData: false,
      /* 发送到KD数量 */
      matchCount: 3,
      /* 黑名单提醒对所有人 */
      blacklistNoticeAll: false,
      typeTitle: ['老大', '老二', '老三', '老四', '老六'],
      /* 快捷键相关 */
      keys: {
        order: [61001],
        chaos: [61009],
        muteAll: [60999],
      },
    },
  }
})