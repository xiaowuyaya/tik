import { createApp } from 'vue'
import router from './router/index'
import App from './App.vue'

import 'element-plus/dist/index.css'

import 'virtual:windi.css'
import 'virtual:windi-devtools'
import { store } from './stores'

const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
