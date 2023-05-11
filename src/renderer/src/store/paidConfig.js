import { defineStore } from 'pinia'

export const usePaidConfigStore = defineStore({
  id: 'paidConfig',
  state: () => {
    return {
      enable: false,
      server: '', // 第三方服务商名： 101
      server101: {
        Func: {
          自动换肤: true,
          云顶换肤: true,
          血液补丁: false,
          无限视距: false,
          补刀提示: false,
          血蓝显示: false,
          经验显示: false,
          人物大小: false,
          皮肤提示: true,
          皮肤修复: false,
          // 敌方
          敌方计时: false,
          敌方推送: false,
          敌方轨迹: false,
          陷阱透视: false,
          陷阱计时: false,
          眼位透视: false,
          眼位计时: false,
          眼位范围: false,
          走位轨迹: false,
          回城提示: false,
          回城透视: false,
          敌方野怪: false,
          敌方野计: false,
          敌方普攻: false,
          敌方炮塔: false,
          // 友方
          友方计时: false,
          友方推送: false,
          友方轨迹: false,
          友方野怪: false,
          友方野计: false,
          友方普攻: false,
          友方炮塔: false,
          // 自己
          Q技能范围: false,
          W技能范围: false,
          E技能范围: false,
          R技能范围: false,
          自己普攻: false,
        },
        Skin: {
          Minion: '0',
          Baron: '5',
          Red: '0',
          Razorbeak: '0',
          Ward: '0',
          Crab: '0',
          Blue: '0',
          Telepor: '0',
          Krug: '0',
        },
      },
    }
  },
  actions: {
    init() {
      this.$state = $store.paidDataStore.store
      const funcObj = this.$state.server101.Func
      let data = { Func: {}, Skin: this.$state.server101.Skin }
      for (let key in funcObj) {
        data.Func[key] = funcObj[key] ? '1' : '0'
      }
      $dll.call101ServerConfig(data)
    },
    syncLocal() {
      $store.paidDataStore.set(this.$state)
      const funcObj = this.$state.server101.Func
      let data = { Func: {}, Skin: this.$state.server101.Skin }
      for (let key in funcObj) {
        data.Func[key] = funcObj[key] ? '1' : '0'
      }
      console.log(data)
      $dll.call101ServerConfig(data)
    },
  },
})
