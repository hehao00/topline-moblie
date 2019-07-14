import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
// 封装axios请求模块
// axios.create用于创建一个axios 实例
const request = axios.create({
  // baseURL: 'http://toutiao.course.itcast.cn'
  baseURL: 'http://ttapi.research.itcast.cn'
})
/**
 * 处理后端返回数据中数字超出 JavaScript 安全整数范围
 */
request.defaults.transformResponse = [function (data) {
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]
// 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 如果登陆了 统一给接口添加用户 token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应
request.interceptors.response.use(function (response) {
  // Do something with response data
  // 如果响应结果对象中有data，则直接返回这个data数据
  // 如果响应结果对象中没有data ，直接原样返回这个数据
  return response.data.data || response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default request
