import bottom from './adc.svg'
import jungle from './jungle.svg'
import middle from './mid.svg'
import support from './support.svg'
import top from './top.svg'

export const positionIcon: any = {
  bottom, jungle, middle, support, top
}

export const positionIconByName = (name: any) => {
  
  return positionIcon[name]
}

