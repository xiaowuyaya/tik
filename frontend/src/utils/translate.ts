/* 转译配置 */
const mode = {
  status: {
    inQueue: '队列中',
    inGame: '游戏中',
    GameStart: '正在启动游戏',
    championSelect: '正在选择英雄',
    outOfGame: '正在退出游戏',
    hosting_NORMAL: '匹配组队中-队长',
    hosting_RANKED_SOLO_5x5: '单排组队中-队长',
    hosting_RANKED_FLEX_SR: '组排组队中-队长',
    hosting_ARAM_UNRANKED_5x5: '大乱斗5v5组队中-队长',
    hosting_URF: '无限火力组队中-队长',
    hosting_BOT: '人机组队中-队长',
    ChampSelect: '正在选择英雄',
    ReadyCheck: '等待接受对局',
    InProgress: '游戏中',
    Matchmaking: '正在寻找对局',
    Lobby: '在房间中',
    None: '在大厅发呆',
  },
  game: {
    CLASSIC: '经典模式',
    ARAM: '大乱斗',
    TFT: '云顶之弈',
    URF: '无限火力',
    PRACTICETOOL: '自定义',
  },
  match: {
    NORMAL: '匹配',
    RANKED_SOLO_5x5: '单双排',
    RANKED_FLEX_SR: '组排',
    ARAM_UNRANKED_5x5: '大乱斗5v5',
    URF: '无限火力',
    BOT: '人机',
    PRACTICETOOL: '自定义',
  },
  rank: {
    NONE: '无段位',
    IRON: '黑铁',
    BRONZE: '青铜',
    SILVER: '白银',
    GOLD: '黄金',
    PLATINUM: '白金',
    DIAMOND: '钻石',
    MASTER: '大师',
    GRANDMASTER: '宗师',
    CHALLENGER: '王者',
  },
  // opgg position
  opggPosition: {
    TOP: "上单",
    JUNGLE: "打野",
    MID: "中单",
    ADC: 'ad',
    SUPPORT: "辅助",
  },

  panelPosition: {
    TOP: "上单",
    JUNGLE: "打野",
    MIDDLE: "中单",
    BOTTOM: 'ADC',
    UTILITY: "辅助",
  }
};

export const translate = (type: string, key: string) => {
  const config = mode[type];
  return config[key];
};
