import { createApp } from 'vue'
import { createPinia } from "pinia";
import router from './router/index'
import CScrollbar from 'c-scrollbar';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import ArcoVue from '@arco-design/web-vue';

import App from './App.vue'

import 'virtual:windi.css'
import '@arco-themes/vue-gi-demo/css/arco.css';
import 'animate.css'

/* 路由发生变化修改页面title */
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

createApp(App)
  .use(ArcoVue, {})
  .use(router)
  .use(createPinia())
  .use(ArcoVueIcon)
  .use(CScrollbar)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
