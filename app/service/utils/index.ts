import _ from 'loadsh'
import { ddragonConfig } from './config'


export { translate } from './translate'

export const getProfileIcon = (profileIcon: string) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIcon}.png`
}

export const getChampionAvatarById = (championId: string,) => {
  const data: any = ddragonConfig.get('champions')
  const key = _.findKey(data, { championId: `${championId}` })
  const enName = data[key].enName
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

export const getChampionAvatarByEnName = (enName: string,) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

export const getChampionAvatarByCnName = (cnName: string,) => {
  const data: any = ddragonConfig.get('champions')
  const enName = data[cnName].enName
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

export const getItemsAvatarById = (id: string) => {
  return `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`
}