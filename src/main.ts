process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

import { initRenderer } from './renderer.init'
import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import CScrollbar from 'c-scrollbar'
import router from './router'
import { createPinia } from "pinia";

import '@arco-themes/vue-gi-demo/css/arco.css'

import 'virtual:windi.css'
import './style/loading.min.css'
import 'animate.css'

/* 路由发生变化修改页面title */
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

/* 渲染进程相关初始化 */
initRenderer()

createApp(App)
  .use(ArcoVue, {})
  .use(ArcoVueIcon)
  .use(CScrollbar)
  .use(router)
  .use(createPinia())
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
