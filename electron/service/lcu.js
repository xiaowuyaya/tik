const { Service, Storage } = require('ee-core');
const api = require('../core/api');
const { translate } = require('../utils/translate');
const c = require('../utils/cache');
const _ = require('lodash');

class LcuService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async getChampionInfo() {
    const db = Storage.JsonDb.connection('ddragon').db;
    return db.value();
  }

  async getSummonerInfo() {
    const summoner = await api.getSummonerData();
    const ranked = await api.getRankedStatusInfoByPuuid(summoner.puuid);
    const environment = await api.getEnvironment();
    const avatar = await api.getSummonerAvatarBase64(summoner.profileIconId);
    return {
      displayName: summoner.displayName,
      summonerLevel: summoner.summonerLevel,
      puuid: summoner.puuid,
      summonerId: summoner.summonerId,
      avatarBase64: avatar,
      environment: translate('environment', environment.environment),
      rankedHighestTier: ranked.highestPreviousSeasonEndTier,
      rankedHighest: `${translate('rank', ranked.highestPreviousSeasonEndTier)} ${ranked.highestPreviousSeasonEndDivision}`,
      rankedSoloTier: ranked.queueMap.RANKED_SOLO_5x5.tier,
      rankedSolo: `${translate('rank', ranked.queueMap.RANKED_SOLO_5x5.tier)} ${ranked.queueMap.RANKED_SOLO_5x5.division} ${
        ranked.queueMap.RANKED_SOLO_5x5.leaguePoints
      }`,
      rankedFlexTier: ranked.queueMap.RANKED_FLEX_SR.tier,
      rankedFlex: `${translate('rank', ranked.queueMap.RANKED_FLEX_SR.tier)} ${ranked.queueMap.RANKED_FLEX_SR.division} ${
        ranked.queueMap.RANKED_FLEX_SR.leaguePoints
      }`,
    };
  }

  async getGameStatus() {
    return await api.getGameStatus();
  }

  async getGameDetailByGameId(gameId) {
    const data = await api.getHistoryDetailByGameId(gameId);
    let killsOfTeam1 = 0;
    let killsOfTeam2 = 0;
    let goldOfTeam1 = 0;
    let goldOfTeam2 = 0;
    let players = [];
    for (let i = 0; i < data.participantIdentities.length; i++) {
      let player = {};
      player.championAvatar = await this.getAvatarUrlByChampId(data.participants[i].championId);
      player.summonerName = data.participantIdentities[i].player.summonerName;
      player.summonerId = data.participantIdentities[i].player.summonerId;
      player.assists = data.participants[i].stats.assists;
      player.deaths = data.participants[i].stats.deaths;
      player.kills = data.participants[i].stats.kills;
      player.totalDamageDealtToChampions = data.participants[i].stats.totalDamageDealtToChampions;
      player.goldEarned = data.participants[i].stats.goldEarned;
      player.items = [
        data.participants[i].stats.item0,
        data.participants[i].stats.item1,
        data.participants[i].stats.item2,
        data.participants[i].stats.item3,
        data.participants[i].stats.item4,
        data.participants[i].stats.item5,
        data.participants[i].stats.item6,
      ];
      players.push(player);

      if (i <= 4) {
        killsOfTeam1 += player.kills;
      } else {
        killsOfTeam2 += player.kills;
      }

      if (i <= 4) {
        goldOfTeam1 += player.goldEarned;
      } else {
        goldOfTeam2 += player.goldEarned;
      }
    }

    let res = {
      gameCreationDate: data.gameCreationDate,
      gameId: data.gameId,
      gameDuration: data.gameDuration,
      gameMode: data.gameMode,
      queueId: translate('queue', data.queueId),
      killsOfTeam1,
      killsOfTeam2,
      goldOfTeam1,
      goldOfTeam2,
      players,
    };

    return res;
  }

  async sendMsgInChampSelect(type, msg) {
    return await api.sendMsgInChampSelect(type, msg);
  }

  async getAvatarUrlByChampName(championName) {
    const db = Storage.JsonDB.connection('ddragon').db;
    const championData = db.get('champions').value();
    return championData[championName].avatarUrl;
  }

  getAvatarUrlByChampId(championId) {
    const db = Storage.JsonDB.connection('ddragon').db;
    const championData = db.get('champions').value();
    for (const key in championData) {
      if (championData[key].championId == championId) {
        return championData[key].avatarUrl;
      }
    }
  }

  async getFormatInfoByPlayerList() {
    let playerList;
    while (true) {
      try {
        /**
         * getPlayerListInGame这个接口在刚进入游戏时可能获取不到数据，直接走个死循环，有时候获取到了还是空数组
         */
        playerList = await api.getPlayerListInGame();
        if (playerList.length > 0) break;
      } catch (err) {}
    }
    const res = [];
    for (let i = 0; i < playerList.length; i++) {
      const value = playerList[i];
      const championAvatar = await this.getAvatarUrlByChampName(value.championName);
      const data = {
        summonerName: value.summonerName,
        championName: value.championName,
        championAvatar: championAvatar,
        position: value.position,
        isBot: value.isBot,
        team: value.team,
      };
      res.push(data);
    }
    return res;
  }

  /* 同 getFormatInfoByPlayerList 返回值 */
  async getFormatInfoBySummonerIdList() {
    // 这里返回的数组大概率会有重复值，需要进行去重
    let IdListTemp = await api.getRoomPlayerIdList();
    let idList = [];
    _.forEach(IdListTemp, (value, index, collection) => {
      if (idList.indexOf(value == -1)) idList.push(value);
    });
    let r = [];
    for (let i = 0; i < idList.length; i++) {
      const value = idList[i];
      const info = await api.getSummonerBySummonerId(value);
      const temp = {
        summonerName: info.displayName,
        championName: null,
        championAvatar: 'https://ddragon.leagueoflegends.com/cdn/12.5.1/img/profileicon/29.png',
        position: null,
        isBot: false,
        team: 'ORDER',
      };
      r.push(temp);
    }
    return r;
  }

  /**
   * 对历史对局数据进行规则化处理，得出分数结果以及格式化对局数据
   * @param {*} historyMatches
   */
  async sourcingRules(historyMatches) {
    historyMatches = historyMatches.games.games;

    // 去除非排位赛对局数据
    const db = Storage.JsonDB.connection('settings').db;
    const isOnlyRank = db.get('send').get('onlyRank').value();
    if (isOnlyRank) {
      historyMatches = historyMatches.filter((item) => {
        return item.gameMode == 'CLASSIC';
      });
    }

    // 计算用变量([击杀，死亡，助攻，胜场，多杀]分数)
    let k = 0;
    let d = 0;
    let a = 0;
    let w = 0;
    let killingSpreesSource = 0;

    // 最近常用英雄记录
    let recentChampions = [];

    let data = [];

    historyMatches.forEach((match) => {
      let temp = {};
      temp.gameMode = match.gameMode;
      temp.gameType = match.gameType;
      temp.gameCreationDate = match.gameCreationDate;
      temp.championId = match.participants[0].championId;
      temp.spell1 = this.getSpellImgByKey(match.participants[0].spell1Id) ;
      temp.spell2 = this.getSpellImgByKey(match.participants[0].spell2Id) ;
      temp.championAvatar = this.getAvatarUrlByChampId(match.participants[0].championId)
      temp.champLevel = match.participants[0].stats.champLevel;
      temp.kills = match.participants[0].stats.kills;
      temp.deaths = match.participants[0].stats.deaths;
      temp.assists = match.participants[0].stats.assists;
      temp.win = match.participants[0].stats.win;
      temp.killingSprees = match.participants[0].stats.killingSprees;

      data.push(temp);

      // 获取玩家最近英雄情况
      recentChampions.push(temp.championId);

      k += temp.kills;
      d += temp.deaths;
      a += temp.assists;

      if (temp.win) {
        w += 1;
      }

      if (temp.killingSprees == 3) {
        killingSpreesSource += 2;
      } else if (temp.killingSprees == 4) {
        killingSpreesSource += 4;
      } else if (temp.killingSprees == 5) {
        killingSpreesSource += 8;
      }
    });

    // 计算分数
    let KDA = d == 0 ? k + a : (k + a) / d;
    let WIN_RATE = w / historyMatches.length;
    let SOURCE = (KDA * 10 * 0.4 + WIN_RATE * 100 * 0.4 + killingSpreesSource * 0.2) * 10;

    // 获取最近常用英雄
    let recentChampionsCount = [];
    recentChampions.sort();
    for (let i = 0; i < recentChampions.length; ) {
      let count = 0;
      for (let j = 0; j < recentChampions.length; j++) {
        if (recentChampions[i] == recentChampions[j]) {
          count++;
        }
      }
      recentChampionsCount.push({
        championId: recentChampions[i],
        avatarUrl: await this.getAvatarUrlByChampId(recentChampions[i]),
        count,
      });
      i += count;
    }
    // 排序
    recentChampionsCount.sort((a, b) => {
      return a.count > b.count ? -1 : 1;
    });
    // 切割
    recentChampionsCount = recentChampionsCount.slice(0, 3);

    const res = {
      recentChampionsCount,
      source: SOURCE.toFixed(2),
      kda: KDA.toFixed(2),
      winRate: `${(WIN_RATE * 100).toFixed(2)}%`,
      // 战绩显示最近的十把，倒序排列
      data: data.slice(-10).reverse(),
    };
    return res;
  }

  /**
   * 排序并设置头衔
   */
  async sortAndSetDesignation(list) {
    list.sort((a, b) => {
      if (a.matches.source > b.matches.source) {
        return -1;
      } else if (a.matches.source < b.matches.source) {
        return 1;
      } else {
        return 0;
      }
    });
    const db = Storage.JsonDB.connection('settings').db;
    const sendConfig = db.get('send').value();
    const summonerTitle = sendConfig.title;
    // 设置排名
    for (let i = 0; i < list.length; i++) {
      const str = `no${i + 1}`;
      list[i].type = summonerTitle[str];
    }
    return list;
  }

  /**
   * 数据分析并得出最终结果
   * @param {*} formatedPlayerInfoList
   */
  async dataAnalysis(formatedPlayerInfoList) {
    let list = formatedPlayerInfoList;
    for (let i = 0; i < formatedPlayerInfoList.length; i++) {
      // 判断是否为机器人
      if (!formatedPlayerInfoList[i].isBot) {
        const puuid = await api.getPuuidBySummonerName(formatedPlayerInfoList[i].summonerName);

        // 获取玩家排位信息
        const rank = await api.getRankedStatusInfoByPuuid(puuid);

        list[i].rankInfo = {
          highest: `${rank.highestPreviousSeasonEndTier} ${rank.highestPreviousSeasonEndDivision}`,
          rankedSolo: `${translate('rank', rank.queueMap.RANKED_SOLO_5x5.tier)} ${rank.queueMap.RANKED_SOLO_5x5.division}`,
          rankedFlex: `${translate('rank', rank.queueMap.RANKED_FLEX_SR.tier)} ${rank.queueMap.RANKED_FLEX_SR.division}`,
        };

        // 获取玩家的对局历史
        const historyList = await api.getHistoryMatchesByPuuid(puuid);
        // 对对局历史进行数据分析
        const matchesData = await this.sourcingRules(historyList);
        list[i].matches = matchesData;
      } else {
        // 机器人的相关信息留空
        list[i].rankInfo = {
          highest: '',
          rankedSolo: '',
          rankedFlex: '',
        };

        list[i].matches = {
          source: '',
          kda: '',
          winRate: '',
          data: '',
        };
      }
    }

    // 划分数据为敌友两组
    let orderList = [];
    let chaosList = [];

    list.forEach((player) => {
      if (player.team == 'ORDER') {
        orderList.push(player);
      } else {
        chaosList.push(player);
      }
    });

    // 排序并给与称号
    orderList = await this.sortAndSetDesignation(orderList);
    chaosList = await this.sortAndSetDesignation(chaosList);

    const playerList = {
      orderList: orderList,
      chaosList: chaosList,
    };

    return playerList;
  }

  async getHistoryMatchesBySummonerName(summonerName, begin, end) {
    const puuid = await api.getPuuidBySummonerName(summonerName);
    // 获取玩家的对局历史
    return await api.getHistoryMatchesByPuuid(puuid, begin, end);
  }

  isGamelaunch() {
    const credentials = c.get('credentials');
    return credentials;
  }

  async create5v5PracticeToolMode() {
    return await api.createCustomLobby('PRACTICETOOL', 11, 'PRACTICETOOL' + Math.random() * 100);
  }

  /**
   * 发送应用启动信息
   */
  async launchNotifications() {
    return await api.sendNotifications('Tik🎮', 'Tik英雄联盟对局助手已启动！💕');
  }

  async acceptMatchmaking() {
    return await api.acceptMatchmaking();
  }

  async changeTier(tier) {
    try {
      let r = await api.getPlayerChatInfo();
      r.lol.rankedLeagueDivision = 'I';
      r.lol.rankedLeagueQueue = 'RANKED_SOLO_5x5';
      r.lol.rankedLeagueTier = tier;
      r.lol.rankedPrevSeasonDivision = 'I';
      return await api.putPlayerChatInfo(r);
    } catch (err) {
      return null;
    }
  }

  async changeStatus(status) {
    try {
      let r = await api.getPlayerChatInfo();
      r.availability = status;
      return await api.putPlayerChatInfo(r);
    } catch (err) {
      return null;
    }
  }

  async spectatorLaunch(summonerName) {
    // 经测试，只需要是召唤师峡谷地图就可以，不用指定模式
    // let r = await spectatorLaunchByName(summonerName, 'RANKED_FLEX_SR')
    return await api.spectatorLaunchByName(summonerName, 'RANKED_SOLO_5x5');
  }

  async confirmChampionByAction(actionId, championId, confirm) {
    return await api.selectChampionById(championId, actionId, confirm);
  }

  /**
   * 早期实现方法，太年轻，已废弃。
   * 根据id自动选人
   * p.s. 这个功能非常复杂且傻逼，接口的{id}不是楼层cellId，而是他自己定义的一个id，反复取来取去他妈的。
   * p.s. 经测试发现，这个id指的是当前所在的事件id，可以通过cellid==actorCellId来判断是不是属于自己的事件
   * @param {*}} championId
   * @returns
   */
  async confirmChampionById(championId, confirm) {
    const player = await api.getSummonerData();
    const session = await api.getSessionInfo();
    const actions = session.actions[0];
    const team = session.myTeam;
    // 获取cellid
    let cellId;
    for (let i = 0; i < team.length; i++) {
      const order = team[i];
      if (order.summonerId == player.summonerId) {
        cellId = order.cellId;
        break;
      }
    }
    // 拿cellid 去actions找id
    let id;
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.actorCellId == cellId) {
        id = action.id;
      }
    }
    return await api.selectChampionById(championId, id, confirm);
  }

  // TODO: 需要重写，目前沿用旧版本
  async getPanelDataInChampSelect() {
    let formatedList = await this.getFormatInfoBySummonerIdList();
    let playerList = await this.dataAnalysis(formatedList);
    // 更新数据
    const panelData = {
      orderList: playerList.orderList ? playerList.orderList : '',
      chaosList: playerList.chaosList ? playerList.chaosList : '',
    };
    c.put('panel-data', panelData);

    // 获取发送配置
    const settingsDB = Storage.JsonDB.connection('settings').db;
    const sendConfig = settingsDB.get('send').value();
    // 获取黑名单列表
    const bansDB = Storage.JsonDB.connection('blacklist').db;
    const blackList = bansDB.get('list').value();

    // 黑名单信息是否发送所有人
    const blackNoticeToAll = sendConfig.blackListNotice;

    // 判断玩家中是否有黑名单成员
    for (let i = 0; i < blackList.length; i++) {
      const ban = blackList[i];
      for (let j = 0; j < formatedList.length; j++) {
        const player = formatedList[j];
        if (player.summonerName == ban.blackName) {
          // 发送信息到聊天框
          await this.snedMsgInChampSelect(blackNoticeToAll ? 'all' : 'me', `[对局助手]：玩家 ${ban.blackName} 在你的黑名单中, 原因：${ban.reason}`);
        }
      }
    }
    return playerList;
  }

  /**
   * TODO: 需要重写，目前沿用旧版本
   */
  async getPanelDataInProgress() {
    const formatedList = await this.getFormatInfoByPlayerList();
    const playerList = await this.dataAnalysis(formatedList);

    // 更新数据
    const panelData = {
      orderList: playerList.orderList ? playerList.orderList : '',
      chaosList: playerList.chaosList ? playerList.chaosList : '',
    };
    c.put('panel-data', panelData);

    return playerList;
  }

  /* TODO: 需要重写 */
  async useRunePage(data) {
    try {
      // 获取所有符文
      let RunesPage = await api.getAllRunePage();
      // 删除最近的一个符文
      let del = await api.delRunePage(RunesPage[0].id);
      // 应用符文
      let r = await api.postRunePage(data);
      // 发送信息
      await this.sendMsgInChampSelect('all', `${data.name} OPGG符文应用成功！ --lol-tool.cοΜ`);
      const parm = {
        code: 200,
        msg: r,
      };
      return parm;
    } catch (err) {
      const parm = {
        code: 500,
        msg: err.message,
      };
      return parm;
    }
  }

  async getChampionSkinListByChampionId(championId) {
    return await api.getChampionSkinListById(championId);
  }

  async getLcuImgBase64(url) {
    return await api.getLcuImgBase64(url);
  }

  async setBackgroundSkinId(param) {
    return await api.setBackgroundSkinId(param);
  }

  getSpellImgByKey(keyId){
    const db = Storage.JsonDB.connection('ddragon').db;
    const summonerSpellsData = db.get('summonerSpells').value();
    for (const key in summonerSpellsData) {
      if (summonerSpellsData[key].key == keyId) {
        return summonerSpellsData[key].img;
      }
    }
  }

  getSpellInfoByName(name){
    const db = Storage.JsonDB.connection('ddragon').db;
    const summonerSpellsData = db.get('summonerSpells').value();
    for (const key in summonerSpellsData) {
      if (summonerSpellsData[key].name == name) {
        return summonerSpellsData[key]
      }
    }
  }
}

module.exports = LcuService;
