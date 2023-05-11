import router from '../../router'
import { ElMessage } from 'element-plus'
import { useAppConfigStore } from '../../store/appConfig'
import { usePaidConfigStore } from '../../store/paidConfig'
import { useUserStore } from '../../store/user'

const appConfigStore = useAppConfigStore()
const paidConfigStore = usePaidConfigStore()
const userStore = useUserStore()

appConfigStore.init()


appConfigStore.$subscribe(
  () => {
    appConfigStore.syncLocal()
    userStore.syncConfigServer()
  },
  { detached: false }
)
paidConfigStore.$subscribe(
  () => {
    paidConfigStore.syncLocal()
  },
  { detached: false }
)

window.electron.ipcRenderer.on('panel-data', (_event, data) => {
  $log.info(`ipcRenderer.on-panel-data: ${data}`)
  router.push({ path: '/GamePanel', query: { _t: data } })
})

window.electron.ipcRenderer.on('lcu-connection-close', (_event, data) => {
  $log.info(`ipcRenderer.lcu-connection-close: ${data}`)
  router.push({ path: '/LoadingLaunch', query: { _t: data } })
})

/* 更新信息通知 */
window.electron.ipcRenderer.removeAllListeners('autoUpdater')
window.electron.ipcRenderer.on('autoUpdater', (_event, data) => {
  ElMessage({
    type: data.type,
    content: data.msg,
    duration: 3,
    grouping: true,
  })
})

window.electron.ipcRenderer.on('player-status-layout', (_event, data) => {
  /* 当进入游戏时跳转到面板 */
  if (data === 'InProgress' || data === 'ChampSelect') {
    router.push('/RecordQuery').then(() => {
      router.push('/GamePanel')
    })
  }
})
