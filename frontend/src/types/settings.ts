
export interface Settings {
  version: string
  send: SendSettings
  app: AppSettings
}

export interface SendSettings {
  enable: boolean
  onlyRank: boolean
  blackListNotice: boolean
  matchCount: number
  keys: {
    order: number[]
    chaos: number[]
    muteAll: number[]
  },
  title: {
    no1: string
    no2: string
    no3: string
    no4: string
    no5: string
  }
}

export interface AppSettings {
  quit: string
  rememberQuit: boolean
  accept: boolean
  confirm: boolean
  muteAll: boolean
  normalAuto: {
    pick: boolean
    ban: boolean
    pickSelect: string
    banSelect: string
  },
  rankAuto: {
    pick: {
      enable: boolean
      top: number[]
      jungle: number[]
      middle: number[]
      bottom: number[]
      utility: number[]
    },
    ban: {
      enable: boolean
      top: number[]
      jungle: number[]
      middle: number[]
      bottom: number[]
      utility: number[]
    }
  }
}