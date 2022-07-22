// const BASE_URI = 'https://127.0.0.1:2999'

class GameEventListen {
  constructor(event) {
    this.event = event;
    this.gameEventTimer = null;
    this.gameTimeTimer = null;
  }

  /**
   * 事件监听
   */
  eventListenStart(){}

  /**
   * 对局时间监听
   */
  timeListenStart(){}

  /**
   * 停止所有监听
   */
  stop(){}
}
