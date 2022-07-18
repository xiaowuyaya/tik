'use strict';

const dayjs = require('dayjs');
const { app } = require('electron');

/**
 * 默认配置
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Ee.EeAppConfig}
   **/
  const config = {};

  /* 应用模式配置 */
  config.developmentMode = {
    default: 'vue',
    mode: {
      vue: {
        hostname: 'localhost',
        port: 7333,
      },
      react: {
        hostname: 'localhost',
        port: 3000,
      },
      html: {
        hostname: 'localhost',
        indexPage: 'index.html',
      },
    },
  };

  /**
   * 应用程序顶部菜单
   * boolean | string
   * true, false, 'dev-show'(dev环境显示，prod环境隐藏)
   */
  config.openAppMenu = false;

  /**
   * 主窗口
   * show {boolean} true:立即显示窗口，短暂白屏；false:延迟显示窗口，无白屏
   */
  config.windowsOption = {
    width: 1100,
    height: 680,
    resizable: false, // 大小调整
    fullscreenable: false, // 是否可以全屏
    transparent: true, // 透明背景
    frame: false, // 显示框体
    webPreferences: {
      contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
      nodeIntegration: true,
      allowRunningInsecureContent: true,
    },
  };

  /* ee框架日志 */
  config.logger = {
    appLogName: `tik-${dayjs().format('YYYY-MM-DD')}.log`,
    errorLogName: `tik-error-${dayjs().format('YYYY-MM-DD')}.log`,
  };

  /* 远程web地址 (可选) */
  config.remoteUrl = {
    enable: false, // 是否启用
    url: 'http://lol-tool.com/', // Any web url
  };

  /* 内置socket服务 */
  config.socketServer = {
    enable: false, // 是否启用
    port: 7070, // 默认端口（如果端口被使用，则随机获取一个）
    path: '/socket.io/', // 默认路径名称
    connectTimeout: 45000, // 客户端连接超时时间
    pingTimeout: 30000, // 心跳检测超时时间
    pingInterval: 25000, // 心跳检测间隔
    maxHttpBufferSize: 1e8, // 每条消息的数据最大值 1M
    transports: ['polling', 'websocket'], // http轮询和websocket
    cors: {
      origin: true, // http协议时，要设置允许跨域
    },
  };

  /* 内置http服务 */
  config.httpServer = {
    enable: false, // 是否启用
    port: 7071, // 默认端口（如果端口被使用，则随机获取一个）
    cors: {
      origin: '*', // 跨域
    },
    body: {
      multipart: true,
      formidable: {
        keepExtensions: true,
      },
    },
  };

  /* 主进程 */
  config.mainServer = {
    host: '127.0.0.1',
    port: 7072, // 默认端口（如果端口被使用，则随机获取一个）
  };

  /**
   * 硬件加速
   */
  config.hardGpu = {
    enable: false,
  };

  /* 应用自动升级 (可选) */
  config.autoUpdate = {
    windows: true, // windows平台
    macOS: false, // macOs 需要签名验证
    linux: false, // linux平台
    options: {
      provider: 'generic', // or github, s3, bintray
      url: 'http://qiniu.lol-tool.com/latest', // resource dir, end with '/'
    },
    force: true, // 强制更新（运行软件时，检查新版本并后台下载安装）
  };

  /* 被浏览器唤醒 (可选) */
  config.awakeProtocol = {
    protocol: 'lol-tool', // 自定义协议名（默认你的应用名称-英文）
    args: [],
  };

  /* 托盘 (可选)  */
  config.tray = {
    title: 'tik 英雄联盟对局助手', // 托盘显示标题
    icon: '/public/images/logo.png', // 托盘图标
  };

  config.settings = {
    version: app.getVersion(),
    send: {
      enable: true,
      onlyRank: false,
      matchCount: 5,
      keys: {
        order: [61001],
        chaos: [61009],
        muteAll: [60999],
      },
      blackListNotice: false,
      title: {
        no1: '老大',
        no2: '老二',
        no3: '老三',
        no4: '老四',
        no5: '老六',
      },
    },
    app: {
      quit: '',
      accept: true,
      confirm: false,
      muteAll: false,
      normalAuto: {
        pick: false,
        pickSelect: '',
        ban: false,
        banSelect: '',
      },
      rankAuto: {
        pick: {
          enable: false,
          top: [],
          jungle: [],
          middle: [],
          bottom: [],
          utility: [],
        },
        ban: {
          enable: false,
          top: [],
          jungle: [],
          middle: [],
          bottom: [],
          utility: [],
        },
      },
    },
  };

  return {
    ...config,
  };
};
