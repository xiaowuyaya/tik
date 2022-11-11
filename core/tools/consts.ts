process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true' // Remove electron security warnings
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist/web')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../../public')
process.env.RESOURCE = app.isPackaged ? join(app.getPath('exe'), '../resources', 'extraResources', ) : join(process.env.DIST_ELECTRON, '../../', 'build/resource')

/**
 * 常量库
 */

import {app} from "electron";
import getmac from 'getmac'
import path, {join} from 'path'

/* 应用名 */
export const APP_NAME = app.name

/* 版本号 */
export const APP_VERSION = app.getVersion()

/* 应用标题 */
export const APP_TITLE = 'Tik英雄联盟对局助手'

/* 机器码 */
export const PC_MAC = getmac()

/* 官网地址 */
export const HOME_URI = 'https://lol-tool.com'

/* 服务器地址 */
export const ROOT_URI = 'https://tik.lol-tool.com'
// export const ROOT_URI = 'http://localhost:3000'

/* http proxy server port */
export const HTTP_PROXY_PORT = 8989

/* 版本校验服务器 */
export const UPDATE_SERVER = 'http://qiniu.lol-tool.com/latest'

/* 日志地址 */
export const LOGS_PATH = path.resolve(app.getPath('userData'), 'logs')

/* 配置文件地址 */
export const CONFIG_PATH = path.resolve(app.getPath('userData'), 'config.json')

/* leagueGameHandle.dll */
export const LEAGUE_GAME_HANDLE_DLL = path.join(process.env.RESOURCE,'leagueGameHandle.dll')

/* proxy.exe */
export const PROXY_EXE_PATH = path.join(process.env.RESOURCE,'proxy.exe')
