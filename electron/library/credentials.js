const { authenticate } = require('league-connect');
const c = require('../utils/cache');
const { registerClient, registerWebsocket } = require('../core/monitor')

/* lcu 凭证 */
module.exports = {
  async install(eeApp) {
    let credentials = null;
    try {
      let authenticationOptions = [
        {
          windowsShell: 'cmd',
          useDeprecatedWmic: true,
        },
        {
          windowsShell: 'powershell',
          useDeprecatedWmic: false,
        },
      ];
      try {
        credentials = await authenticate(authenticationOptions[0]);
      } catch (error) {
        // 部分win7以上电脑没有wimc，采用pws方式获取凭证
        credentials = await authenticate(authenticationOptions[1]);
      }
      eeApp.logger.info(`[credentials] 获取credentials成功`);

      // 启用客户端相关监听方法
      registerClient();
      await registerWebsocket();
    } catch (err) {
      eeApp.logger.info(`[credentials] 发送异常: ${err}`);
    }
    c.put('credentials', credentials);
    // 将结果装发给转发到渲染进程
    eeApp.electron.mainWindow.webContents.send('controller.lcu.enable', credentials);
  },
};
