import axios from 'axios'
import { message } from 'antd'
/**
 * 发送异步请求的模块
 * 函数 返回一个 Promise 对象
 */
// import config from './config'
// const baseURL = config.baseURL
// axios 统一处理异常
const ajax = (url, data = {}, type = 'GET') => {
  return new Promise(resolve => {
    let promise
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data
      })
    } else {
      promise = axios.post(url, data)
    }
    promise
      .then(res => resolve(res.data))
      .catch(error => message.error(`请求出错了:${error.message}`))
  })
}
export default ajax