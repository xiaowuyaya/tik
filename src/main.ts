process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

/* 渲染进程相关初始化 */
initRenderer()

import {createApp} from 'vue'
import App from './App.vue'
import {initRenderer} from './renderer.init'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import {createPinia} from "pinia";
import 'virtual:windi.css'
import 'animate.css'
import '@arco-themes/vue-gi-demo/css/arco.css'


createApp(App)
  .use(router)
  .use(ArcoVue, {})
  .use(ArcoVueIcon)
  .use(createPinia())
  .mount('#app')
  .$nextTick(() => {
    postMessage({payload: 'removeLoading'}, '*')
  })
