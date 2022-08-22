import { createApp } from 'vue'
import { createPinia } from "pinia";
import router from './router/index'

import App from './App.vue'

import 'virtual:windi.css'

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
