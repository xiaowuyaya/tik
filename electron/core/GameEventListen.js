const { gameScreenshot } = require('../utils/win32-hook');
const { request } = require('../utils/league-connect');
const { io } = require('socket.io-client');
const c = require('../utils/cache');
class GameEventListen {
  constructor(eeApp) {
    this.BASE_URI = 'https://127.0.0.1:2999';
    this.SOCKET_URI = 'http://localhost:3001/game_event';
    this.eeApp = eeApp;
    this.gameEventTimer = null;
    this.gameTimeTimer = null;

    // socket
    this.socket = io(this.SOCKET_URI);
    this.socket.on('connect', () => {
      // 加入属于自己的房间
      const wxopenid = c.get('openid');
      this.socket.emit('joinRoom', { roomId: "123" });
    });

    this.socket.on('disconnect', () => {
      console.log('ws链接已断开');
    });
  }

  /**
   * 事件监听
   */
  async eventListenStart(summonerName) {
    this.eeApp.logger.info(`[gameevent:gameeventlisten] 游戏事件监听开始。`);
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
            gameScreenshot(this.eeApp, `${e.EventName}_${e.KillStreak}`);
          }
        }
        // 五杀团灭
        if (e.EventName == 'Ace' && e.AcingTeam >= 'ORDER' && e.Acer == '古田县第一中学') {
          if (e.KillerName == summonerName) {
            gameScreenshot(this.eeApp, 'Ace');
          }
        }
      }
    }, 150);
  }

  async spellListenStart() {
    this.gameTimeTimer = setInterval(async()=>{
      const data = await request(`${this.BASE_URI}/liveclientdata/gamestats`);
      // {
      //   gameMode: 'CLASSIC',
      //   gameTime: 424.88067626953125,
      //   mapName: 'Map11',
      //   mapNumber: 11,
      //   mapTerrain: 'Default'
      // }
      if (data == null) return;
      this.socket.emit('message', data);
    },1000)
  }

  /**
   * 停止所有监听
   */
  stop() {
    this.eeApp.logger.info(`[gameevent:stop] 游戏事件监听停止`);
    if (!this.gameEventTimer) return;
    clearInterval(this.gameEventTimer);
    if (!this.gameTimeTimer) return;
    clearInterval(this.gameTimeTimer);
  }
}

module.exports = GameEventListen;
