import Store from 'electron-store'

/**
 * 黑名单本地配置
 */
export const blacklistStore = new Store({
  defaults: {
    blacklist: [],
  },
})
