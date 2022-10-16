import { http } from "../utils";

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

export function getOpggChampionsByPosition(position: string){
  return http.request({
    url: '/common/getOpggChampionsByPosition',
    method: 'GET',
    params: {position}
  })
}

export function getOpggChampionDetail(championName: string , position: string){
  return http.request({
    url: '/common/getOpggChampionDetail',
    method: 'GET',
    params: {championName, position}
  })
}

export function getOpggChampionsAram(){
  return http.request({
    url: '/common/getOpggChampionsAram',
    method: 'GET',
  })
}

export function getOpggChampionAramByName(championName: string){
  return http.request({
    url: '/common/getOpggChampionAramByName',
    method: 'GET',
    params: {championName}
  })
}