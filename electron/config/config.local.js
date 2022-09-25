'use strict'

module.exports = appInfo => {
  const config = {}
  /* 开发者工具 */
  config.openDevTools = true

  /* 服务器地址 */
  // config.serverUrl = 'http://localhost:3000'
  config.serverUrl = 'https://tik.lol-tool.com'

  /* 自动更新 */
  config.autoUpdate = {
    windows: true,
    macOS: false,
    linux: false,
    options: {
      provider: 'generic',
      url: 'http://qiniu.lol-tool.ren/latest',
    },
    force: true,
  }

  return {
    ...config,
  }
}
