export class LeagueGameEvent {
  constructor() {
    this.gameEvent = null
  }

  async start() {
    this.gameEvent = setInterval(async () => {
      try {
        const data = await $api.getGameStatusInfo()
        if (!data) return
        if (data.gameTime >= 6) {
          /* 自动禁言处理 */
          if ($store.appConfigStore.get('autoMute')) {
            $log.info(`[event] autoMuteAll set: true`)
            for (let i = 0; i <= 3; i++) {
              const res = $utils.sendMessage(' /mute all', 'ALL')
              if (res == 1) break
            }
          } else {
            $log.info(`[event] autoMuteAll set: false`)
          }

          clearInterval(this.gameEvent)
        }
      } catch (err) {
        clearInterval(this.gameEvent)
      }
    }, 2000)
  }
}
