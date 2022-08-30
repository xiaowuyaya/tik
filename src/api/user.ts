import http from "@/utils/request";

export interface CreateClientUser {
  username: string;
  password: string;
  nickName?: string;
  email?: string;
  phone?: string;
  remark?: string;
  avatarUrl?: string;
  status?: number;
}

export interface LoginClientUserDto {
  username: string;
  password: string;
  mac: string;
  captchaId: string;
  clientVersion: string;
  verifyCode: string;
}

export interface MyInfoDto {
  mac: string;
  clientVersion: string;
}

export interface updateClientUserInfoDto {
  nickName?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  remark?: string;
  status?: number;
}

/**
 * 用户注册
 * @returns 
 */
export function register(data: CreateClientUser) {
  return http.request({
    url: '/user/register',
    method: 'POST',
    data
  })
}

/**
 * 用户登陆
 * @param data 
 * @returns 
 */
export function login(data: LoginClientUserDto) {
  return http.request({
    url: '/user/login',
    method: 'POST',
    data
  })
}

/**
 * 获取我的个人信息
 * @param data 
 * @returns 
 */
export function getMyInfo(data: MyInfoDto) {
  return http.request({
    url: '/user/getMyInfo',
    method: 'POST',
    data
  })
}

/**
 * 更新
 * @param data 
 * @returns 
 */
export function updateUserInfo(data: updateClientUserInfoDto){
  return http.request({
    url: '/user/updateUserInfo',
    method: 'POST',
    data
  })
}


export function keepLoginStatus() {
  return http.request({
    url: '/user/keepLoginStatus',
    method: 'POST',
  })
}