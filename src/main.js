import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import relativeTime from './filters/relative-time'
// 设置rem基准值
import 'amfe-flexible'
// 导入所有组件 // 图片懒加载
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
// 表单验证插件
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
Vue.use(Vant)
// 注册 Vant 的图片懒加载自定义指令
Vue.use(Lazyload)
// import {
//   Button
// } from 'vant'
// Vue.use(Button)
Vue.config.productionTip = false

Vue.use(VeeValidate, {
  events: '' // 禁用默认事件验证
})

// 注册一个全局过滤器：处理相对时间
Vue.filter('relativeTime', relativeTime)

Validator.localize('zh_CN', zhCN)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
