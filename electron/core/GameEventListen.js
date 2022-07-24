const { gameScreenshot } = require('../utils/win32-hook');
const { request } = require('../utils/league-connect');
class GameEventListen {
  constructor(eeApp) {
    this.BASE_URI = 'https://127.0.0.1:2999';
    this.eeApp = eeApp;
    this.gameEventTimer = null;
    this.gameTimeTimer = null;
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

  /**
   * 对局时间监听
   */
  timeListenStart() {}

  /**
   * 停止所有监听
   */
  stop() {
    this.eeApp.logger.info(`[gameevent:stop] 游戏事件监听停止`);
    if (!this.gameEventTimer) return;

    clearInterval(this.gameEventTimer);
  }
}

module.exports = GameEventListen;
