import React, { Component } from 'react'

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Admin from './pages/Admin'
import Login from './pages/Login'
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}
