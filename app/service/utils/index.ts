import _ from 'loadsh'
import { ddragonConfig } from './ddragon' 


export { translate } from './translate'

export const getProfileIcon = (profileIcon: string) => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIcon}.png`
}

export const getChampionAvatarById = (championId: string, ) => {
  const data = ddragonConfig.store
  const enName = _.findKey(data, {key: `${championId}`})
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

export const getChampionAvatarByEnName = (enName: string, ) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}