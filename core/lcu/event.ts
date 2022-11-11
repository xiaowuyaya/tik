function watchChange(object, onChange) {
  const handler = {
    defineProperty(target, property, descriptor) {
      onChange()
      return Reflect.defineProperty(target, property, descriptor)
    },
    deleteProperty(target, property) {
      onChange()
      return Reflect.deleteProperty(target, property)
    },
  }

  return new Proxy(object, handler)
}

export class LeagueGameEvent {

  private muteAllEvent: any

  constructor() {
    this.muteAllEvent = null
  }

  async handleAutoMuteAll() {
    if (!$store.appStore.get('app.autoMuteAll')) {
      $log.info(`[event] autoMuteAll set: false`)
      return
    }
    $log.info(`[event] autoMuteAll set: true`)

    const proxyData = watchChange({}, () => {
      const res =  $utils.sendMsgInLeagueGame('w s a  你好呀')
      if(res == 1) clearInterval(this.muteAllEvent)
    })

    this.muteAllEvent = setInterval(async () => {
      try {
        const data = await $api.getGameEventdata()
        const gameStatus = await $api.getGameStatus()
        // @ts-ignore
        if (gameStatus != 'InProgress') clearInterval(this.muteAllEvent)

        if (data != null) proxyData.event = data.Events
      } catch (err) {
      }
    },2000)
  }
}