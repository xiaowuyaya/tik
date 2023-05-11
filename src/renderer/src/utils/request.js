import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, removeToken } from './auth'
import router from '../router'

const CancelToken = axios.CancelToken
let sources = []

// 取消函数
let removeSource = config => {
  for (let item in sources) {
    if (sources[item].umet === config.url + '&' + config.method) {
      sources[item].cancel('已取消重复请求，请勿重复请求')
      sources.splice(item, 1)
    }
  }
}

class AxiosHttpRequest {
  constructor() {
    this.baseURL = $constant.ROOT_URI
    this.timeout = 60000
  }

  getConfigParams() {
    return {
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {},
    }
  }

  interceptors(instance) {
    instance.interceptors.request.use(
      config => {
        removeSource(config)

        config.cancelToken = new CancelToken(c => {
          sources.push({ umet: config.url + '&' + config.method, cancel: c })
        })

        config.headers['Authorization'] = getToken()
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        config.params = { ...config.params }
        // config.params = { ...config.params, _t: Date.now() } 更改接口cdn缓存为不缓存， 这里可以不用了

        if (config.method === 'get' && config.params) {
          let url = config.url + '?'
          for (const propName of Object.keys(config.params)) {
            const value = config.params[propName]
            let part = encodeURIComponent(propName) + '='
            if (value !== null && typeof value !== 'undefined') {
              if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                  let params = propName + '[' + key + ']'
                  let subPart = encodeURIComponent(params) + '='
                  url += subPart + encodeURIComponent(value[key]) + '&'
                }
              } else {
                url += part + encodeURIComponent(value) + '&'
              }
            }
          }
          url = url.slice(0, -1)
          config.params = {}
          config.url = url
        }
        return config
      },
      err => {
        return Promise.reject(err)
      }
    )

    instance.interceptors.response.use(
      res => {
        removeSource(res.config)

        const code = res.data['code'] || 200
        let msg = res.data['msg'] || ''

        if (code === 200) {
          return Promise.resolve(res.data)
        }

        if (code !== 50003) {
          ElMessage({
            message: msg,
            grouping: true,
            center: true,
            type: 'error',
          })
        }

        if (code === 11001 || code === 11002 || code === 11014) {
          ElMessageBox.alert('当前登入的TikLeagueTool账号过期，请重新登入', '登入过期', {
            type: 'error',
            confirmButtonText: '重新登入',
            showClose: false,
            appendTo: 'body',
            customClass: 'no-drag',
            draggable: true,
            callback: () => {
              removeToken()
              router.push('/Login')
            },
          })
        }

        if (code === 500 && msg === '未能读取到有效Token') {
          removeToken()
          router.push('/Login')
        }
        return Promise.reject(res.data)
      },
      err => {
        if (err.message === 'Network Error') {
          err.message = 'Network Error'
        } else if (err.message.includes('timeout')) {
          err.message = 'timeout'
        } else if (err.message.includes('Request failed with status code')) {
          err.message = '系统接口' + err.message.substr(err.message.length - 3) + '异常'
        }
        ElMessage({
          message: err.message,
          grouping: true,
          center: true,
          type: 'warning',
        })
        return Promise.reject(err)
      }
    )
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getConfigParams(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export const http = new AxiosHttpRequest()
