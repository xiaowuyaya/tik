'use strict'

module.exports = (appInfo) => {
  const config = {}
  /* 开发者工具 */
  config.openDevTools = true

  /* 服务器地址 */
  // config.serverUrl = 'http://localhost:3000'
  config.serverUrl = 'https://tik.lol-tool.com';

  /* 自动更新 */
  config.autoUpdate = {
    windows: true, // windows平台
    macOS: false, // macOs 需要签名验证
    linux: false, // linux平台
    options: {
      provider: 'generic', // or github, s3, bintray
      url: 'http://qiniu.eiko.ren/latest' // resource dir, end with '/'
    },
    force: true, // 强制更新（运行软件时，检查新版本并后台下载安装）
  }

  return {
    ...config
  }
}
