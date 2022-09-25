const { ddragonConfig } = require('../store')
const _ = require('lodash')

exports.translate = require('./translate').translate

exports.getProfileIcon = profileIcon => {
  return `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${profileIcon}.png`
}

exports.getChampionAvatarById = championId => {
  const data = ddragonConfig.get('champions')
  const key = _.findKey(data, { championId: `${championId}` })
  const enName = data[key].enName
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

exports.getChampionAvatarByEnName = enName => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

exports.getChampionAvatarByCnName = cnName => {
  const data = ddragonConfig.get('champions')
  const enName = data[cnName].enName
  return `https://game.gtimg.cn/images/lol/act/img/champion/${enName}.png`
}

exports.getItemsAvatarById = id => {
  return `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`
}

exports.getSpellInfoByName = spellName => {
  const data = ddragonConfig.get('spells')
  const key = _.findKey(data, { name: `${spellName}` })
  return data[key]
}

exports.setHis = (times = 0) => {
  if (typeof times === 'number') {
    if (times <= 0) {
      return '00:00:00'
    } else {
      // @ts-ignore
      let hh = parseInt(`${times / 3600}`) //小时
      let shh = times - hh * 3600
      // @ts-ignore
      let ii = parseInt(`${shh / 60}`)
      let ss = shh - ii * 60
      return (hh < 10 ? '0' + hh : hh) + ':' + (ii < 10 ? '0' + ii : ii) + ':' + (ss < 10 ? '0' + ss : ss)
    }
  } else {
    return '00:00:00'
  }
}
