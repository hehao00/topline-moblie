import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 加载中文语言包
import relativeTime from 'dayjs/plugin/relativeTime' // dayjs 的 相对时间插件
import checkLogin from './utils/check-login'
dayjs.extend(relativeTime) // 把插件注册到 dayjs 中

dayjs.locale('zh-cn') // 配置使用中文语言包

// 注册一个全局过滤器来处理日期格式的展示
// 过滤器就是一个函数，我们可以在模板中通过 {{ 数据 | 过滤器 }} 来调用这个过滤器函数
// 过滤器函数接收的参数就是你的数据，返回值就会绑定输出到使用的位置
// {{ 数据 | relativeTime }}
// 好处：任何组件的模板都可以通过 {{ 数据 | 过滤器 }} 来使用这里定义的过滤器
// 说白了就是一个全局函数
Vue.filter('relativeTime', value => {
  return dayjs().from(value)
})

Vue.use(VeeValidate, {
  // 配置改变的时候去触发校验，默认是 input
  // 配置文档：https://baianat.github.io/vee-validate/guide/events.html#changing-default-events
  events: ''
})

Validator.localize('zh_CN', zhCN)

Vue.use(Vant)
Vue.use(Lazyload)
// 将检查登陆状态挂载到vue原型上，任何组件就都可以使用了
Vue.prototype.$checkLogin = checkLogin
Vue.config.productionTip = false

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

Vue.prototype.$isLogin = () => {
  // 校验登录状态

  // 如果没有登录，则跳转到登录页
  if (!store.state.user) {
    router.push({
      name: 'login'
    })
    return false
  }

  // 如果登录了执行后续逻辑操作
  return true
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
