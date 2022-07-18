const { Controller } = require('ee-core');

class SettingsController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  async getSettings(args, event) {
    const { type } = args;
    return await this.service.settings.getSettings(type);
  }

  async updateSettings(args, event) {
    const { type, config } = args;
    return await this.service.settings.updateSettings(type, config);
  }
}

module.exports = SettingsController;
