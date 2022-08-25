import Store from 'electron-store'

export const appConfig = new Store({
  defaults: {
    /* lcu链接凭证 */
    credentials: '',
    quitMethod: 0,
    /* 显示符文小窗 */
    showChampTool: '',
    /* 自动接收对局 */
    autoAccept: true,
    /* 自动确定英雄 */
    confirmSelect: true,
    /* 自动禁言所有人 */
    autoMuteAll: false,
    /* 技能提醒窗口 */
    spellsWin: {
      enable: true,
      key: []
    },
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

export const ddragonConfig = new Store({
  defaults: {
    champions: {
      "暗裔剑魔": {
        "championId": "266",
        "enName": "Aatrox"
      },
      "九尾妖狐": {
        "championId": "103",
        "enName": "Ahri"
      },
      "离群之刺": {
        "championId": "84",
        "enName": "Akali"
      },
      "影哨": {
        "championId": "166",
        "enName": "Akshan"
      },
      "牛头酋长": {
        "championId": "12",
        "enName": "Alistar"
      },
      "殇之木乃伊": {
        "championId": "32",
        "enName": "Amumu"
      },
      "冰晶凤凰": {
        "championId": "34",
        "enName": "Anivia"
      },
      "黑暗之女": {
        "championId": "1",
        "enName": "Annie"
      },
      "残月之肃": {
        "championId": "523",
        "enName": "Aphelios"
      },
      "寒冰射手": {
        "championId": "22",
        "enName": "Ashe"
      },
      "铸星龙王": {
        "championId": "136",
        "enName": "AurelionSol"
      },
      "沙漠皇帝": {
        "championId": "268",
        "enName": "Azir"
      },
      "星界游神": {
        "championId": "432",
        "enName": "Bard"
      },
      "虚空女皇": {
        "championId": "200",
        "enName": "Belveth"
      },
      "蒸汽机器人": {
        "championId": "53",
        "enName": "Blitzcrank"
      },
      "复仇焰魂": {
        "championId": "63",
        "enName": "Brand"
      },
      "弗雷尔卓德之心": {
        "championId": "201",
        "enName": "Braum"
      },
      "皮城女警": {
        "championId": "51",
        "enName": "Caitlyn"
      },
      "青钢影": {
        "championId": "164",
        "enName": "Camille"
      },
      "魔蛇之拥": {
        "championId": "69",
        "enName": "Cassiopeia"
      },
      "虚空恐惧": {
        "championId": "31",
        "enName": "Chogath"
      },
      "英勇投弹手": {
        "championId": "42",
        "enName": "Corki"
      },
      "诺克萨斯之手": {
        "championId": "122",
        "enName": "Darius"
      },
      "皎月女神": {
        "championId": "131",
        "enName": "Diana"
      },
      "荣耀行刑官": {
        "championId": "119",
        "enName": "Draven"
      },
      "祖安狂人": {
        "championId": "36",
        "enName": "DrMundo"
      },
      "时间刺客": {
        "championId": "245",
        "enName": "Ekko"
      },
      "蜘蛛女皇": {
        "championId": "60",
        "enName": "Elise"
      },
      "痛苦之拥": {
        "championId": "28",
        "enName": "Evelynn"
      },
      "探险家": {
        "championId": "81",
        "enName": "Ezreal"
      },
      "远古恐惧": {
        "championId": "9",
        "enName": "Fiddlesticks"
      },
      "无双剑姬": {
        "championId": "114",
        "enName": "Fiora"
      },
      "潮汐海灵": {
        "championId": "105",
        "enName": "Fizz"
      },
      "正义巨像": {
        "championId": "3",
        "enName": "Galio"
      },
      "海洋之灾": {
        "championId": "41",
        "enName": "Gangplank"
      },
      "德玛西亚之力": {
        "championId": "86",
        "enName": "Garen"
      },
      "迷失之牙": {
        "championId": "150",
        "enName": "Gnar"
      },
      "酒桶": {
        "championId": "79",
        "enName": "Gragas"
      },
      "法外狂徒": {
        "championId": "104",
        "enName": "Graves"
      },
      "灵罗娃娃": {
        "championId": "887",
        "enName": "Gwen"
      },
      "战争之影": {
        "championId": "120",
        "enName": "Hecarim"
      },
      "大发明家": {
        "championId": "74",
        "enName": "Heimerdinger"
      },
      "海兽祭司": {
        "championId": "420",
        "enName": "Illaoi"
      },
      "刀锋舞者": {
        "championId": "39",
        "enName": "Irelia"
      },
      "翠神": {
        "championId": "427",
        "enName": "Ivern"
      },
      "风暴之怒": {
        "championId": "40",
        "enName": "Janna"
      },
      "德玛西亚皇子": {
        "championId": "59",
        "enName": "JarvanIV"
      },
      "武器大师": {
        "championId": "24",
        "enName": "Jax"
      },
      "未来守护者": {
        "championId": "126",
        "enName": "Jayce"
      },
      "戏命师": {
        "championId": "202",
        "enName": "Jhin"
      },
      "暴走萝莉": {
        "championId": "222",
        "enName": "Jinx"
      },
      "虚空之女": {
        "championId": "145",
        "enName": "Kaisa"
      },
      "复仇之矛": {
        "championId": "429",
        "enName": "Kalista"
      },
      "天启者": {
        "championId": "43",
        "enName": "Karma"
      },
      "死亡颂唱者": {
        "championId": "30",
        "enName": "Karthus"
      },
      "虚空行者": {
        "championId": "38",
        "enName": "Kassadin"
      },
      "不祥之刃": {
        "championId": "55",
        "enName": "Katarina"
      },
      "正义天使": {
        "championId": "10",
        "enName": "Kayle"
      },
      "影流之镰": {
        "championId": "141",
        "enName": "Kayn"
      },
      "狂暴之心": {
        "championId": "85",
        "enName": "Kennen"
      },
      "虚空掠夺者": {
        "championId": "121",
        "enName": "Khazix"
      },
      "永猎双子": {
        "championId": "203",
        "enName": "Kindred"
      },
      "暴怒骑士": {
        "championId": "240",
        "enName": "Kled"
      },
      "深渊巨口": {
        "championId": "96",
        "enName": "KogMaw"
      },
      "诡术妖姬": {
        "championId": "7",
        "enName": "Leblanc"
      },
      "盲僧": {
        "championId": "64",
        "enName": "LeeSin"
      },
      "曙光女神": {
        "championId": "89",
        "enName": "Leona"
      },
      "含羞蓓蕾": {
        "championId": "876",
        "enName": "Lillia"
      },
      "冰霜女巫": {
        "championId": "127",
        "enName": "Lissandra"
      },
      "圣枪游侠": {
        "championId": "236",
        "enName": "Lucian"
      },
      "仙灵女巫": {
        "championId": "117",
        "enName": "Lulu"
      },
      "光辉女郎": {
        "championId": "99",
        "enName": "Lux"
      },
      "熔岩巨兽": {
        "championId": "54",
        "enName": "Malphite"
      },
      "虚空先知": {
        "championId": "90",
        "enName": "Malzahar"
      },
      "扭曲树精": {
        "championId": "57",
        "enName": "Maokai"
      },
      "无极剑圣": {
        "championId": "11",
        "enName": "MasterYi"
      },
      "赏金猎人": {
        "championId": "21",
        "enName": "MissFortune"
      },
      "齐天大圣": {
        "championId": "62",
        "enName": "MonkeyKing"
      },
      "铁铠冥魂": {
        "championId": "82",
        "enName": "Mordekaiser"
      },
      "堕落天使": {
        "championId": "25",
        "enName": "Morgana"
      },
      "唤潮鲛姬": {
        "championId": "267",
        "enName": "Nami"
      },
      "沙漠死神": {
        "championId": "75",
        "enName": "Nasus"
      },
      "深海泰坦": {
        "championId": "111",
        "enName": "Nautilus"
      },
      "万花通灵": {
        "championId": "518",
        "enName": "Neeko"
      },
      "狂野女猎手": {
        "championId": "76",
        "enName": "Nidalee"
      },
      "不羁之悦": {
        "championId": "895",
        "enName": "Nilah"
      },
      "永恒梦魇": {
        "championId": "56",
        "enName": "Nocturne"
      },
      "雪原双子": {
        "championId": "20",
        "enName": "Nunu"
      },
      "狂战士": {
        "championId": "2",
        "enName": "Olaf"
      },
      "发条魔灵": {
        "championId": "61",
        "enName": "Orianna"
      },
      "山隐之焰": {
        "championId": "516",
        "enName": "Ornn"
      },
      "不屈之枪": {
        "championId": "80",
        "enName": "Pantheon"
      },
      "圣锤之毅": {
        "championId": "78",
        "enName": "Poppy"
      },
      "血港鬼影": {
        "championId": "555",
        "enName": "Pyke"
      },
      "元素女皇": {
        "championId": "246",
        "enName": "Qiyana"
      },
      "德玛西亚之翼": {
        "championId": "133",
        "enName": "Quinn"
      },
      "幻翎": {
        "championId": "497",
        "enName": "Rakan"
      },
      "披甲龙龟": {
        "championId": "33",
        "enName": "Rammus"
      },
      "虚空遁地兽": {
        "championId": "421",
        "enName": "RekSai"
      },
      "镕铁少女": {
        "championId": "526",
        "enName": "Rell"
      },
      "炼金男爵": {
        "championId": "888",
        "enName": "Renata"
      },
      "荒漠屠夫": {
        "championId": "58",
        "enName": "Renekton"
      },
      "傲之追猎者": {
        "championId": "107",
        "enName": "Rengar"
      },
      "放逐之刃": {
        "championId": "92",
        "enName": "Riven"
      },
      "机械公敌": {
        "championId": "68",
        "enName": "Rumble"
      },
      "符文法师": {
        "championId": "13",
        "enName": "Ryze"
      },
      "沙漠玫瑰": {
        "championId": "360",
        "enName": "Samira"
      },
      "北地之怒": {
        "championId": "113",
        "enName": "Sejuani"
      },
      "涤魂圣枪": {
        "championId": "235",
        "enName": "Senna"
      },
      "星籁歌姬": {
        "championId": "147",
        "enName": "Seraphine"
      },
      "腕豪": {
        "championId": "875",
        "enName": "Sett"
      },
      "恶魔小丑": {
        "championId": "35",
        "enName": "Shaco"
      },
      "暮光之眼": {
        "championId": "98",
        "enName": "Shen"
      },
      "龙血武姬": {
        "championId": "102",
        "enName": "Shyvana"
      },
      "炼金术士": {
        "championId": "27",
        "enName": "Singed"
      },
      "亡灵战神": {
        "championId": "14",
        "enName": "Sion"
      },
      "战争女神": {
        "championId": "15",
        "enName": "Sivir"
      },
      "水晶先锋": {
        "championId": "72",
        "enName": "Skarner"
      },
      "琴瑟仙女": {
        "championId": "37",
        "enName": "Sona"
      },
      "众星之子": {
        "championId": "16",
        "enName": "Soraka"
      },
      "诺克萨斯统领": {
        "championId": "50",
        "enName": "Swain"
      },
      "解脱者": {
        "championId": "517",
        "enName": "Sylas"
      },
      "暗黑元首": {
        "championId": "134",
        "enName": "Syndra"
      },
      "河流之王": {
        "championId": "223",
        "enName": "TahmKench"
      },
      "岩雀": {
        "championId": "163",
        "enName": "Taliyah"
      },
      "刀锋之影": {
        "championId": "91",
        "enName": "Talon"
      },
      "瓦洛兰之盾": {
        "championId": "44",
        "enName": "Taric"
      },
      "迅捷斥候": {
        "championId": "17",
        "enName": "Teemo"
      },
      "魂锁典狱长": {
        "championId": "412",
        "enName": "Thresh"
      },
      "麦林炮手": {
        "championId": "18",
        "enName": "Tristana"
      },
      "巨魔之王": {
        "championId": "48",
        "enName": "Trundle"
      },
      "蛮族之王": {
        "championId": "23",
        "enName": "Tryndamere"
      },
      "卡牌大师": {
        "championId": "4",
        "enName": "TwistedFate"
      },
      "瘟疫之源": {
        "championId": "29",
        "enName": "Twitch"
      },
      "兽灵行者": {
        "championId": "77",
        "enName": "Udyr"
      },
      "无畏战车": {
        "championId": "6",
        "enName": "Urgot"
      },
      "惩戒之箭": {
        "championId": "110",
        "enName": "Varus"
      },
      "暗夜猎手": {
        "championId": "67",
        "enName": "Vayne"
      },
      "邪恶小法师": {
        "championId": "45",
        "enName": "Veigar"
      },
      "虚空之眼": {
        "championId": "161",
        "enName": "Velkoz"
      },
      "愁云使者": {
        "championId": "711",
        "enName": "Vex"
      },
      "皮城执法官": {
        "championId": "254",
        "enName": "Vi"
      },
      "破败之王": {
        "championId": "234",
        "enName": "Viego"
      },
      "机械先驱": {
        "championId": "112",
        "enName": "Viktor"
      },
      "猩红收割者": {
        "championId": "8",
        "enName": "Vladimir"
      },
      "不灭狂雷": {
        "championId": "106",
        "enName": "Volibear"
      },
      "祖安怒兽": {
        "championId": "19",
        "enName": "Warwick"
      },
      "逆羽": {
        "championId": "498",
        "enName": "Xayah"
      },
      "远古巫灵": {
        "championId": "101",
        "enName": "Xerath"
      },
      "德邦总管": {
        "championId": "5",
        "enName": "XinZhao"
      },
      "疾风剑豪": {
        "championId": "157",
        "enName": "Yasuo"
      },
      "封魔剑魂": {
        "championId": "777",
        "enName": "Yone"
      },
      "牧魂人": {
        "championId": "83",
        "enName": "Yorick"
      },
      "魔法猫咪": {
        "championId": "350",
        "enName": "Yuumi"
      },
      "生化魔人": {
        "championId": "154",
        "enName": "Zac"
      },
      "影流之主": {
        "championId": "238",
        "enName": "Zed"
      },
      "祖安花火": {
        "championId": "221",
        "enName": "Zeri"
      },
      "爆破鬼才": {
        "championId": "115",
        "enName": "Ziggs"
      },
      "时光守护者": {
        "championId": "26",
        "enName": "Zilean"
      },
      "暮光星灵": {
        "championId": "142",
        "enName": "Zoe"
      },
      "荆棘之兴": {
        "championId": "143",
        "enName": "Zyra"
      }
    }
  }
})

export const panelData = new Store({
  defaults: {
    panelData: {
      orderList: [],
      chaosList: [],
    }
  }
})

export const blacklist = new Store({
  defaults: {
    blacklist: []
  }
})