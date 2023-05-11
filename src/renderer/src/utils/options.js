export const statusOptions = [
  {
    value: 'online',
    label: '在线',
    key: '在线',
  },
  {
    value: 'away',
    label: '离开',
  },
  {
    value: 'mobile',
    label: '手机在线',
  },
  {
    value: 'offline',
    label: '离线',
  },
]

export const rankOptions = [
  {
    value: 'none',
    label: '未定位',
  },
  {
    value: 'Iron',
    label: '坚韧黑铁',
  },
  {
    value: 'Bronze',
    label: '英勇青铜',
  },
  {
    value: 'Silver',
    label: '不屈白银',
  },
  {
    value: 'Gold',
    label: '荣耀黄金',
  },
  {
    value: 'Platinum',
    label: '华贵白金',
  },
  {
    value: 'Diamond',
    label: '璀璨钻石',
  },
  {
    value: 'Master',
    label: '超凡大师',
  },
  {
    value: 'GrandMaster',
    label: '傲视宗师',
  },
  {
    value: 'Challenger',
    label: '最强王者',
  },
]

export const environmentOption = [
  '艾欧尼亚',
  '祖安',
  '诺克萨斯',
  '班德尔城',
  '皮尔特沃夫',
  '战争学院',
  '巨神峰',
  '雷瑟守备',
  '裁决之地',
  '黑色玫瑰',
  '暗影岛',
  '钢铁烈阳 ',
  '水晶之痕',
  '均衡教派',
  '影流',
  '守望之海',
  '征服之海',
  '卡拉曼达',
  '皮城警备',
  '比尔吉沃特',
  '德玛西亚',
  '弗雷尔卓德',
  '无畏先锋',
  '恕瑞玛',
  '扭曲丛林',
  '巨龙之巢',
  '男爵领域',
]

export const championOptions = $store.gameDataStore.get('championOptions')

export const keyCodeOptions = [
  {
    label: '`',
    value: 41,
  },
  {
    label: '左 Ctrl',
    value: 29,
  },
  {
    label: '右 Ctrl',
    value: 3613,
  },
  {
    label: '左 Alt',
    value: 56,
  },
  {
    label: '右 Alt',
    value: 3640,
  },
  {
    label: 'F1',
    value: 59,
  },
  {
    label: 'F2',
    value: 60,
  },
  {
    label: 'F3',
    value: 61,
  },
  {
    label: 'F4',
    value: 62,
  },
  {
    label: 'F5',
    value: 63,
  },
  {
    label: 'F6',
    value: 64,
  },
  {
    label: 'F7',
    value: 65,
  },
  {
    label: 'F8',
    value: 66,
  },
  {
    label: 'F9',
    value: 67,
  },
  {
    label: 'F10',
    value: 68,
  },
  {
    label: 'F11',
    value: 87,
  },
  {
    label: 'F12',
    value: 88,
  },
  {
    label: 'Ins',
    value: 61010,
  },
  {
    label: 'Del',
    value: 61011,
  },
  {
    label: 'Home',
    value: 60999,
  },
  {
    label: 'End',
    value: 61007,
  },
  {
    label: 'PageUp',
    value: 61001,
  },
  {
    label: 'PageDown',
    value: 61009,
  },
  {
    label: '方向键 上',
    value: 61000,
  },
  {
    label: '方向键 下',
    value: 61008,
  },
  {
    label: '方向键 左',
    value: 61003,
  },
  {
    label: '方向键 右',
    value: 61005,
  },
]

export const vipSkinOptions = {
  Baron: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '冰雪节',
      value: '1',
    },
    {
      label: '冠军皮肤',
      value: '2',
    },
    {
      label: '新年狂欢',
      value: '3',
    },
    {
      label: 'MSI',
      value: '4',
    },
    {
      label: '奥德赛',
      value: '5',
    },
    {
      label: '冠军生日',
      value: '6',
    },
    {
      label: '破败',
      value: '6',
    },
  ],
  Minion: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '泳池派对',
      value: '1',
    },
    {
      label: '原计划',
      value: '2',
    },
    {
      label: '冰雪节',
      value: '3',
    },
    {
      label: '德莱文',
      value: '4',
    },
    {
      label: '星之守护者',
      value: '5',
    },
    {
      label: '电玩',
      value: '6',
    },
    {
      label: '冰雪节2',
      value: '7',
    },
    {
      label: '奥德赛',
      value: '8',
    },
    {
      label: '猫狗大作战',
      value: '9',
    },
  ],
  Crab: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '万圣节1',
      value: '1',
    },
    {
      label: '万圣节2',
      value: '2',
    },
    {
      label: '万圣节3',
      value: '3',
    },
  ],
  Blue: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '万圣节',
      value: '1',
    },
    {
      label: '泳池派对',
      value: '2',
    },
    {
      label: '破败',
      value: '3',
    },
  ],
  Red: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '泳池派对',
      value: '1',
    },
    {
      label: '万圣节',
      value: '2',
    },
  ],
  Razorbeak: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '愚人节',
      value: '1',
    },
  ],
  Krug: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '万圣节',
      value: '1',
    },
  ],
  Telepor: [
    {
      label: '默认',
      value: '0',
    },
    {
      label: '最强王者',
      value: '1',
    },
    {
      label: '纳什男爵',
      value: '2',
    },
  ],
}
