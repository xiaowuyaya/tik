const { Controller } = require('ee-core');

class ConfigController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  async getAllConfig(args, event) {
    return await this.service.config.getAllConfig();
  }

  async getConfigByField(args, event) {
    return await this.service.config.getConfigByField(args.field);
  }

  async updateConfigByField(args, event) {
    return await this.service.config.updateConfigByField(args.field, args.data);
  }
}

module.exports = ConfigController;
