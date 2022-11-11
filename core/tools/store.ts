import Store from 'electron-store'

/**
 * 黑名单本地配置
 */
export const blacklistStore = new Store({
  defaults: {
    blacklist: [],
  },
})

/**
 * 应用程序配置
 */
export const appStore = new Store({
  defaults: {
    app: {
      /* 记住退出方式 */
      rememberQuit: false,
      /* 自适应主题 */
      autoTheme: true,
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
      sendTextTemplate: "{称号}:{玩家名},kda:{kda},胜率:{胜率},近期:{对局}",
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

/**
 * ddragon配置
 */
export const ddragonStore = new Store({
  defaults: {
    ddragon: {
      champions: {
        暗裔剑魔: {
          championId: '266',
          enName: 'Aatrox',
        },
        九尾妖狐: {
          championId: '103',
          enName: 'Ahri',
        },
        离群之刺: {
          championId: '84',
          enName: 'Akali',
        },
        影哨: {
          championId: '166',
          enName: 'Akshan',
        },
        牛头酋长: {
          championId: '12',
          enName: 'Alistar',
        },
        殇之木乃伊: {
          championId: '32',
          enName: 'Amumu',
        },
        冰晶凤凰: {
          championId: '34',
          enName: 'Anivia',
        },
        黑暗之女: {
          championId: '1',
          enName: 'Annie',
        },
        残月之肃: {
          championId: '523',
          enName: 'Aphelios',
        },
        寒冰射手: {
          championId: '22',
          enName: 'Ashe',
        },
        铸星龙王: {
          championId: '136',
          enName: 'AurelionSol',
        },
        沙漠皇帝: {
          championId: '268',
          enName: 'Azir',
        },
        星界游神: {
          championId: '432',
          enName: 'Bard',
        },
        虚空女皇: {
          championId: '200',
          enName: 'Belveth',
        },
        蒸汽机器人: {
          championId: '53',
          enName: 'Blitzcrank',
        },
        复仇焰魂: {
          championId: '63',
          enName: 'Brand',
        },
        弗雷尔卓德之心: {
          championId: '201',
          enName: 'Braum',
        },
        皮城女警: {
          championId: '51',
          enName: 'Caitlyn',
        },
        青钢影: {
          championId: '164',
          enName: 'Camille',
        },
        魔蛇之拥: {
          championId: '69',
          enName: 'Cassiopeia',
        },
        虚空恐惧: {
          championId: '31',
          enName: 'Chogath',
        },
        英勇投弹手: {
          championId: '42',
          enName: 'Corki',
        },
        诺克萨斯之手: {
          championId: '122',
          enName: 'Darius',
        },
        皎月女神: {
          championId: '131',
          enName: 'Diana',
        },
        荣耀行刑官: {
          championId: '119',
          enName: 'Draven',
        },
        祖安狂人: {
          championId: '36',
          enName: 'DrMundo',
        },
        时间刺客: {
          championId: '245',
          enName: 'Ekko',
        },
        蜘蛛女皇: {
          championId: '60',
          enName: 'Elise',
        },
        痛苦之拥: {
          championId: '28',
          enName: 'Evelynn',
        },
        探险家: {
          championId: '81',
          enName: 'Ezreal',
        },
        远古恐惧: {
          championId: '9',
          enName: 'Fiddlesticks',
        },
        无双剑姬: {
          championId: '114',
          enName: 'Fiora',
        },
        潮汐海灵: {
          championId: '105',
          enName: 'Fizz',
        },
        正义巨像: {
          championId: '3',
          enName: 'Galio',
        },
        海洋之灾: {
          championId: '41',
          enName: 'Gangplank',
        },
        德玛西亚之力: {
          championId: '86',
          enName: 'Garen',
        },
        迷失之牙: {
          championId: '150',
          enName: 'Gnar',
        },
        酒桶: {
          championId: '79',
          enName: 'Gragas',
        },
        法外狂徒: {
          championId: '104',
          enName: 'Graves',
        },
        灵罗娃娃: {
          championId: '887',
          enName: 'Gwen',
        },
        战争之影: {
          championId: '120',
          enName: 'Hecarim',
        },
        大发明家: {
          championId: '74',
          enName: 'Heimerdinger',
        },
        海兽祭司: {
          championId: '420',
          enName: 'Illaoi',
        },
        刀锋舞者: {
          championId: '39',
          enName: 'Irelia',
        },
        翠神: {
          championId: '427',
          enName: 'Ivern',
        },
        风暴之怒: {
          championId: '40',
          enName: 'Janna',
        },
        德玛西亚皇子: {
          championId: '59',
          enName: 'JarvanIV',
        },
        武器大师: {
          championId: '24',
          enName: 'Jax',
        },
        未来守护者: {
          championId: '126',
          enName: 'Jayce',
        },
        戏命师: {
          championId: '202',
          enName: 'Jhin',
        },
        暴走萝莉: {
          championId: '222',
          enName: 'Jinx',
        },
        虚空之女: {
          championId: '145',
          enName: 'Kaisa',
        },
        复仇之矛: {
          championId: '429',
          enName: 'Kalista',
        },
        天启者: {
          championId: '43',
          enName: 'Karma',
        },
        死亡颂唱者: {
          championId: '30',
          enName: 'Karthus',
        },
        虚空行者: {
          championId: '38',
          enName: 'Kassadin',
        },
        不祥之刃: {
          championId: '55',
          enName: 'Katarina',
        },
        正义天使: {
          championId: '10',
          enName: 'Kayle',
        },
        影流之镰: {
          championId: '141',
          enName: 'Kayn',
        },
        狂暴之心: {
          championId: '85',
          enName: 'Kennen',
        },
        虚空掠夺者: {
          championId: '121',
          enName: 'Khazix',
        },
        永猎双子: {
          championId: '203',
          enName: 'Kindred',
        },
        暴怒骑士: {
          championId: '240',
          enName: 'Kled',
        },
        深渊巨口: {
          championId: '96',
          enName: 'KogMaw',
        },
        诡术妖姬: {
          championId: '7',
          enName: 'Leblanc',
        },
        盲僧: {
          championId: '64',
          enName: 'LeeSin',
        },
        曙光女神: {
          championId: '89',
          enName: 'Leona',
        },
        含羞蓓蕾: {
          championId: '876',
          enName: 'Lillia',
        },
        冰霜女巫: {
          championId: '127',
          enName: 'Lissandra',
        },
        圣枪游侠: {
          championId: '236',
          enName: 'Lucian',
        },
        仙灵女巫: {
          championId: '117',
          enName: 'Lulu',
        },
        光辉女郎: {
          championId: '99',
          enName: 'Lux',
        },
        熔岩巨兽: {
          championId: '54',
          enName: 'Malphite',
        },
        虚空先知: {
          championId: '90',
          enName: 'Malzahar',
        },
        扭曲树精: {
          championId: '57',
          enName: 'Maokai',
        },
        无极剑圣: {
          championId: '11',
          enName: 'MasterYi',
        },
        赏金猎人: {
          championId: '21',
          enName: 'MissFortune',
        },
        齐天大圣: {
          championId: '62',
          enName: 'MonkeyKing',
        },
        铁铠冥魂: {
          championId: '82',
          enName: 'Mordekaiser',
        },
        堕落天使: {
          championId: '25',
          enName: 'Morgana',
        },
        唤潮鲛姬: {
          championId: '267',
          enName: 'Nami',
        },
        沙漠死神: {
          championId: '75',
          enName: 'Nasus',
        },
        深海泰坦: {
          championId: '111',
          enName: 'Nautilus',
        },
        万花通灵: {
          championId: '518',
          enName: 'Neeko',
        },
        狂野女猎手: {
          championId: '76',
          enName: 'Nidalee',
        },
        不羁之悦: {
          championId: '895',
          enName: 'Nilah',
        },
        永恒梦魇: {
          championId: '56',
          enName: 'Nocturne',
        },
        雪原双子: {
          championId: '20',
          enName: 'Nunu',
        },
        狂战士: {
          championId: '2',
          enName: 'Olaf',
        },
        发条魔灵: {
          championId: '61',
          enName: 'Orianna',
        },
        山隐之焰: {
          championId: '516',
          enName: 'Ornn',
        },
        不屈之枪: {
          championId: '80',
          enName: 'Pantheon',
        },
        圣锤之毅: {
          championId: '78',
          enName: 'Poppy',
        },
        血港鬼影: {
          championId: '555',
          enName: 'Pyke',
        },
        元素女皇: {
          championId: '246',
          enName: 'Qiyana',
        },
        德玛西亚之翼: {
          championId: '133',
          enName: 'Quinn',
        },
        幻翎: {
          championId: '497',
          enName: 'Rakan',
        },
        披甲龙龟: {
          championId: '33',
          enName: 'Rammus',
        },
        虚空遁地兽: {
          championId: '421',
          enName: 'RekSai',
        },
        镕铁少女: {
          championId: '526',
          enName: 'Rell',
        },
        炼金男爵: {
          championId: '888',
          enName: 'Renata',
        },
        荒漠屠夫: {
          championId: '58',
          enName: 'Renekton',
        },
        傲之追猎者: {
          championId: '107',
          enName: 'Rengar',
        },
        放逐之刃: {
          championId: '92',
          enName: 'Riven',
        },
        机械公敌: {
          championId: '68',
          enName: 'Rumble',
        },
        符文法师: {
          championId: '13',
          enName: 'Ryze',
        },
        沙漠玫瑰: {
          championId: '360',
          enName: 'Samira',
        },
        北地之怒: {
          championId: '113',
          enName: 'Sejuani',
        },
        涤魂圣枪: {
          championId: '235',
          enName: 'Senna',
        },
        星籁歌姬: {
          championId: '147',
          enName: 'Seraphine',
        },
        腕豪: {
          championId: '875',
          enName: 'Sett',
        },
        恶魔小丑: {
          championId: '35',
          enName: 'Shaco',
        },
        暮光之眼: {
          championId: '98',
          enName: 'Shen',
        },
        龙血武姬: {
          championId: '102',
          enName: 'Shyvana',
        },
        炼金术士: {
          championId: '27',
          enName: 'Singed',
        },
        亡灵战神: {
          championId: '14',
          enName: 'Sion',
        },
        战争女神: {
          championId: '15',
          enName: 'Sivir',
        },
        水晶先锋: {
          championId: '72',
          enName: 'Skarner',
        },
        琴瑟仙女: {
          championId: '37',
          enName: 'Sona',
        },
        众星之子: {
          championId: '16',
          enName: 'Soraka',
        },
        诺克萨斯统领: {
          championId: '50',
          enName: 'Swain',
        },
        解脱者: {
          championId: '517',
          enName: 'Sylas',
        },
        暗黑元首: {
          championId: '134',
          enName: 'Syndra',
        },
        河流之王: {
          championId: '223',
          enName: 'TahmKench',
        },
        岩雀: {
          championId: '163',
          enName: 'Taliyah',
        },
        刀锋之影: {
          championId: '91',
          enName: 'Talon',
        },
        瓦洛兰之盾: {
          championId: '44',
          enName: 'Taric',
        },
        迅捷斥候: {
          championId: '17',
          enName: 'Teemo',
        },
        魂锁典狱长: {
          championId: '412',
          enName: 'Thresh',
        },
        麦林炮手: {
          championId: '18',
          enName: 'Tristana',
        },
        巨魔之王: {
          championId: '48',
          enName: 'Trundle',
        },
        蛮族之王: {
          championId: '23',
          enName: 'Tryndamere',
        },
        卡牌大师: {
          championId: '4',
          enName: 'TwistedFate',
        },
        瘟疫之源: {
          championId: '29',
          enName: 'Twitch',
        },
        兽灵行者: {
          championId: '77',
          enName: 'Udyr',
        },
        无畏战车: {
          championId: '6',
          enName: 'Urgot',
        },
        惩戒之箭: {
          championId: '110',
          enName: 'Varus',
        },
        暗夜猎手: {
          championId: '67',
          enName: 'Vayne',
        },
        邪恶小法师: {
          championId: '45',
          enName: 'Veigar',
        },
        虚空之眼: {
          championId: '161',
          enName: 'Velkoz',
        },
        愁云使者: {
          championId: '711',
          enName: 'Vex',
        },
        皮城执法官: {
          championId: '254',
          enName: 'Vi',
        },
        破败之王: {
          championId: '234',
          enName: 'Viego',
        },
        机械先驱: {
          championId: '112',
          enName: 'Viktor',
        },
        猩红收割者: {
          championId: '8',
          enName: 'Vladimir',
        },
        不灭狂雷: {
          championId: '106',
          enName: 'Volibear',
        },
        祖安怒兽: {
          championId: '19',
          enName: 'Warwick',
        },
        逆羽: {
          championId: '498',
          enName: 'Xayah',
        },
        远古巫灵: {
          championId: '101',
          enName: 'Xerath',
        },
        德邦总管: {
          championId: '5',
          enName: 'XinZhao',
        },
        疾风剑豪: {
          championId: '157',
          enName: 'Yasuo',
        },
        封魔剑魂: {
          championId: '777',
          enName: 'Yone',
        },
        牧魂人: {
          championId: '83',
          enName: 'Yorick',
        },
        魔法猫咪: {
          championId: '350',
          enName: 'Yuumi',
        },
        生化魔人: {
          championId: '154',
          enName: 'Zac',
        },
        影流之主: {
          championId: '238',
          enName: 'Zed',
        },
        祖安花火: {
          championId: '221',
          enName: 'Zeri',
        },
        爆破鬼才: {
          championId: '115',
          enName: 'Ziggs',
        },
        时光守护者: {
          championId: '26',
          enName: 'Zilean',
        },
        暮光星灵: {
          championId: '142',
          enName: 'Zoe',
        },
        荆棘之兴: {
          championId: '143',
          enName: 'Zyra',
        },
      },
      spells: {
        SummonerBarrier: {
          id: 'SummonerBarrier',
          name: '屏障',
          description: '为你的英雄套上护盾，吸收105-411（取决于英雄等级）伤害，持续2秒。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerBarrier.png',
          tooltip: '暂时为你的英雄套上持续2秒的护盾，抵挡{{ tooltipabsorbeddamage }}伤害。',
          cooldownBurn: '180',
          key: '21',
        },
        SummonerBoost: {
          id: 'SummonerBoost',
          name: '净化',
          description:
            '移除身上的所有限制效果（压制效果和击飞效果除外）和召唤师技能的减益效果，并且若在接下来的3秒里再次被施加限制效果时，新效果的持续时间会减少65%。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerBoost.png',
          tooltip:
            '移除你的英雄身上的所有限制效果（压制效果和击飞效果除外）和召唤师技能的减益效果，并且若在接下来的{{ e2 }}秒里再次被施加以上效果时，新效果的持续时间将减少65%。',
          cooldownBurn: '210',
          key: '1',
        },
        SummonerDot: {
          id: 'SummonerDot',
          name: '引燃',
          description:
            '引燃是对单体敌方目标施放的持续性伤害技能，在5秒的持续时间里造成70-410（取决于英雄等级）真实伤害，获得目标的视野，并减少目标所受的治疗和回复效果。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerDot.png',
          tooltip:
            '引燃目标敌人，在5秒的持续时间里造成共<span class="colorFEFCFF">{{ tooltiptruedamagecalculation }}</span>真实伤害，获得目标视野，并在持续期间为目标施加{{ grievousamount*100 }}%重伤效果。<br /><br /><rules>(重伤效果会使目标所受的治疗和回复效果降低，如果有多个重伤效果则取最高值。这个视野不会使潜行的敌人显形。)</rules>',
          cooldownBurn: '180',
          key: '14',
        },
        SummonerExhaust: {
          id: 'SummonerExhaust',
          name: '虚弱',
          description: '虚弱目标敌方英雄，降低其30%的移动速度，并使其造成的伤害减少40%，持续3秒。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerExhaust.png',
          tooltip:
            '虚弱目标英雄，降低目标{{ e5 }}%的移动速度，并使目标造成的伤害减少{{ damagereductiontooltip }}%，持续3秒。',
          cooldownBurn: '210',
          key: '3',
        },
        SummonerFlash: {
          id: 'SummonerFlash',
          name: '闪现',
          description: '使英雄朝着你的指针所停的区域瞬间传送一小段距离。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerFlash.png',
          tooltip: '使英雄朝着你的指针所停的区域瞬间传送一小段距离。',
          cooldownBurn: '300',
          key: '4',
        },
        SummonerHaste: {
          id: 'SummonerHaste',
          name: '幽灵疾步',
          description:
            '在10秒里，你的英雄可以无视单位的碰撞体积并且获得24~48%移动速度加成(基于英雄等级)。【幽灵疾步】会在参与击杀后延长其持续时间。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerHaste.png',
          tooltip:
            '在{{ duration }}秒里，你的英雄可以无视单位的碰撞体积并且获得{{ movespeedmod }}移动速度加成。<br /><br />【幽灵疾步】会在参与击杀后延长{{ takedownextension }}秒持续时间。',
          cooldownBurn: '210',
          key: '6',
        },
        SummonerHeal: {
          id: 'SummonerHeal',
          name: '治疗术',
          description:
            '为你和目标友军英雄回复80-318（取决于英雄等级）生命值，并为你和目标友军英雄提供30%移动速度加成，持续1秒。若目标近期已受到过其它治疗术的影响，则治疗术对目标产生的治疗效果减半。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerHeal.png',
          tooltip:
            '为你的英雄和目标友军英雄回复{{ tooltiphealamount }}（取决于英雄等级）生命值，并提供30%移动速度加成，持续1秒。若目标近期已受到过其它治疗术的影响，则治疗术对目标产生的治疗效果减半。<br /><br /><span class="colorFFFF00">如果这个技能无法找到目标，就会作用于范围内伤势最重的一位友军英雄。</span>',
          cooldownBurn: '240',
          key: '7',
        },
        SummonerMana: {
          id: 'SummonerMana',
          name: '清晰术',
          description: '为你的英雄回复50%的最大法力值。也会为周围的友军回复25%的最大法力值',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerMana.png',
          tooltip: '为你的英雄回复{{ e1 }}%的最大法力值，并为周围友军回复{{ e2 }}%最大法力值。',
          cooldownBurn: '240',
          key: '13',
        },
        SummonerPoroRecall: {
          id: 'SummonerPoroRecall',
          name: '护驾！',
          description: '快速位移到魄罗之王旁边。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerPoroRecall.png',
          tooltip:
            '<span class="colorFFE076">被动：</span>用魄罗命中一个敌方英雄，会为你的队伍提供一层魄罗印记。当魄罗印记达到10层时，你的队伍就可以召唤出魄罗之王来与你们并肩作战。在魄罗之王处于活跃状态时，双方队伍都无法获得魄罗印记。<br /><br /><span class="colorFFE076">主动：</span>快速冲刺到魄罗之王的身旁。只能在己方召唤了魄罗之王时施放。 <br /><br /><i><span class="colorFDD017">“魄罗们才是扣人心弦的焦点。而你们只是抱大腿的。”</span></i></mainText>',
          cooldownBurn: '10',
          key: '30',
        },
        SummonerPoroThrow: {
          id: 'SummonerPoroThrow',
          name: '魄罗投掷',
          description: '把一个魄罗投向你的敌人。如果它命中了一名敌人，那么你接下来就可以快速位移到被命中的敌人旁边。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerPoroThrow.png',
          tooltip:
            '将一个魄罗投向远处，对命中的第一个敌方单位造成{{ f2 }}真实伤害，并提供目标的<span class="coloree91d7">真实视野</span>。<br /><br />如果这个技能命中了一个敌人，那么在接下来的3秒里可以再次施放此技能，来冲到被命中的目标旁边，多造成{{ f2 }}真实伤害，并缩短下一个【魄罗投掷】{{ e4 }}秒冷却时间。<br /><br />魄罗们不会被法术护盾或各种墙体所格挡，因为它们是萌萌哒小动物，而不是技能！<br /><br /><i><span class="colorFDD017">“魄罗们是符文大陆空气动力学的一个科研模型。”</span></i></mainText>',
          cooldownBurn: '20',
          key: '31',
        },
        SummonerSmite: {
          id: 'SummonerSmite',
          name: '惩戒',
          description:
            '对目标史诗级野怪、大型野怪、中型野怪或小兵造成450真实伤害。在对抗野怪时，还会回复90 (+10%最大生命值)生命值。可持有2层充能(90秒充能时间)。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerSmite.png',
          tooltip:
            '对目标野怪或小兵造成<span class="colorFEFCFF">{{ smitebasedamage }}</span>真实伤害。对野怪时，额外回复<span class="colorFFFFFF">{{ smitebaseheal }}</span><span class="colorFF6666">(+{{ tooltipsmitehealaddition }})</span>生命值。<br /><br />【惩戒】每{{ ammorechargetime }}秒获得一层充能，最多可保持2层充能。<br /><br /><rules>无法对小型野怪施放。</rules>',
          cooldownBurn: '15',
          key: '11',
        },
        SummonerSnowURFSnowball_Mark: {
          id: 'SummonerSnowURFSnowball_Mark',
          name: '标记',
          description:
            '沿直线扔出一个雪球。如果雪球命中了一个敌人，那么这个敌人会被【标记】，提供真实视野，并且你的英雄接下来可以快速突进到被【标记】的目标旁边。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerSnowURFSnowball_Mark.png',
          tooltip:
            '扔出一个长程雪球，对命中的第一个敌方单位造成{{ tooltipdamagetotal }}真实伤害并提供目标的<span class="coloree91d7">真实视野</span>。如果雪球命中了一个敌人，那么这个技能可以在{{ e3 }}秒里再次施放，用来让英雄【冲刺】到目标单位旁边，同时造成额外的{{ tooltipdamagetotal }}真实伤害。在【冲刺】到目标旁边的同时，【标记】的冷却时间会减少{{ e4 }}%。<br /><br /><span class="colorFFFF00">【标记】的飞行道具不会被法术护盾或者飞行道具拦截技（亚索的【W风之障壁】、布隆的【E坚不可摧】）所阻挡。</span>',
          cooldownBurn: '80',
          key: '39',
        },
        SummonerSnowball: {
          id: 'SummonerSnowball',
          name: '标记',
          description:
            '沿直线扔出一个雪球。如果雪球命中了一个敌人，那么这个敌人会被【标记】，提供真实视野，并且你的英雄接下来可以快速突进到被【标记】的目标旁边。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerSnowball.png',
          tooltip:
            '扔出一个长程雪球，对命中的第一个敌方单位造成{{ tooltipdamagetotal }}真实伤害并提供目标的<span class="coloree91d7">真实视野</span>。如果雪球命中了一个敌人，那么这个技能可以在{{ e3 }}秒里再次施放，用来让英雄【冲刺】到目标单位旁边，同时造成额外的{{ tooltipdamagetotal }}真实伤害。在【冲刺】到目标旁边的同时，【标记】的冷却时间会减少{{ e4 }}%。<br /><br /><span class="colorFFFF00">【标记】的飞行道具不会被法术护盾或者飞行道具拦截技（亚索的【W风之障壁】、布隆的【E坚不可摧】）所阻挡。</span>',
          cooldownBurn: '80',
          key: '32',
        },
        SummonerTeleport: {
          id: 'SummonerTeleport',
          name: '传送',
          description:
            '在引导4秒后，将你的英雄传送到友方建筑物旁边。会在14分钟时升级为【解封的传送】，【解封的传送】可将你的英雄传送至友方建筑物、友方小兵或友方守卫旁边。',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/SummonerTeleport.png',
          tooltip:
            '在引导{{ channelduration }}秒后，将你的英雄传送到友方建筑物旁边。<br /><br />会在14分钟防御塔镀层脱落时升级为【解封的传送】。【解封的传送】拥有{{ upgradedcooldown }}秒冷却时间，可以用在友方的建筑物、小兵或守卫上，并提供{{ msamount*100 }}%移动速度加成，持续{{ msduration }}秒。',
          cooldownBurn: '360',
          key: '12',
        },
        Summoner_UltBookPlaceholder: {
          id: 'Summoner_UltBookPlaceholder',
          name: '占位',
          description:
            '这个栏位将在游戏开始后，被替换为所选的另一位英雄的终极技能。届时将有30秒的时间选择一个终极技能。请做好准备！',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/Summoner_UltBookPlaceholder.png',
          tooltip: '将被替换为你所选的终极技能。{{ spellmodifierdescriptionappend }}',
          cooldownBurn: '0',
          key: '54',
        },
        Summoner_UltBookSmitePlaceholder: {
          id: 'Summoner_UltBookSmitePlaceholder',
          name: '占位和攻击惩戒',
          description:
            '这个栏位将在游戏开始后，被替换为所选的另一位英雄的终极技能并且你将获得【攻击惩戒】。届时将有30秒的时间选择一个终极技能。请做好准备！',
          img: 'https://ddragon.leagueoflegends.com/cdn/12.14.1/img/spell/Summoner_UltBookSmitePlaceholder.png',
          tooltip:
            '将被替换为你所选的终极技能。<br /><br />提供【攻击惩戒】。【攻击惩戒】将在你攻击增益野怪、史诗级野怪和峡谷迅捷蟹时将其处决。<br /><br /><attention>【攻击惩戒】没有冷却时间。</attention>{{ spellmodifierdescriptionappend }}',
          cooldownBurn: '0',
          key: '55',
        },
      },
    },
  },
})
