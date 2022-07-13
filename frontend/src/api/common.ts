import http from "@/utils/request";

/**
 * 获取验证码
 * @returns 
 */
export function getCaptcha(){
  return http.request({
    url: '/common/captcha',
    method: 'GET'
  })
}