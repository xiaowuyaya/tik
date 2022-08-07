const { Service, Storage } = require('ee-core');
const R = require('../utils/res');

class SettingsService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 获取设置
   * @param {*} type send | app | all
   */
  async getSettings(type) {
    try {
      const db = Storage.JsonDB.connection('settings').db;
      const r = type === 'all' ? db.value() : db.get(type).value();
      this.app.logger.info(`[service:settings] 获取配置${type}成功`);
      return R.success(r);
    } catch (err) {
      this.app.logger.error(`[service:settings] 获取配置${type}发生异常:${err}`);
      return R.fail(null,`获取配置${type}发生异常: ${err}`);
    }
  }

  /**
   * 更新设置
   * @param {*} type send or app
   * @param {*} config data
   */
  async updateSettings(type, config) {
    try {
      const db = Storage.JsonDB.connection('settings').db;
      db.set(type, config).write();
      this.app.logger.info(`[service:settings] 更新配置${type}成功`);
      return R.success();
    } catch (err) {
      this.app.logger.error(`[service:settings] 更新配置${type}发生异常:${err}`);
      return R.fail(null,`更新配置${type}发生异常: ${err}`);
    }
  }
}

module.exports = SettingsService;
