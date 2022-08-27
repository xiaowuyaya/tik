import _ from 'loadsh'
import { ddragonConfig } from './config'
import { app } from 'electron'
import path from 'path'


export { translate } from './translate'

export const getLogPath = () => {
  return path.join(app.getPath('userData'), 'logs')
}

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

export const getSpellInfoByName = (spellName: string) => {
  const data: any = ddragonConfig.get('spells')
  const key = _.findKey(data, { name: `${spellName}` })
  return data[key]
}

export const  setHis = (times: number | string = 0) => {
  if (typeof times === 'number') {
    if (times <= 0) {
      return '00:00:00';
    } else {
      // @ts-ignore
      let hh = parseInt(times / 3600); //小时
      let shh = times - hh * 3600;
      // @ts-ignore
      let ii = parseInt(shh / 60);
      let ss = shh - ii * 60;
      return (hh < 10 ? '0' + hh : hh) + ':' + (ii < 10 ? '0' + ii : ii) + ':' + (ss < 10 ? '0' + ss : ss);
    }
  } else {
    return '00:00:00';
  }
}