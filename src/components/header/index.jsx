import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { reqGetWheather } from '../../api'
import { Modal } from 'antd';
import dateUtlls from '../../utils/dateUtils.js'
import menuList from '../../config/menuConfig'
import localStorage from '../../utils/localStorage'
import storage from '../../utils/storage'
import LinkButton from '../link-button';

import './index.less'

class Header extends Component {
  state = {
    curTime: dateUtlls.getNow(),
    wrather: ''
  }

  getTime = () => {
    // 获取时间,并更新
    this.timer = setInterval(() => {
      const curTime = dateUtlls.getNow()
      this.setState({
        curTime
      })
    }, 1000)
  }

  getWeather = async () => {
    const wrather = await reqGetWheather()
    this.setState({
      wrather
    })
  }

  // getUser = () => (this.user = localStorage.getUser())

  getTitle = () => {
    let title = ''
    const path = this.props.location.pathname
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        item.children.forEach(subItem => {
          if (path.indexOf(subItem.key) !== -1) {
            title = subItem.title
          }
        })
      }
    })
    return title
  }

  logout = () => {
    const { confirm } = Modal
    confirm({
      title: '确认退出登录吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        storage.user = {}
        localStorage.removeUser()
        this.props.history.replace('/login')
      }
    })
  }

  // 第一次 render 之后执行, 一般用来执行 异步操作
  componentDidMount() {
    this.getTime()
    // this.getUser()
    this.getWeather()
    // console.log(localStorage.getUser(),"user")
    this.username = localStorage.getUser().username
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { curTime, wrather } = this.state
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎 {this.username}</span>
          {/* <Button type="link" onClick={this.logout}>退出</Button> */}
          <LinkButton onClick={this.logout}>退 出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span className='time'>{curTime}</span>
            <span>{wrather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
