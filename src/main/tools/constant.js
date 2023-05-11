process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
process.env.RESOURCE = app.isPackaged ? join(app.getPath('exe'), '../resources', 'extraResources') : join(__dirname, '../../', 'resources')

import { join, resolve } from 'path'
import { app } from 'electron'

const getMac = require('getmac').default

/* 应用名 */
export const APP_NAME = 'TikLeagueTool'

/* APP_ID */
export const APP_ID = 'cc.doii.tik.app'

/* 版本号 */
export const APP_VERSION = app.getVersion()

/* 机器码 */
export const PC_MAC = getMac()

/* 官网地址 */
export const HOME_URI = 'https://tik.doii.cc'

/* api地址 */
export const ROOT_URI = 'http://tik-api.doii.cc'

/* socket地址 */
export const SOCKET_URI = 'http://tik-socket.doii.cc'

/* 服务器地址 */
// export const ROOT_URI = 'http://localhost:7000'
// export const SOCKET_URI = '127.0.0.1:7001'

/* 日志地址 */
export const LOGS_PATH = resolve(app.getPath('userData'), 'logs')

/* 配置文件地址 */
export const CONFIG_PATH = resolve(app.getPath('exe'), '..', 'config')

/* DLL目录 */
export const DLL_PATH = resolve(process.env.RESOURCE, 'lib')

export const BROWSER_VIEW_TEMPLATE = {
  center: true,
  icon: join(process.env.RESOURCE, 'icon_32.ico'),
  show: false,
  frame: false,
  resizable: false,
  transparent: false,
  hasShadow: true,
  isMultiWindow: false,
  useContentSize: true,
  panel: true,
  autoHideMenuBar: true,
  backgroundColor: '#00000000',
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    enableRemoteModule: true,
    plugins: true,
    nodeIntegration: true,
    contextIsolation: false,
    backgroundThrottling: false,
    nativeWindowOpen: false,
    webSecurity: false,
    sandbox: false,
  },
}

export const RIOT_GAMES_CERT = `
-----BEGIN CERTIFICATE-----
MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC
VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET
MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp
bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1
dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft
ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV
BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p
Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu
ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0
ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv
dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/
6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj
21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv
JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC
y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr
ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX
8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs
lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k
WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO
q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP
SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5
EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L
XWehWA==
-----END CERTIFICATE-----
`
