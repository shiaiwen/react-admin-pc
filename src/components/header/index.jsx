import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { reqGetWheather } from '../../api/index.js'
import dateUtlls from '../../utils/dateUtils.js'
import menuList from '../../config/menuConfig'
import './index.less'

class Header extends Component {
  state = {
    curTime: dateUtlls.getNow(),
    wrather: ''
  }

  getTime = () => {
    // 获取时间,并更新
    setInterval(() => {
      const curTime = dateUtlls.getNow()
      this.setState({
        curTime
      })
    }, 1000);
  }

  getWeather = async () => {
    const wrather = await reqGetWheather()
    this.setState({
      wrather
    })
  }

  getTitle = () => {
    let title = ''
    const path = this.props.location.pathname
    menuList.forEach((item) => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        item.children.forEach((subItem) => {
          if (subItem.key === path) {
            title = subItem.title
          }
        })
      }
    })
    return title

  }

  // 第一次 render 之后执行, 一般用来执行 异步操作
  componentDidMount() {
    this.getTime()
    this.getWeather()
    // this
  }


  render() {
    const { curTime, wrather } = this.state
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，admin</span>
          <a>退出</a>
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
