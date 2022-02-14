import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/icomoon/style.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import treeMenus from './components/goods/Mu.vue'

// 配置请求的路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
Vue.prototype.$http = axios
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后要返回config
  return config
})

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.component(treeMenus.name, treeMenus)
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
