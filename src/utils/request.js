import axios from 'axios'
// 封装axios请求模块
// axios.create用于创建一个axios 实例
const request = axios.create({
  baseURL: 'http://toutiao.course.itcast.cn'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应
request.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default request
