import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd'
import API from '../../api'
import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const { Item } = Form
const { TextArea } = Input

class AddUpdate extends Component {
  state = {
    options: [],
    categotyArr: []
  }

  constructor(props) {
    super(props)
    // 创建用来保存 ref  标识的容器对象
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  componentDidMount() {
    this.getCategorys('0')
  }

  initOptions = async categotyArr => {
    const { isUpdate, product } = this
    const { categoryId, pCategoryId } = product
    console.log(categoryId)
    const options = categotyArr.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))

    // 如果是二级分类商品的更新

    if (isUpdate && pCategoryId !== '0') {
      // 获取 对应的 二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成 二级 下拉列表的 options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: false
      }))
      // 找到对应的一级分类
      const targetOption = options.find(item => item.value === pCategoryId) //  find 返回的是一个 布尔值

      targetOption.children = childOptions
    }
    this.setState({
      options
    })
  }
  // async 返回新的 promise 对象 promise 的 值和结果 由 async 的结果来决定
  getCategorys = async parentId => {
    const res = await API.category.reqCategorys(parentId)
    if (res.status === 0) {
      const categotyArr = res.data
      if (parentId === '0') {
        this.initOptions(categotyArr)
      } else {
        return categotyArr // 返回二级列表，当前 async 函数 返回的 promise 就会成功,且 value 为 categorys
      }
    }
  }

  submit = () => {
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        // console.log(value)
        // console.log('发送ajax请求')
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        // console.log(imgs, '子组件的imgs')
        // console.log(editor, '子组件的imgs')
        // 收集表单填写或者回显的信息
        const { name, desc, categoryIds, price } = value
        let pCategoryId, categoryId
        if (categoryIds.lenth === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId
        }
        //  如果是更新需要添加下划线 id
        if (this.isUpdate) {
          product._id = this.product._id
        }
        // 调用接口请求函数
        const res = await API.product.reqAddOrUpdateProduct(product)
        console.log(res, '信息的请求结果')
        if (res.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}成功`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}失败`)
        }
      }
    })
  }

  validatorPrice = (rule, val, callback) => {
    if (val * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions)
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: false
      }))
      // 关联到当前的 options
      targetOption.children = childOptions
    } else {
      // 没有二级分类
      targetOption.isLeaf = true
    }
    this.setState({
      option: [...this.state.options]
    })
  }
  componentWillMount() {
    const product = this.props.location.state
    this.isUpdate = !!product // 保存一个标识，!! 转换成布尔类型的值
    this.product = product || {}
  }

  render() {
    const { isUpdate, product } = this
    const { form } = this.props

    const { getFieldDecorator } = form
    const { options } = this.state
    const { categoryId, pCategoryId, detail, imgs } = product
    console.log(categoryId)
    const categoryIds = []
    if (isUpdate) {
      // categoryIds.
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={{ fontSize: 20 }}
            onClick={() => this.props.history.goBack()}
          />
          <span>{isUpdate ? '修改商品' : '添加商品'}</span>
        </LinkButton>
      </span>
    )
    // 指定 item 布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 }
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [
                {
                  required: true,
                  message: '请输入商品名称'
                }
              ]
            })(<Input placeholder='商品名称' />)}
          </Item>
          <Item label='商品描述'>
            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [
                {
                  required: true,
                  message: '请输入商品描述'
                }
              ]
            })(<TextArea placeholder='商品描述' autoSize />)}
          </Item>
          <Item label='商品价格'>
            {getFieldDecorator('price', {
              initialValue: product.price,
              rules: [
                {
                  required: true,
                  message: '请输入商品价格'
                },
                {
                  validator: this.validatorPrice
                }
              ]
            })(<Input placeholder='商品价格' type='number' addonAfter='元' />)}
          </Item>

          <Item label='商品分类'>
            {getFieldDecorator('categoryIds', {
              initialValue: categoryIds,
              rules: [
                {
                  required: true,
                  message: '请输入商品分类'
                }
              ]
            })(
              <Cascader
                options={options}
                placeholder='请选择分类'
                loadData={this.loadData}
                onChange={this.onChange}
                changeOnSelect
              />
            )}
          </Item>
          <Item label='商品图片'>
            {/* 子组件传递给父组件数据 */}
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item
            label='商品详情'
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 18 }}
          >
            {/* 子组件传递给父组件数据 */}
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>

          <Item>
            <Button type='primary' onClick={this.submit}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(AddUpdate)
