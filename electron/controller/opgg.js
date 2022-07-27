const { Controller, Storage } = require('ee-core');
const R = require('../utils/res');

/**
 * opgg相关控制器
 * @class
 */
class OpggController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 获取位置的英雄数据
   */
  async getChampionsByPosition(args, event) {
    try {
      const db = Storage.JsonDB.connection('ddragon').db;
      const buildId = db.get('opgg').get('buildId').value();

      const resp = await this.app.curl(`https://www.op.gg/_next/data/${buildId}/champions.json?position=${args.position}`, {
        method: 'GET',
        dataType: 'json',
        headers: {
          'accept-language': 'zh-CN,zh;q=0.9',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        },
      });

      // const resp = await request
      //   .get(`https://www.op.gg/_next/data/${buildId}/champions.json?position=${args.position}`)
      //   .set('accept-language', 'zh-CN,zh;q=0.9')
      //   .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36');
      return R.success(resp.data.pageProps, '数据获取成功');
    } catch (err) {
      return R.fail(err.message);
    }
  }

  /**
   * 获取英雄的详细信息
   * 在匹配等模式下获取不到position
   */
  async getDetailByPositionAndName(args, event) {
    try {
      const db = Storage.JsonDB.connection('ddragon').db;
      const buildId = db.get('opgg').get('buildId').value();

      // 如果位置不存在，先去找这个英雄的位置有哪些
      if (!args.position) {
        const championsResp = await this.app.curl(`https://www.op.gg/_next/data/${buildId}/champions.json`, {
          method: 'GET',
          dataType: 'json',
          headers: {
            'accept-language': 'zh-CN,zh;q=0.9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
          },
        });

        const championMetaList = championsResp.data.pageProps.championMetaList;
        // 遍历英雄列表
        for (let i = 0; i < championMetaList.length; i++) {
          const championMeta = championMetaList[i];
          if (championMeta.key == args.championName) {
            // 取第一个位置就好了
            args.position = championMeta.positions[0].name.toLowerCase();
            break;
          }
        }
      }

      const res = await this.app.curl(`https://www.op.gg/_next/data/${buildId}/champions/${args.championName}/${args.position}/build.json`, {
        method: 'GET',
        dataType: 'json',
        headers: {
          'accept-language': 'zh-CN,zh;q=0.9',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        },
      });
      return R.success(res.data.pageProps, '数据获取成功');
    } catch (err) {
      return R.fail(err.message);
    }
  }

  /**
   * 显示英雄数据工具窗口
   */
  async showChampionToolWindow(args, event) {
    return await this.service.opgg.showChampionToolWindow(args);
  }
}

module.exports = OpggController;
