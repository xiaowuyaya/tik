/**
 * 日志实例
 */

import path from 'path'
import electronLog, { ElectronLog } from 'electron-log'
import dayjs from 'dayjs'
import { LOGS_PATH } from '../consts'

export class SystemLogger {
  public logger: ElectronLog
  public logId: string
  public logFileName: string

  constructor(logId: string) {
    this.logId = logId
    this.logFileName = `tik-${dayjs().format('YYYY-MM-DD')}.log`
    this.logger = electronLog.create(logId)

    this.logger.transports.file.resolvePath = () => {
      return path.resolve(LOGS_PATH, this.logFileName)
    }

    const isDev = process.env.NODE_ENV === 'development' ? ' [dev]' : ''

    this.logger.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]${isDev} {text}`
    this.logger.transports.console.format = '[{level}] {text}'
  }

  log(...params: any[]): void {
    this.logger.log(...params)
  }

  info(...params: any[]): void {
    this.logger.info(...params)
  }

  warn(...params: any[]): void {
    this.logger.warn(...params)
  }

  error(...params: any[]): void {
    this.logger.error(...params)
  }

  debug(...params: any[]): void {
    this.logger.debug(...params)
  }

  verbose(...params: any[]): void {
    this.logger.verbose(...params)
  }
}