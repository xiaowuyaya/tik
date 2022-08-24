import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Message, Modal } from '@arco-design/web-vue';
import { getToken, removeToken } from './auth'

// 接口类型和方法
interface BaseType {
  baseURL: string
  getConfigParams(): any
  interceptors(instance: AxiosInstance, url: string | number | undefined): any
  request(options: AxiosRequestConfig): any
}

interface AxiosRequestType {
  baseURL?: string
  url?: string | undefined
  data?: any
  params?: any
  method?: string
  headers?: any
  timeout?: number
  value?: any
  cancelToken?: any
}

// 取消重复请求
const CancelToken = axios.CancelToken
// 用于存储每个请求的取消函数以及对应标识
let sources: any = []

// 取消函数
let removeSource = (config: any) => {
  for (let item in sources) {
    if (sources[item].umet === config.url + '&' + config.method) {
      sources[item].cancel('已取消重复请求，请勿重复请求')
      sources.splice(item, 1)
    }
  }
}

class AxiosHttpRequest implements BaseType {
  baseURL: string
  timeout: number

  constructor() {
    // this.baseURL = "https://tik.lol-tool.com"
    this.baseURL = "http://localhost:3000"
    this.timeout = 15000
  }

  getConfigParams() {
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {},
    }
    return config
  }
  // 拦截设置
  interceptors(instance: AxiosInstance, _url: string | number | undefined) {

    // 请求拦截
    instance.interceptors.request.use((config: AxiosRequestType) => {
      // 取消重复请求
      removeSource(config)
      config.cancelToken = new CancelToken((c) => {
        // 将取消函数存起来
        sources.push({ umet: config.url + '&' + config.method, cancel: c })
      })
      // 请求头携带token
      config.headers['Authorization'] = getToken()
      config.headers['Content-Type'] = 'application/json;charset=utf-8'

      // 添加时间戳
      // config.data = {...config.data, _t: Date.now()}
      config.params = {...config.params, _t: Date.now()}

      // get请求映射params参数
      if (config.method === 'get' && config.params) {
        let url = config.url + '?'
        for (const propName of Object.keys(config.params)) {
          const value = config.params[propName]
          var part = encodeURIComponent(propName) + '='
          if (value !== null && typeof value !== 'undefined') {
            if (typeof value === 'object') {
              for (const key of Object.keys(value)) {
                let params = propName + '[' + key + ']'
                var subPart = encodeURIComponent(params) + '='
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
    }, (err) => { return Promise.reject(err) })

    // 响应拦截
    instance.interceptors.response.use((res: any) => {
      // 取消重复请求
      // removeSource(res.config)

      // 未设置状态码则默认成功状态
      const code = res.data['code'] || 200
      // 获取错误信息
      let msg = res.data['msg'] || ''
      if (code === 200) {
        return Promise.resolve(res.data)
      } else {
        Message.error({
          content: msg,
          duration: 2000
        })
        if (code == 11001 || code == 11002) {
          Modal.error({
            title: '登入状态异常',
            content:
              '当前登入状态异常，请重新登入。',
            okText: '重新登入',
            maskClosable: false,
            escToClose: false,
            simple: true,
            async onOk() {
              removeToken()
              window.location.reload();
            },
          });
        }
        return Promise.reject(res.data)
      }
    }, (err) => {
      let { message } = err
      if (message == 'Network Error') {
        message = '后端接口连接异常'
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时'
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常'
      }
      Message.warning({
        content: message,
        duration: 3000
      })
      return Promise.reject(err)
    })
  }

  /**
 * 外部调用方法
 * @param options axios请求参数
 * @returns 实例
 */
  request(options: AxiosRequestConfig) {
    const instance = axios.create()
    options = Object.assign(this.getConfigParams(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

// 实例化请求类
const http = new AxiosHttpRequest()

export default http