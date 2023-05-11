import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { initRenderer } from './init'
initRenderer()

import 'animate.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // dark mode style
import 'element-plus/es/components/message/style/css' // message style
import 'element-plus/es/components/message-box/style/css' // messagebox style
import 'element-plus/es/components/notification/style/css' // messagebox style
import('dayjs/locale/zh-cn') // dayjs CN plug

createApp(App).use(router).use(createPinia()).mount('#app')
