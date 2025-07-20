import { createApp } from 'vue'
import 'normalize.css'; // 自动重置浏览器差异
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router' // 导入路由配置
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import draggable from '@/directives/draggable';

// 引入全局样式
import '@/styles/index.scss'

// 创建 Pinia 实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router).use(pinia).directive('draggable', draggable).use(ElementPlus)
app.mount('#app')