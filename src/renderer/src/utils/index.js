import { ElMessage } from 'element-plus'
import _ from 'lodash'

/**
 * 获取近期搜索记录
 * @returns {any|*[]}
 */
export function getRecentlySearchList() {
  let data = localStorage.getItem('recently:summoner:search')
  return JSON.parse(data) || []
}

/**
 * 添加搜索记录
 * @param summonerName
 */
export function saveRecentlySearchList(summonerName) {
  let data = getRecentlySearchList()
  const isExit = _.findIndex(data, item => {
    return item === summonerName
  })
  if (isExit !== -1) return
  data.push(summonerName)
  localStorage.setItem('recently:summoner:search', JSON.stringify(data))
}

/**
 * 删除某条搜索记录
 * @param summonerName
 */
export function deleteRecentlySearch(summonerName) {
  let data = getRecentlySearchList()
  _.remove(data, item => {
    return item === summonerName
  })
  localStorage.setItem('recently:summoner:search', JSON.stringify(data))
}

export function clearRecentlySearch() {
  localStorage.removeItem('recently:summoner:search')
}

export function copy(str) {
  try {
    $utils.copyText(str)
    ElMessage({
      message: `复制成功：${str}`,
      grouping: true,
      center: true,
      type: 'success',
    })
  } catch (err) {
    ElMessage({
      message: `复制失败：${str}`,
      grouping: true,
      center: true,
      type: 'error',
    })
    $log.error(`复制异常: ${err}`)
  }
}

/**
 * 一个数字字符串，从右到左每隔3位加入一个逗号(1234567890 --> 1,234,567,890)
 * @param str
 * @returns {*}
 */
export function hh(str) {
  str = String(str)
  if (/\./.test(str)) {
    return str.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![,.]|$)/g, '$&,')
  } else {
    return str.replace(/\d(?=(\d{3})+$)/g, '$&,')
  }
}
