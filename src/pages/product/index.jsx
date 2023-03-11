import React, { Component } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import ProductHome from './home'
import Detail from './detail'
import AddUpdate from './add-update'
import './product.less'

export default class Product extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/product' component={ProductHome}></Route>
          <Route exact path='/product/addupdate' component={AddUpdate}></Route>
          <Route exact path='/product/detail' component={Detail}></Route>
          <Redirect to='/product' />
        </Switch>
      </BrowserRouter>
    )
  }
}
