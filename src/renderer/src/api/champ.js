/**
 * 本地请求opgg数据，请求到则缓存下来，在应用启动期间如果需要获取相同的数据则从本地取1·
 */

import axios from 'axios'

export async function champsRankData(tier = 'diamond') {
  const cache = $cache.get(`opgg:champ_rank:${tier}`)
  if (cache) return cache
  const resp = await axios.get(`https://lol-api-champion.op.gg/api/KR/champions/ranked?tier=${tier}`)
  $cache.set(`opgg:champ_rank:${tier}`, resp.data)
  return resp.data
}

export async function champsDataByMode(mode) {
  const cache = $cache.get(`opgg:champs_:${mode}`)
  if (cache) return cache
  const resp = await axios.get(`https://lol-api-champion.op.gg/api/kr/champions/${mode}`)
  $cache.set(`opgg:champs_:${mode}`, resp.data)
  return resp.data
}

// export async function champRune(mode, champId, position) {
//   const resp = await axios.get(`https://lol-api-champion.op.gg/api/kr/champions/${mode}/${champId}${mode == 'rank'? `/${position.toLowerCase()}` : '/none'}?tier=all`)
//   return resp.data
// }

export async function champsDetail(mode, champId, position = null) {
  if (mode === 'rank') {
    if (!position) {
      // 如果位置为空 则去查最常用的位置信息
      const champs = await champsRankData()
      for (let i = 0; i < champs.data.length; i++) {
        const champ = champs.data[i]
        if (champ.id == champId) {
          if (champ.positions.length != 0) {
            position = champ.positions[0].name.toLowerCase()
          } else {
            position = 'mid'
          }
          break
        }
      }
    }
    const cache = $cache.get(`opgg:champs:${champId}:${position}`)
    if (cache) return cache
    const resp = await axios.get(`https://lol-api-champion.op.gg/api/KR/champions/ranked/${champId}/${position}`)
    const result = {
      champ: resp.data.data,
      position: position,
    }
    $cache.set(`opgg:champs:${champId}:${position}`, result)
    return result
  } else {
    const cache = $cache.get(`opgg:champs:${champId}:${mode}`)
    if (cache) return cache
    const resp = await axios.get(`https://lol-api-champion.op.gg/api/kr/champions/${mode}/${champId}/none`)
    const result = {
      champ: resp.data.data,
      position: mode.toUpperCase(),
    }
    $cache.set(`opgg:champs:${champId}:${mode}`, result)
    return result
  }
}

export async function getChampInfo(champId) {
  const res = await axios.get(`https://game.gtimg.cn/images/lol/act/img/js/hero/${champId}.js`)
  return res.data
}
