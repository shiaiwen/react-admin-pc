import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'

import PropTypes from 'prop-types'
import role from '../../api/roles'
const Item = Form.Item
const Option = Select.Option

class UserForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired, // 用来传递form对象的函数
    user: PropTypes.object // 用来传递form对象的函数
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { roles } = this.props
    const user = this.props.user || {}
    const { form } = this.props // 具有 form 表单功能的 form 对象
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }

    return (
      <Form {...formItemLayout}>
        <Item label='用户名称'>
          {getFieldDecorator('username', {
            initialValue: user.username,
            rules: [{ required: true, message: '请输入用户名称' }]
          })(<Input placeholder='请输入用户名称' />)}
        </Item>

        {user._id ? null : (
          <Item label='密码'>
            {getFieldDecorator('password', {
              initialValue: user.password,
              rules: [{ required: true, message: '请输入密码' }]
            })(<Input type='password' placeholder='请输入密码' />)}
          </Item>
        )}

        <Item label='手机号'>
          {getFieldDecorator('phone', {
            initialValue: user.phone,
            rules: [{ required: true, message: '请输入手机号' }]
          })(<Input placeholder='请输入手机号' />)}
        </Item>
        <Item label='邮箱'>
          {getFieldDecorator('email', {
            initialValue: user.email,
            rules: [{ required: true, message: '请输入邮箱' }]
          })(<Input placeholder='请输入邮箱' />)}
        </Item>
        <Item label='角色'>
          {getFieldDecorator('role_id', {
            initialValue: user.role_id
          })(
            <Select>
              {roles.map(role => (
                <Option value={role._id} key={role._id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          )}
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)
