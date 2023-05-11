import { createWebsocketListen, setCheckingStatus } from './monitor'
import { getChampsData, getGameClientVersionData, getItemsData, getRunesData, leagueClientAuthenticate } from '../tools/utils'
import { gameDataStore } from '../tools/store'
import { registerGlobalShortcut } from '../application/shortcut'

// 启动Tik服务
export default async function startTikServer() {
  try {
    // 1. 校验数据完整性
    await checkGameData()
    // 2. 环境校验
    leagueClientAuthenticate()

    // 3. 创建websocket监听
    await createWebsocketListen()
    // 4. 注册快捷键
    registerGlobalShortcut()

    setCheckingStatus(1, '服务启动成功')
  } catch (err) {
    setCheckingStatus(-1, err.message)
  }
}

/**
 * 校验游戏所需数据
 * @returns {Promise<unknown>}
 */
async function checkGameData() {
  setCheckingStatus(0, `正在校验游戏数据完整性...`)
  const localVersion = gameDataStore.get('version')
  const newVersion = await getGameClientVersionData()

  if (localVersion === newVersion) {
    setCheckingStatus(0, `本地数据版本${localVersion}, 现版本${newVersion}, 校验通过`)
    return
  }

  setCheckingStatus(0, `本地数据版本${localVersion}, 现版本${newVersion}, 更新数据中...`)

  const championsData = await getChampsData()
  const championKeys = Object.keys(championsData)
  const championDict = {}
  const newChampionDict = []
  const championOptions = []
  championKeys.map(tar => {
    const { heroId, name, title, alias } = championsData[tar]
    const avatar = `https://game.gtimg.cn/images/lol/act/img/champion/${alias}.png`
    const o = {
      champId: heroId,
      label: name,
      title: title,
      alias,
      avatar,
      ...championsData[tar],
    }
    championDict[heroId] = o
    newChampionDict.push(o)
    championOptions.push({ label: name, value: heroId, avatar })
  })

  gameDataStore.set('champions', championDict)
  gameDataStore.set('championDict', newChampionDict)
  gameDataStore.set('championOptions', championOptions)

  const gameItemsRes = await getItemsData()
  const gameItems = {}
  gameItemsRes.map(item => {
    const { itemId } = item
    gameItems[itemId] = item
  })
  gameDataStore.set('items', gameItems)

  const gameRunes = await getRunesData()
  gameDataStore.set('runes', gameRunes)

  gameDataStore.set('version', newVersion)
  setCheckingStatus(0, `以获取到最新版本数据: ${newVersion}`)
}
