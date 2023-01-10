import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd';
import { message } from 'antd';
import './index.less'
import logo from '../../assets/logo.png'
import { reqLogin } from '../../api'
import storage from '../../utils/storage'
import localStorage from '../../utils/localStorage'
import { Redirect } from 'react-router-dom';

class Login extends Component {
  handleSubmit = (event) => {
    event.preventDefault()
    // console.log("表单提交")
    // const form = this.props.form // 具有 form 表单功能的 form 对象
    // const value = form.getFieldsValue()
    // console.log("submit", value)
    // 对所有的表单字段进行验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // 校验通过
        const { username, password } = values
        let res = await reqLogin(username, password)

        if (res.status === 0) {
          message.success("登录成功")
          storage.user = res.data
          // 保存到 localstorage 中
          localStorage.setUser(res.data)
          // 跳转路由
          this.props.history.replace('/')
          console.log(res, "登录成功返回的res")

        } else {
          message.error(res.message)
        }
        console.log(res.data)

      }
    });
    //表单数据验证
    // 手机表单数据
  }

  validatorPwd = (rule, value, callback) => {
    // callback('error') 验证失败，并指定提示的文本
    // callback() 成功
    if (!value) {
      callback('请输入密码')
    } else if (value.length < 4) {
      callback('长度不能小于4')
    }
    else if (value.length > 12) {
      callback('长度不能大于12')
    }
    else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码包含字母数字下划线')
    } else {
      callback()
    }
  }
  render() {
    // 如果用户已经登录 跳转到 admin 
    const user = storage.user
    if (user && user._id) {
      return <Redirect to='/' />
    }

    const form = this.props.form // 具有 form 表单功能的 form 对象
    const { getFieldDecorator } = form;
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" className='logo' />
          <h1 className='title'>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登陆</h2>
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item >
                {
                  getFieldDecorator('username', {
                    // 声明式验证
                    rules: [
                      { required: true, message: '请输入用户名' },
                      { max: 12, message: '最多12位' },
                      { min: 4, message: '用户名最少4位' },
                      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名包含字母数字下划线' }
                    ]
                  })(<Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />)
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('password', {
                    rules: [
                      {
                        validator: this.validatorPwd
                      }
                    ]

                  })(<Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />)
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form.Item>

            </Form>
          </div>
        </section>
      </div>
    )
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default WrappedNormalLoginForm
