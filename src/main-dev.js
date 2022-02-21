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
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueQuillEditor)

// 配置请求的路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
Vue.prototype.$http = axios
axios.interceptors.request.use((config) => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后要返回config
  return config
})

axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})

Vue.config.productionTip = false

Vue.filter('dateFormat', function (time) {
  var dt = new Date(time)
  var year = dt.getFullYear()
  var month = (dt.getMonth() + 1 + '').padStart(2, '0')
  var date = (dt.getDate() + '').padStart(2, '0')
  var hour = (dt.getHours() + '').padStart(2, '0')
  var minutes = (dt.getMinutes() + '').padStart(2, '0')
  var second = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${date} ${hour}:${minutes}:${second}`
})

Vue.use(ElementUI)
Vue.component(treeMenus.name, treeMenus)
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
