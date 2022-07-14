'use strict';
const chromeExtension = require('../library/chromeExtension')
const security = require('../library/security')

/**
 * 预加载模块入口
 * @param {Object} app - 全局app对象
 */
module.exports = async (app) => {


  // chrome拓展
  chromeExtension.install()

  // 禁止远程调试
  security.install()

}
