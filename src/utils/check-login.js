/**
 * 校验登陆状态
 */
import store from '@/store'
import { Dialog } from 'vant'
import router from '@/router'

/**
 * 返回布尔值 表示是否登陆
 */
export default () => {
  const { user } = store.state
  if (user) {
    return true
  }
  // 如果没有登陆 提示“该操作需要登陆”
  Dialog.confirm({
    title: '操作提示',
    message: '该操作需要登陆，是否登陆?'
  }).then(() => {
    // 用户点击确定 跳转到登录页
    router.push({
      name: 'login',
      query: { // 传递查询字符串
        // router.currentRoute 用于在非组件模块中获取当前路由对象
        redirect: router.currentRouter.fullPath
      }
    })
    // 登陆成功 返回之前的页面
  }).catch(() => {
  })
}
