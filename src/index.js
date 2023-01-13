import React from 'react';
import ReactDOM from 'react-dom'
import App from './App'
import localStorage from './utils/localStorage'
import storage from './utils/storage'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale-provider/zh_CN.js'
// 读取 Local 中保存的user, 保存到内存中
storage.user = localStorage.getUser()

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
)


