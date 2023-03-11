import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired // 用来传递form对象的函数
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { form } = this.props // 具有 form 表单功能的 form 对象
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }

    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {getFieldDecorator('roleName', {
            rules: [{ required: true, message: '请输入角色名称' }]
          })(<Input placeholder='请输入角色名称' />)}
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
