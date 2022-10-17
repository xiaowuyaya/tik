import { sendStringInProgress } from "../utils/win32"

/**
 * 游戏中事件处理
 */
export class GameEvent {
  constructor() {
    this.muteAllEvent = null
  }

  private muteAllEvent: any

  async handleMuteAll() {
    if (!$store.appStore.get('app.autoMuteAll')) {
      $tools.log.info(`[event] autoMuteAll set: false`)
      return
    }
    $tools.log.info(`[event] autoMuteAll set: true`)

    let tempData: any[] = []
    this.muteAllEvent = setInterval(async () => {
      try {
        const data = await $api.getGameEventdata()
        const gameStatus = await $api.getGameStatus()
        if (gameStatus != 'InProgress') clearInterval(this.muteAllEvent)

        if (!data) return;
        if (data.Events.length != tempData.length) {
          tempData = data.Events;
          const e = data.Events[data.Events.length - 1]; // 取到event对象
          if (e.EventName == 'GameStart') { // 当时间进行到30s的时候mute all
            sendStringInProgress('/mute all              ')
            clearInterval(this.muteAllEvent)
          }
        }
      } catch (err) {
        console.log(err);

      }
    }, 1000)
  }
}

