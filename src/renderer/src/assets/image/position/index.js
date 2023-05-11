import bottom from './Position_Diamond-Bot.png'
import jungle from './Position_Diamond-Jungle.png'
import middle from './Position_Diamond-Mid.png'
import support from './Position_Diamond-Support.png'
import top from './Position_Diamond-Top.png'

const up = {
  BOTTOM: bottom,
  JUNGLE: jungle,
  MID: middle,
  SUPPORT: support,
  TOP: top,
  mid: middle,
  MIDDLE: middle,
  ADC: bottom,
}

export const positionIcon = {
  ...up,
  bottom,
  jungle,
  middle,
  support,
  top,
}

export const positionIconByName = name => {
  return positionIcon[name]
}
