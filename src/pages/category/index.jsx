import React, { Component } from 'react'
import { Card, Table, Button, Icon, Modal } from 'antd'
import { message } from 'antd'
import LinkButton from '../../components/link-button'
import UpdateForm from './update-form'
import AddForm from './add-form'
import API from '../../api'
import './index.less'
export default class Category extends Component {
  state = {
    categotyArr: [],
    subCategorys: [],
    loading: false,
    parentId: '0', // 当前需要显示的分类列表的父分类ID
    parentName: '',
    showStatus: 0 // 更新/ 添加 都不显示 1:显示添加 2:显示更新
  }
  // 为第一次 render 准备数据
  componentWillMount() {
    this.initColumns()
  }
  // 执行异步任务
  componentDidMount() {
    this.getCategory('0')
  }

  initColumns = () => {
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        // 行信息
        render: category => (
          <span>
            <LinkButton
              onClick={() => {
                this.showUpdate(category)
              }}
            >
              修改分类
            </LinkButton>
            {/* 定义个匿名函数在函数调用处理函数并传入数据 */}
            {category.parentId === '0' ? (
              <LinkButton
                onClick={() => {
                  this.showSubCategory(category)
                }}
              >
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        )
      }
    ]
    // return columns
    this.columns = columns
  }

  getCategory = async parentId => {
    this.setState({
      loading: true
    })
    const res = await API.category.reqCategorys(parentId)
    console.log(res, '请求分类列表获取的数据')
    this.setState({
      loading: false
    })
    const categotyArr = res.data
    if (res.status === 0) {
      if (parentId === '0') {
        this.setState({
          categotyArr
        })
      } else {
        this.setState({
          subCategorys: categotyArr
        })
      }
    } else {
      message.error('数据获取失败')
    }
  }

  showSubCategory = category => {
    this.setState(
      {
        parentId: category._id,
        parentName: category.name
      },
      () => {
        this.getCategory(category._id)
      }
    )
  }
  handleCancel = () => {
    this.setState({
      showStatus: 0
    })
  }
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }
  handleUpdate = async () => {
    // 收集数据并发送更新分类请求
    // categoryName
    const { categoryName } = this.form.getFieldsValue()
    const categoryId = this.category._id
    const { parentId } = this.state
    const res = await API.category.reqUpdateCategory({
      categoryId,
      categoryName
    })
    if (res.status === 0) {
      message.success('更新成功')
      // 关闭对话框
      this.setState(
        {
          showStatus: 0
        },
        () => {
          // 重新加载列表
          this.getCategory(parentId)
        }
      )
    } else {
      message.error('更新失败')
    }
  }
  handleAdd = async () => {
    // 收集数据并提交添加分类请求
    console.log(this.form, '@@form')
    const { parentId, categoryName } = this.form.getFieldsValue()
    // 清除输入数据
    this.form.resetFields()
    const res = await API.category.reqAddCategory(categoryName, parentId)
    if (res.status === 0) {
      message.success('添加成功')
      // 重新加载列表
      this.getCategory(parentId)
      // 关闭对话框
      this.setState({
        showStatus: 0
      })
    } else {
      message.error('添加失败')
    }
  }

  handleBack = () => {
    this.setState(
      {
        parentId: '0'
      },
      () => {
        this.getCategory('0')
      }
    )
  }
  showUpdate(category) {
    console.log(category)
    this.category = category
    this.setState({
      showStatus: 2
    })
  }

  render() {
    // card 的标题
    const {
      categotyArr,
      loading,
      subCategorys,
      parentId,
      showStatus,
      parentName
    } = this.state
    // 读取指定的分类
    const category = this.category || {}
    console.log(category)
    const dataArr = parentId === '0' ? categotyArr : subCategorys
    const title =
      parentId === '0' ? (
        '一级分类列表'
      ) : (
        <span>
          <LinkButton onClick={this.handleBack}>一级分类列表</LinkButton>
          <Icon
            type='arrow-right'
            style={{
              marginLeft: '10px',
              marginRight: '10px',
              fontSize: '20px'
            }}
          ></Icon>
          <span>{parentName}</span>
        </span>
      )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )

    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            loading={loading}
            dataSource={dataArr}
            columns={this.columns}
            bordered={true}
            rowKey='name'
          />
        </Card>
        <Modal
          title='添加分类'
          visible={showStatus === 1}
          onOk={this.handleAdd}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categotyArr}
            parentId={parentId}
            setForm={form => {
              this.form = form
            }}
          />
        </Modal>
        <Modal
          title='更新分类'
          visible={showStatus === 2}
          onOk={this.handleUpdate}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={form => {
              this.form = form
            }}
          />
        </Modal>
      </div>
    )
  }
}
