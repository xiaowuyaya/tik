const { Controller, Storage } = require('ee-core');
const R = require('../utils/res');
const { translate } = require('../utils/translate');
const c = require('../utils/cache');

class LcuController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  async getChampionInfoList(args, event) {
    try {
      return await this.service.lcu.getChampionInfo();
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 获取英雄数据失败:${err}`);
    }
  }

  isGamelaunch(args, event) {
    return this.service.lcu.isGamelaunch();
  }

  async getPlayerInfo(args, event) {
    try {
      return await this.service.lcu.getSummonerInfo();
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 获取玩家信息失败:${err}`);
    }
  }

  async getPlayerStatus(args, event) {
    try {
      const status = await this.service.lcu.getGameStatus();
      if (args.origin) return status;
      return translate('status', status);
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 获取游戏状态失败:${err}`);
    }
  }

  async changeTiger(args, event) {
    const r = await this.service.lcu.changeTier(args.tiger);
    if (r) {
      this.app.logger.info(`[controller:lcu] 段位伪造${args.tiger}成功`);
      return R.success(null, `段位伪造成功`);
    }
    this.app.logger.error(`[controller:lcu] 段位伪造${args.tiger}失败`);
    return R.fail(`段位伪造失败: ${err}`);
  }

  async changeStatus(args, event) {
    const r = await this.service.lcu.changeStatus(args.status);
    if (r) {
      this.app.logger.info(`[controller:lcu] 状态更改${args.status}成功`);
      return R.success(null, `状态更改成功`);
    }
    this.app.logger.error(`[controller:lcu] 状态更改${args.status}失败`);
    return R.fail(`状态更改失败: ${err}`);
  }

  // TODO: 该功能出问题了
  async spectatorLaunch(args, event) {
    const r = await this.service.lcu.spectatorLaunch(args.summonerName);
    if (r) {
      this.app.logger.info(`[controller:lcu] 拉起观战${args.summonerName}成功`);
      return R.success(null, `拉起观战${args.summonerName}成功, 即将启动观战`);
    }
    this.app.logger.error(`[controller:lcu] 拉起观战${args.summonerName}失败`);
    return R.fail(`玩家：${args.summonerName}非法或未登入游戏`);
  }

  async createLobby(args, event) {
    if (args.mode == '5v5PracticeToolMode') {
      const r = await this.service.lcu.create5v5PracticeToolMode();
      if (r) {
        this.app.logger.info(`[controller:lcu] 创建房间${args.mode}成功`);
        return R.success(null, `创建房间${args.mode}成功`);
      }
      this.app.logger.error(`[controller:lcu] 创建房间${args.mode}失败`);
      return R.fail(`未登入游戏或当前已在游戏中`);
    }
  }

  /**
   * 获取面板数据
   */
  async getPanelData(args, event) {
    const status = args.status;
    let panelData = c.get('panel-data');
    try {
      // 如果在选人阶段，队友信息为空，则重新获取
      if (status == 'ChampSelect' && panelData.orderList.length < 5) {
        this.app.logger.info(`[controller:lcu] 正在获取选人界面的面板数据`);
        panelData = await this.service.lcu.getPanelDataInChampSelect();
        // 发送提示信息
        this.app.logger.info(`[controller:lcu] 选人界面的面板数据获取成功`);
        await this.service.lcu.sendMsgInChampSelect('me', `队友信息获取成功`);
      }
      // 获取游戏中的对局信息
      if (status == 'InProgress' && panelData.chaosList.length == 0) {
        this.app.logger.info(`[controller:lcu] 正在获取游戏中的面板数据`);
        panelData = await this.service.lcu.getPanelDataInProgress();
        this.app.logger.info(`[controller:lcu] 游戏中的面板数据获取成功`);
      }
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 获取面板数据失败:${err}`);
    }
    
    return JSON.parse(JSON.stringify(panelData));
  }

  /**
   * 获取历史对局列表
   * @param {*} args
   * @param {*} event
   * @returns
   */
  async getHistoryMatches(args, event) {
    try {
      const page = args.page;
      const size = args.size || 7;
      const begin = (page - 1) * size;
      const end = begin + size;
      let history = await this.service.lcu.getHistoryMatchesBySummonerName(args.summonerName, begin, end);
      for (let i = 0; i < history.games.games.length; i++) {
        history.games.games[i].avatarUrl = await this.service.lcu.getAvatarUrlByChampId(history.games.games[i].participants[0].championId);
        history.games.games[i].queueId = translate('queue', history.games.games[i].queueId);
      }
      const data = {
        items: history.games.games.reverse(),
        total: history.games.games.length,
      };
      this.app.logger.info(`[controller:lcu] 获取${args.summonerName}历史对局成功，当前页:${args.page}`);

      return data;
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 获取${args.summonerName}历史对局失败:${err}`);
    }
  }

  /**
   * 获取对局详情
   */
  async getMatchesDetail(args, event) {
    try {
      const data = await this.service.lcu.getGameDetailByGameId(args.gameId);
      this.app.logger.info(`[controller:lcu] 获取对局${args.gameId}详情成功`);
      return JSON.parse(JSON.stringify(data));
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 获取对局${args.失败}详情成功`);
    }
  }

  async getLcuVersion(args, event) {
    const championsDB = Storage.JsonDB.connection('ddragon').db;
    return championsDB.get('version').value();
  }

  async postRunePage(args, event) {
    return await this.service.lcu.useRunePage(args.data);
  }

  async getChampionSkinListById(args, event) {
    try {
      return await this.service.lcu.getChampionSkinListByChampionId(args.championId);
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 获取英雄的皮肤列表失败:${err}`);
    }
  }

  async getChampionSkinImgByUrl(args, event) {
    return await this.service.lcu.getLcuImgBase64(args.url);
  }

  async setBackgroundSkinId(args, event) {
    try {
      const result = await this.service.lcu.setBackgroundSkinId(args);
      if (result.backgroundSkinId) {
        return R.success(null, `切换生涯背景成功`);
      } else {
        return R.fail(`切换生涯背景失败`);
      }
    } catch (err) {
      this.app.logger.error(`[controller:lcu] 设置为生涯背景失败:${err}`);
    }
  }

  // TODO: 发送指定玩家 sendPanelDataBySummonerName
}

module.exports = LcuController;
