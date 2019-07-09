import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 设置rem基准值
import 'amfe-flexible'
// 导入所有组件
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
// import {
//   Button
// } from 'vant'
// Vue.use(Button)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
