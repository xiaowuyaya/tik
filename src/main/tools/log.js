import { resolve } from 'path'
import electronLog from 'electron-log'
import dayjs from 'dayjs'
import { LOGS_PATH } from './constant'

class SystemLogger {
  constructor(logId) {
    this.logId = logId
    this.logFileName = `${dayjs().format('YYYY-MM-DD')}.log`
    this.logger = electronLog.create(logId)

    this.logger.transports.file.resolvePath = () => {
      return resolve(LOGS_PATH, this.logFileName)
    }

    const isDev = process.env.NODE_ENV === 'development' ? ' [dev]' : ''

    this.logger.transports.file.format = `[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]${isDev} {text}`
    this.logger.transports.console.format = '[{level}] {text}'
  }

  log(...params) {
    this.logger.log(...params)
  }

  info(...params) {
    this.logger.info(...params)
  }

  warn(...params) {
    this.logger.warn(...params)
  }

  error(...params) {
    this.logger.error(...params)
  }

  debug(...params) {
    this.logger.debug(...params)
  }

  verbose(...params) {
    this.logger.verbose(...params)
  }
}

export default new SystemLogger('main')
