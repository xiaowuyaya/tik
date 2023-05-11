import { http } from '../utils/request'

/**
 * 添加黑名单成员
 * @returns
 */
export function addBlacklist(data) {
  return http.request({
    url: '/blacklist/add',
    method: 'POST',
    data,
  })
}

/**
 * 更新黑名单成员
 * @returns
 */
export function updateBlacklist(data) {
  return http.request({
    url: '/blacklist/update',
    method: 'POST',
    data,
  })
}

/**
 * 删除
 * @returns
 */
export function deleteBlacklist(data) {
  return http.request({
    url: '/blacklist/delete',
    method: 'POST',
    data,
  })
}

/**
 * 分页查询
 * @returns
 */
export function pageBlacklist(data) {
  return http.request({
    url: '/blacklist/page',
    method: 'POST',
    data,
  })
}

/**
 * 获取当前账号下所有的黑名单信息
 * @returns
 */
export function getAllBlacklist() {
  return http.request({
    url: '/blacklist/getAllBlacklist',
    method: 'get',
  })
}

export function getRankPage(data) {
  return http.request({
    url: '/blacklist/getRankPage',
    method: 'POST',
    data,
  })
}

export function getReasonByBanName(banName) {
  return http.request({
    url: '/blacklist/getReasonByBanName',
    method: 'POST',
    data: { banName },
  })
}
