import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import storage from '../../utils/storage'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home';
import Category from '../category';
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Order from '../order'
const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = storage.user
    console.log(user, "当前的用户信息")
    if (!user._id) {
      // 当前没有登录
      // this.props.history()
      return <Redirect to='/login' />
      // console.log(123)
    }

    return (
      <Layout style={{ height: '100%',  }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />

          <Content style={{ backgroundColor: '#fff',margin:'20px' }}>
            <Switch>
              <Redirect from='/' exact to='/home' />
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/user' component={User} />
              <Route path='/role' component={Role} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/charts/line" component={Line} />
              <Route path="/order" component={Order} />
            </Switch>


          </Content>
          <Footer style={{ color: '#ccc', textAlign: 'center' }}>使用谷歌浏览器体验更好</Footer>
        </Layout>
      </Layout>
    )
  }

}
