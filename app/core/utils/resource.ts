import { ddragonStore } from '../store'
import _ from 'lodash'


/* 获取召唤师头像 */
export function getProfileIcon(profileIcon: string | number) {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIcon}.png`
}

/* 通过英雄id获取头像 */
export function getChampionAvatarById(championId: string | number) {
  const data: any = ddragonStore.get('ddragon.champions')
  const key = _.findKey(data, { championId: `${championId}` }) as string
  const enName = data[key].enName
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

/* 通过英雄英文名获取头像 */
export function getChampionAvatarByEnName(enName: string) {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

/* 通过英雄中文名获取头像 */
export function getChampionAvatarByCnName(cnName: string) {
  const data: any = ddragonStore.get('ddragon.champions')
  const enName = data[cnName].enName
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

/* 获取装备图片 */
export function getItemsAvatarById(id: string | number) {
  return `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`
}

/* 获取召唤师技能信息 */
export function getSpellInfoByName(spellName: string) {
  const data: any = ddragonStore.get('ddragon.spells')
  const key = _.findKey(data, { name: `${spellName}` }) as string
  return data[key]
}

export function setHis(times = 0) {
  if (typeof times === 'number') {
    if (times <= 0) {
      return '00:00:00'
    } else {
      let hh = parseInt(`${times / 3600}`) //小时
      let shh = times - hh * 3600
      let ii = parseInt(`${shh / 60}`)
      let ss = shh - ii * 60
      return (hh < 10 ? '0' + hh : hh) + ':' + (ii < 10 ? '0' + ii : ii) + ':' + (ss < 10 ? '0' + ss : ss)
    }
  } else {
    return '00:00:00'
  }
}
