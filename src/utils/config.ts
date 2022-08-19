import Store from 'electron-store'

export const appConfig = new Store({
  defaults: {
    /* 自动接收对局 */
    autoAccept: true,
    /* 自动确定英雄 */
    confirmSelect: true,
    /* 自动禁言所有人 */
    autoMuteAll: false,
    /* 一般自动禁选 */
    normalAutoPB: {
      enablePick: false,
      pickSelect: [],
      enableBan: false,
      banSelect: []
    },
    /* 排位自动禁选 */
    rankAutoBP: {
      pick: {
        enable: false,
        top: [],
        jungle: [],
        middle: [],
        bottom: [],
        utility: [],
      },
      ban: {
        enable: false,
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
    matchCount: 5,
    /* 黑名单提醒对所有人 */
    blacklistNoticeAll: false,
    typeTitle: ['老大', '老二', '老三', '老四', '老六'],
    /* 快捷键相关 */
    keys: {
      order: [],
      chaos: [],
      muteAll: [],
    }
  }
})