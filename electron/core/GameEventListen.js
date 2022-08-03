const { gameScreenshot, sendStringInProgress } = require('../utils/win32-hook');
const { request } = require('../utils/league-connect');
const { io } = require('socket.io-client');
const c = require('../utils/cache');
const { Utils, Storage } = require('ee-core');

const SERVER_URI = Utils.getEeConfig().serverUrl;

class GameEventListen {
  constructor(eeApp) {
    this.BASE_URI = 'https://127.0.0.1:2999';
    this.SOCKET_URI = SERVER_URI;
    this.socket = null;
    this.eeApp = eeApp;
    this.gameEventTimer = null;
  }

  /**
   * 事件监听
   */
  async eventListenStart(summonerName) {
    this.eeApp.logger.info(`[gameevent:gameeventlisten] 游戏事件监听开始。`);
    const db = Storage.JsonDB.connection('settings').db;
    const appSettings = db.get('app').value();
    if (!appSettings.heroScreenshot.enable) {
      this.eeApp.logger.info(`[gameevent:gameeventlisten] 荣誉截图设置为关闭`);
      return;
    }  
    let tempData = [];
    this.gameEventTimer = setInterval(async () => {
      const data = await request(`${this.BASE_URI}/liveclientdata/eventdata`);
      if (data == null) return;
      if (data.Events.length != tempData.length) {
        tempData = data.Events;
        const e = data.Events[data.Events.length - 1];
        // 以下开始对事件进行处理
        // 多杀
        if (e.EventName == 'Multikill' && e.KillStreak >= 3) {
          if (e.KillerName == summonerName) {
            if (!appSettings.heroScreenshot.send) {
              gameScreenshot(this.eeApp, `${e.EventName}_${e.KillStreak}`);
            }
          }
        }
        // 五杀团灭
        // if (e.EventName == 'Ace' && e.AcingTeam >= 'ORDER' && e.Acer == '古田县第一中学') {
        //   if (e.KillerName == summonerName) {
        //     if (!appSettings.heroScreenshot.send) {
        //       gameScreenshot(this.eeApp, 'Ace');
        //     }
        //   }
        // }
      }
    }, 150);
  } 

  /**
   * 召唤师技能监听
   */
  async spellListenStart() {
    // this.eeApp.logger.info(`[gameevent:spellListenStart] 召唤师技能监听开始`);
    // const wxopenid = c.get('openid');
    // // socket
    // this.socket = io(this.SOCKET_URI);

    // this.socket.on('connect', () => {
    //   // 加入属于自己的房间
    //   this.socket.emit('joinRoom', { roomId: wxopenid });
    //   this.eeApp.logger.info(`[gameevent:spellListenStart] socket链接成功，已加入房间：${wxopenid}`);
    // });

    // this.socket.on('disconnect', () => {
    //   this.eeApp.logger.info(`[gameevent:spellListenStart] socket链接已断开`);
    // });

    // // 转发对局时间
    // this.socket.on('getGameInfo', async () => {
    //   const data = await request(`${this.BASE_URI}/liveclientdata/gamestats`);
    //   if (data) {
    //     this.socket.emit('gameInfo', { data, roomId: wxopenid });
    //     this.eeApp.logger.info(`[gameevent:spellListenStart] 已发送对局时间到小程序`);
    //   }
    // });

    // // 转发对局列表
    // this.socket.on('getPlayerlist', async () => {
    //   const data = await request(`${this.BASE_URI}/liveclientdata/playerlist`);
    //   let temp = [];
    //   if (data) {
    //     for (var i = 0; i < data.length; i++) {
    //       let player = data[i];
    //       if (player.team == 'CHAOS') {
    //         let info = {};
    //         info.championName = player.championName;
    //         info.summonerName = player.summonerName;
    //         info.championImg = await this.eeApp.service.lcu.getAvatarUrlByChampName(player.championName);
    //         const spellOne = this.eeApp.service.lcu.getSpellInfoByName(player.summonerSpells.summonerSpellOne.displayName);
    //         const spellTwo = this.eeApp.service.lcu.getSpellInfoByName(player.summonerSpells.summonerSpellTwo.displayName);
    //         info.summonerSpells = {
    //           one: {
    //             name: player.summonerSpells.summonerSpellOne.displayName,
    //             img: spellOne.img,
    //             cooldownBurn: spellOne.cooldownBurn,
    //           },
    //           two: {
    //             name: player.summonerSpells.summonerSpellTwo.displayName,
    //             img: spellTwo.img,
    //             cooldownBurn: spellTwo.cooldownBurn,
    //           },
    //         };
    //         temp.push(info);
    //       }
    //     }
    //   }
    //   this.socket.emit('playerlist', { playerlist: temp, roomId: wxopenid });
    //   this.eeApp.logger.info(`[gameevent:spellListenStart] 已发送玩家列表到小程序`);
    // });

    // // 获取小程序点击的技能
    // this.socket.on('handleSpells', async (wsData) => {
    //   // { summonerName: '牛头酋长（电脑）', championName: '牛头酋长', spellName: '治疗术', cooldownBurn: 360 }
    //   const { summonerName, championName, spellName, cooldownBurn } = wsData;
    //   const data = await request(`${this.BASE_URI}/liveclientdata/gamestats`);
    //   const curTime = setHis(parseInt(data.gameTime) + cooldownBurn);
    //   sendStringInProgress(this.eeApp, `${championName}:${summonerName} 已使用 ${spellName}, 技能将在${curTime} 冷却完毕`);
    //   setTimeout(() => {
    //     sendStringInProgress(this.eeApp, `${championName}:${summonerName} 的 ${spellName}冷却时间还剩 30秒`);
    //   }, (cooldownBurn - 30) * 1000);
    //   setTimeout(() => {
    //     sendStringInProgress(this.eeApp, `${championName}:${summonerName} 的 ${spellName}已转好`);
    //   }, cooldownBurn * 1000);
    // });
  }

  /**
   * 停止所有监听
   */
  stop() {
    this.eeApp.logger.info(`[gameevent:stop] 游戏事件监听停止`);
    if (!this.gameEventTimer) return;
    clearInterval(this.gameEventTimer);
    // if (!this.gameTimeTimer) return;
    // this.socket.disconnect();
  }
}

module.exports = GameEventListen;
