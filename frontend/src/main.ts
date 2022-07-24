import { createApp } from 'vue'
import router from './router/index'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

import 'element-plus/dist/index.css'

import 'virtual:windi.css'
import 'virtual:windi-devtools'
import { store } from './stores'

const app = createApp(App)

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(router)
app.use(store)
app.mount('#app')
