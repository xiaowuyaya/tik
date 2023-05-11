<script setup>
import { ElMessageBox } from 'element-plus'
import { recordVipConfirmStatus } from '../../api/vip'
import { useRouter } from 'vue-router'

const router = useRouter()

function handlePaidServiceConfirmStatus(agree) {
  if (agree) {
    ElMessageBox.confirm(`确定并同意tik付费服务条例说明的内容，菜单常驻并有意愿接收服务`, '付费服务协议条款', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
    })
      .then(async () => {
        await recordVipConfirmStatus(1)
        setTimeout(() => {
          window.location.reload()
        }, 500)
      })
      .catch(() => {})
  } else {
    ElMessageBox.confirm(`不接受本模块提供的内容以及服务，并将此模块移除菜单栏不再显示（如需重启协议可在设置中配置）`, '付费服务协议条款', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await recordVipConfirmStatus(-1)
        router.push('/SummonerInfo')
        setTimeout(() => {
          window.location.reload()
        }, 500)
      })
      .catch(() => {})
  }
}
</script>
<template>
  <div class="paid-no-auth-container">
    <div class="px-[60px] flex flex-col justify-center absolute top-0 left-0 w-full h-full" style="background: linear-gradient(275deg, rgba(10, 10, 10, 0) 0, rgba(10, 10, 10, 0.9) 120%)">
      <div class="w-[480px]">
        <h1 class="mb-2 pb-2 border-b border-[#dcdfe6]">
          <img class="w-[96px] mr-1" src="../../assets/image/model/logo_white.png" alt="" />
          <span class="font-semibold text-3xl text-[#f7f7f7]">付费服务条例说明</span>
        </h1>
        <div class="mt-4 flex flex-col text-[rgba(250, 249, 249, 0.9)] leading-6 text-[#f7f7f7]">
          <span class="!mb-3">该服务提供诸如国服换肤，无限视距，敌友技能计时以及其他注入类功能</span>
          <u>默认情况下程序并不自带该服务所需要的所有相关依赖组件，也并不会执行任何除Riot公司允许的 League Client Update API以外的内容操作</u>
          <span>如果你对此模块内容不感兴趣，可以点击下方“<u>我不感兴趣</u>”按钮，此后在当前Tik账号下将不再显示此模块以及菜单选项</span>
          <span>如果你有意愿使用以上内容，可以点击“<u>我同意以上内容</u>”按钮，程序将保留此模块的菜单项，并进入到业务页面。<u>付费完成后，将下载该模块所需要的依赖组件，并在需要的时调用以实现相关功能</u></span>
          <span class="!text-sm">* 任何换肤产品都不能保证100%稳定，所有风险由用户自行承担，你可以关注付费群获取最新通告以规避风险。</span>
          <span class="!mt-3 font-semibold">以上为该模块服务内容的相关说明，你是否同意以上内容？ </span>
        </div>
        <div class="flex justify-around px-4 mt-[3rem]">
          <el-button color="#174a81" @click="handlePaidServiceConfirmStatus(true)">我同意以上内容</el-button>
          <el-button color="#9c1036" @click="handlePaidServiceConfirmStatus(false)">我不感兴趣</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.paid-no-auth-container {
  background-image: url('../../assets/image/model/in-battle-broken-splash.jpg');
  object-fit: cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
