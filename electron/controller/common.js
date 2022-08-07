const { Controller } = require('ee-core');
const R = require('../utils/res');
const { shell } = require('electron');
const c = require('../utils/cache');
const _ = require('lodash');
const fs = require('fs');
const { dialog } = require('electron');
const path = require('path')

class CommonController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 获取应用基本信息
   */
  getAppBase(args, event) {
    const { getAppVersion, getMacAddr, getLogDir, getConfigDir, getScreenSize } = this.service.common;
    const data = {
      appVersion: getAppVersion(),
      macAddr: getMacAddr(),
      logDir: getLogDir(),
      configDir: `${path.join(getConfigDir(), 'data')}`,
      screen: getScreenSize(),
    };
    return R.success(data);
  }

  /**
   * 在浏览器中打开链接
   */
  openUrlInBrower(args, event) {
    shell.openExternal(args.url);
  }

  /**
   * 打开目录
   */
  openDirPath(args, event) {
    shell.openPath(args.path);
  }

  /**
   * 窗口处理
   */
  handleWindow(args, event) {
    //  btn 0：最小化 1：退出
    // quitType 退出方式 0：退出程序， 1：关闭窗口
    const { btn, quitType = null } = args;
    if (btn === 0) {
      this.service.common.mainWMinisize();
    }
    if (btn === 1) {
      this.service.common.handleQuit(quitType);
    }
    return R.success();
  }

  getAllHeroScreenshot(args, event) {
    const r = this.service.common.getAllHeroScreenshot();
    return R.success(r);
  }

  setWxOpenId(args, event) {
    c.put('openid', args.openid);
  }

  checkUpdate(args, event) {
    this.service.common.checkUpdate();
  }

  importBlacklistData(args, event) {
    try {
      const file = dialog.showOpenDialogSync({
        title: '读取旧版黑名单备份文件',
        buttonLabel: '确定',
        filters: [
          {
            // 只读取js文件
            name: 'bans.bak',
            extensions: ['json'],
          },
        ],
      });
      const res = fs.readFileSync(file[0], 'utf-8');
      const bakData = JSON.parse(res)
      let bakList = []
      _.forOwn(bakData, (list, key) => {
        for (let i = 0; i < list.length; i++) {

          if(!list[i].summonerName || !list[i].environment) {
            continue
          }

          let flag = false
          if(bakList.length == 0) {
            bakList.push(list[i])
            continue
          }

          for (let j = 0; j < bakList.length; j++) {
            const element = bakList[j];
            if(element.blackName == list[i].blackName){
              flag = true
              break
            }
          }
          if (flag) {
            break
          }else{
            bakList.push(list[i])

          }
        }
      })
      console.log(bakList);
      for (let k = 0; k < bakList.length; k++) {
        const item = bakList[k];
        if(!item.blackName){
          throw new Error('备份文件格式有误')
        }
      }
      return R.success(bakList);
    } catch (err) {
      return R.fail(null,err);
    }
  }
}

module.exports = CommonController;
