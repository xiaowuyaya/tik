import http from "@/utils/request";

export function bindKamiCode(data) {
  return http.request({
    url: '/vip/bindKamiCode',
    method: 'POST',
    data
  })
}

export function wasVip() {
  return http.request({
    url: '/vip/wasVip',
    method: 'POST',
  })
}

export function toBeTempVip() {
  return http.request({
    url: '/vip/toBeTempVip',
    method: 'POST',
  })
}

export function vipCheck() {
  return http.request({
    url: '/vip/vipCheck',
    method: 'POST',
  })
}