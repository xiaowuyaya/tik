import { http } from '../utils/request'

export function checkVipConfirmStatus() {
  return http.request({
    url: '/vip/checkVipConfirmStatus',
    method: 'POST',
  })
}

export function recordVipConfirmStatus(confirmStatus) {
  return http.request({
    url: '/vip/recordVipConfirmStatus',
    method: 'POST',
    data: { confirmStatus },
  })
}

export function checkVipAvailability() {
  return http.request({
    url: '/vip/checkVipAvailability',
    method: 'POST',
  })
}

export function checkBingXueVipAvailability() {
  return http.request({
    url: '/vip/checkBingXueVipAvailability',
    method: 'POST',
  })
}

export function bindSecretCode(code) {
  return http.request({
    url: '/vip/bindSecretCode',
    method: 'POST',
    data: { code },
  })
}
