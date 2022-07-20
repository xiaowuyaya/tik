'use strict';
const chromeExtension = require('../library/chromeExtension');
const initialize = require('../library/initialize');
const security = require('../library/security');
const credentials = require('../library/credentials');

/**
 * 预加载模块入口
 * @param {Object} app - 全局app对象
 */
module.exports = async (app) => {
  // 项目初始化校验
  initialize.install(app);

  // chrome拓展
  chromeExtension.install();

  // 禁止远程调试
  security.install(app);

  // 获取credentials凭证信息
  credentials.install(app)
};
