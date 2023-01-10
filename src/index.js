import React from 'react';
import ReactDOM from 'react-dom'
import App from './App'
import localStorage from './utils/localStorage'
import storage from './utils/storage'
// 读取 Local 中保存的user, 保存到内存中
storage.user = localStorage.getUser()

ReactDOM.render(<App />, document.getElementById('root'))


