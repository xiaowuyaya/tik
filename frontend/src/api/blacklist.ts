import http from "@/utils/request";

export interface CreatBlacklist {
  environment: string;
  summonerId: string;
  banId?: string;
  banName: string;
  reason: string;
}

export interface UpdateBlacklist {
  id: number;
  banName: string;
  reason: string;
}

export interface DeleteBlacklist {
  ids: number[];
}

export interface pageBlacklist {
  environment: string;
  summonerId: string;
  filter?: string;
  page: number;
  limit: number;
}

/**
 * 添加黑名单成员
 * @returns 
 */
export function addBlacklist(data: CreatBlacklist){
  return http.request({
    url: '/blacklist/add',
    method: 'POST',
    data
  })
}

/**
 * 更新黑名单成员
 * @returns 
 */
 export function updateBlacklist(data: UpdateBlacklist){
  return http.request({
    url: '/blacklist/update',
    method: 'POST',
    data
  })
}

/**
 * 删除
 * @returns 
 */
 export function deleteBlacklist(data: DeleteBlacklist){
  return http.request({
    url: '/blacklist/delete',
    method: 'POST',
    data
  })
}

/**
 * 分页查询
 * @returns 
 */
 export function pageBlacklist(data: pageBlacklist){
  return http.request({
    url: '/blacklist/page',
    method: 'POST',
    data
  })
}

/**
 * 获取当前账号下所有的黑名单信息
 * @returns 
 */
export function getAllBlacklist() {
  return http.request({
    url: '/blacklist/getAllBlacklist',
    method: 'get'
  })
}