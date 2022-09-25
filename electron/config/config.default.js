'use strict'
const dayjs = require('dayjs')
const { join } = require('path')

module.exports = appInfo => {
  const config = {}

  config.developmentMode = {
    default: 'vue',
    mode: {
      vue: {
        hostname: 'localhost',
        port: 3344,
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
  }

  config.openDevTools = false

  config.openAppMenu = false

  config.windowsOption = {
    title: 'Tik 英雄联盟对局助手',
    center: true,
    show: true,
    frame: false,
    resizable: false,
    width: 1200,
    height: 720,
    transparent: true,
    webPreferences: {
      preload: join(__dirname, '../core/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  }

  config.logger = {
    appLogName: `tik-${dayjs().format('YYYY-MM-DD')}.log`,
    errorLogName: `tik-error-${dayjs().format('YYYY-MM-DD')}.log`,
  }

  config.remoteUrl = {
    enable: false,
    url: 'http://lol-tool.com/',
  }

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
  }

  /* 内置http服务 */
  config.httpServer = {
    enable: false, // 是否启用
    https: {
      enable: false,
      key: '/public/ssl/localhost+1.key', // key文件
      cert: '/public/ssl/localhost+1.pem', // cert文件
    },
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
  }

  /* 主进程 */
  config.mainServer = {
    host: '127.0.0.1',
    port: 3344, // 默认端口（如果端口被使用，则随机获取一个）
  }

  /**
   * 硬件加速
   */
  config.hardGpu = {
    enable: false,
  }

  /* 应用自动升级 (可选) */
  config.autoUpdate = {
    windows: true, // windows平台
    macOS: false, // macOs 需要签名验证
    linux: false, // linux平台
    options: {
      provider: 'generic', // or github, s3, bintray
      url: 'http://qiniu.lol-tool.com/vip/latest', // resource dir, end with '/'
    },
    force: true, // 强制更新（运行软件时，检查新版本并后台下载安装）
  }

  config.awakeProtocol = {
    protocol: 'tik',
    args: [],
  }

  config.tray = {
    title: 'Tik 英雄联盟对局助手',
  }

  return {
    ...config,
  }
}
