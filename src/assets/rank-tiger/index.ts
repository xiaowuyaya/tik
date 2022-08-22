import BRONZE from './bronze.png'
import CHALLENGER from './CHALLENGER.png'
import DIAMOND from './DIAMOND.png'
import GOLD from './GOLD.png'
import GRANDMASTER from './GRANDMASTER.png'
import IRON from './IRON.png'
import MASTER from './MASTER.png'
import NONE from './IRON.png'
import PLATINUM from './PLATINUM.png'
import SILVER from './SILVER.png'

export const ranked: any = {
  BRONZE,
  CHALLENGER,
  DIAMOND,
  GOLD,
  GRANDMASTER,
  IRON,
  MASTER,
  NONE,
  PLATINUM,
  SILVER
}

export const getRankdTigerImg = (tiger: string) => {
  return ranked[tiger];
};