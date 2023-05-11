import { http } from '../utils/request'

/**
 * 获取验证码
 * @returns
 */
export function getCaptcha() {
  return http.request({
    url: '/common/captcha',
    method: 'GET',
  })
}

export function getDoiiRepoAddr() {
  return http.request({
    url: '/web/cdn_addr',
    method: 'GET',
  })
}

export function getNotify() {
  return http.request({
    url: '/web/getNotify',
    method: 'GET',
  })
}

export function getAds() {
  return http.request({
    url: '/web/getAds',
    method: 'GET',
  })
}
