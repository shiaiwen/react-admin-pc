// 接口请求函数
import ajax from './ajax'
import axios from 'axios'
import config from './config'
import category from './category'
import product from './product'
import roles from './roles'
import { message } from 'antd'

export const reqLogin = (username, password) =>
  ajax('login', { username, password }, 'POST')

export const reqGetWheather = () => {
  const { url, appid, appsecret } = config.reqWhetherConfig
  const reqUrl = `${url}?unescape=1&version=v61&appid=${appid}&appsecret=${appsecret}`
  // return new Promise(resolve => {
  return new Promise(resolve => {
    axios.get(reqUrl).then(res => {
      // console.log(res, '天气请求的结果')
      if (res.data.city) {
        const { wea } = res.data
        resolve(wea)
      } else {
        message.error('获取天气失败')
      }
    })
  })

  // })
}

const API = {
  category,
  product,
  roles
}

export default API

// get 请求 jsonp 浏览器端 通过 script 标签发请求
// 定义好响应数据的函数名称
// 服务器端 返回 函数执行的语句代码 指定服务器端处理 数据的 callback,返回js的代码结果作为实参 传入函数
// 浏览器端取出需要的数据
