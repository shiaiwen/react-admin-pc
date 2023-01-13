import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
class UpdateForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired // 用来传递form对象的函数
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const form = this.props.form // 具有 form 表单功能的 form 对象
    const { getFieldDecorator } = form
    const { categoryName } = this.props

    return (
      <Form>
        <Item>
          {getFieldDecorator('categoryName', {
            // initialValue
            initialValue: categoryName,
            rules: [{ required: true, message: '请输入分类名称' }]
          })(<Input placeholder='请输入分类名称' />)}
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UpdateForm)
