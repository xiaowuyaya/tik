import { http } from '../utils/request'

/**
 * 用户注册
 * @returns
 */
export function register(data) {
  return http.request({
    url: '/user/register',
    method: 'POST',
    data,
  })
}

/**
 * 用户登陆
 * @param data
 * @returns
 */
export function login(data) {
  return http.request({
    url: '/user/login',
    method: 'POST',
    data,
  })
}

/**
 * 获取我的个人信息
 * @param data
 * @returns
 */
export function getMyUserInfo(data) {
  return http.request({
    url: '/user/getMyInfo',
    method: 'POST',
    data,
  })
}

/**
 * 更新
 * @param data
 * @returns
 */
export function updateUserInfo(data) {
  return http.request({
    url: '/user/updateUserInfo',
    method: 'POST',
    data,
  })
}

export function keepLoginStatus() {
  return http.request({
    url: '/user/keepLoginStatus',
    method: 'POST',
  })
}

export function resetPwd(data) {
  return http.request({
    url: '/user/resetPassword',
    method: 'POST',
    data,
  })
}

export function syncClientUserConfig(data) {
  return http.request({
    url: '/user/syncClientUserConfig',
    method: 'POST',
    data,
  })
}

export function getClientUserConfig(data) {
  return http.request({
    url: '/user/getClientUserConfig',
    method: 'POST',
    data,
  })
}
