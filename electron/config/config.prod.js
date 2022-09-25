'use strict';

module.exports = (appInfo) => {
  const config = {};
  /* 开发者工具 */
  config.openDevTools = false;

  /* 服务器地址 */
  config.serverUrl = 'https://tik.lol-tool.com';

  /* 自动更新 */
  config.autoUpdate = {
    windows: true,
    macOS: false,
    linux: false,
    options: {
      provider: 'generic',
      url: 'http://qiniu.lol-tool.com/latest',
    },
    force: true,
  };

  return {
    ...config,
  };
};
