import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
class AddForm extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired, // 一级分类数组
    parentId: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired // 用来传递form对象的函数
  }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { form, categorys, parentId } = this.props // 具有 form 表单功能的 form 对象

    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }

    return (
      <Form {...formItemLayout}>
        <Item label='所属分类'>
          {getFieldDecorator('parentId', {
            initialValue: parentId
          })(
            <Select>
              <Option value='0'>一级分类</Option>
              {categorys.map(c => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          )}
        </Item>

        <Item label='分类名称'>
          {getFieldDecorator('categoryName', {
            rules: [{ required: true, message: '请输入分类名称' }]
          })(<Input placeholder='请输入分类名称' />)}
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
