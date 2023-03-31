import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import logo from '../../assets/logo.png'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig.js'

import storage from '../../utils/storage'
const { SubMenu } = Menu

class LeftNav extends Component {
  // 构造对应的标签结构
  // getMenuNodes = (menuList) => {
  //   return menuList.map(item => {

  //     if (!item.children) {
  //       return (
  //         <Menu.Item key={item.key}>
  //           <Link to={item.key}>
  //             <Icon type={item.icon} />
  //             <span>{item.title}</span>
  //           </Link>
  //         </Menu.Item>
  //       )
  //     } else {
  //       return (
  //         <SubMenu
  //           key={item.key}
  //           title={
  //             <span>
  //               <Icon type={item.icon} />
  //               <span>{item.title}</span>
  //             </span>
  //           }
  //         >
  //           {this.getMenuNodes(item.children)}
  //         </SubMenu>
  //       )
  //     }
  //   })
  // }
  // 判断当前登录用户对 item 是否有权限, 返回的是布尔值
  hasAuth = item => {
    // console.log(storage.user, '动态加载菜单user信息')
    const { username } = storage.user
    const { menus } = storage.user.role
    const { key } = item
    if (username === 'admin' || item.isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false

    /**
     * 1. admin return true
     * 2. 当前用户有此 item 的权限
     * 3. 当前菜单是公开的
     */
  }

  getMenuNodes = menuList => {
    // 确定 哪个被展开
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      // pre 添加 Menu.Item
      if (this.hasAuth(item)) {
        if (!item.children) {
          pre.push(
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        } else {
          const cItem = item.children.find(citem => citem.key === path)
          if (cItem) {
            this.openKey = item.key
          }
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }

      return pre
    }, [])
  }
  // 在第一次 render() 之前执行一次
  // 为 render 渲染准备数据
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    const path = this.props.location.pathname
    const openKey = this.openKey
    return (
      <div className='left-nav-wrapper'>
        <div className='left-nav'>
          <Link to='/' className='left-nav-header'>
            <img src={logo} alt='logo' />
            <h1>硅谷后台</h1>
          </Link>
        </div>
        <Menu
          mode='inline'
          theme='dark'
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

// 包装非路由组件

export default withRouter(LeftNav)
