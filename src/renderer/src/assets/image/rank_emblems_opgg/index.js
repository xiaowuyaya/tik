import BRONZE from './bronze.png'
import CHALLENGER from './challenger.png'
import DIAMOND from './diamond.png'
import GOLD from './gold.png'
import GRANDMASTER from './grandmaster.png'
import IRON from './iron.png'
import MASTER from './master.png'
import NONE from './none.png'
import PLATINUM from './platinum.png'
import SILVER from './silver.png'

export const ranked = {
  BRONZE,
  CHALLENGER,
  DIAMOND,
  GOLD,
  GRANDMASTER,
  IRON,
  MASTER,
  NONE,
  PLATINUM,
  SILVER,
}

export const getRankTigerImg = tiger => {
  return ranked[tiger]
}
