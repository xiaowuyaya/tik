import bottom from './adc.svg'
import jungle from './jungle.svg'
import middle from './mid.svg'
import support from './support.svg'
import top from './top.svg'

const up = {
  BOTTOM: bottom,
  JUNGLE: jungle,
  MID: middle,
  SUPPORT: support,
  TOP: top, 
  mid: middle,
  MIDDLE: middle,
  ADC: bottom
}

export const positionIcon: any = {
  ...up,
  bottom, jungle, middle, support, top
}

export const positionIconByName = (name: string) => {
  return positionIcon[name]
}

