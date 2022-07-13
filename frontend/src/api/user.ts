import http from "@/utils/request";

interface CreateClientUser {
  username: string;
  password: string;
  nickName?: string;
  email?: string;
  phone?: string;
  remark?: string;
  avatarUrl?: string;
  status?: number;
}

interface LoginClientUserDto {
  username: string;
  password: string;
  mac: string;
  captchaId: string;
  clientVersion: string;
  verifyCode: string;
}

/**
 * 用户注册
 * @returns 
 */
export function register(data: CreateClientUser){
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
export function login(data: LoginClientUserDto){
  return http.request({
    url: '/user/login',
    method: 'POST',
    data
  })
}