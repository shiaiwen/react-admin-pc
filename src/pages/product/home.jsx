import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, Icon, message } from 'antd'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constant'
import API from '../../api'
const Option = Select.Option

export default class ProductHome extends Component {
  state = {
    products: [],
    total: 0,
    loading: false,
    searchName: '', //  搜索的关键字
    searchType: 'productName' // 按照产品名称搜索
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }
  // 初始化 table 列的数组
  initColumns = () => {
    console.log('初始化 table 列的数组  ')
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: price => `￥${price}` // 指定了属性，传入的就是对应的属性的值
      },
      {
        title: '状态',
        width: 150,
        // dataIndex: 'status',
        render: product => {
          const { status, _id } = product
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
              >
                {product.status === 1 ? '下架' : '上架'}
              </Button>
              <span
                style={{
                  marginLeft: 5
                }}
              >
                {product.status === 1 ? '在售' : '已下架'}
              </span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 150,
        render: product => {
          return (
            <span>
              <LinkButton
                onClick={() => {
                  this.props.history.push('/product/detail', product)
                }}
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  this.props.history.push('/product/addupdate', product)
                }
              >
                修改
              </LinkButton>
            </span>
          )
        }
      }
    ]
  }

  // 修改产品的状态
  updateStatus = async (id, state) => {
    const res = await API.product.reqUpdateStatus(id, state)

    if (res.status === 0) {
      message.success(`${state === 1 ? '上架' : '下架'}成功`)
      this.getProducts(this.pageNum)
    } else {
      message.error(`${state === 1 ? '上架' : '下架'}失败`)
    }
  }

  getProducts = async pageNum => {
    this.pageNum = pageNum
    this.setState({
      loading: true
    })
    const { searchName, searchType } = this.state
    // 如果存在搜索分页
    let result
    if (searchName) {
      result = await API.product.reqSearchProducts({
        pageNum,
        pageSize: 3,
        searchName,
        searchType
      })
    } else {
      result = await API.product.reqProducts(pageNum, 3)
    }

    console.log('result列表数据', result)
    if (result.status === 0) {
      const { list: products, total } = result.data
      this.setState({
        products,
        total,
        loading: false
      })
    }
  }

  render() {
    const { products, total, loading, searchType, searchName } = this.state
    const { columns, pageNum } = this
    console.log(columns, 'rander中的columns信息')
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 200 }}
          onChange={value =>
            this.setState({
              searchType: value
            })
          }
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{ width: 200, margin: '0 15px' }}
          value={searchName}
          onChange={event =>
            this.setState({
              searchName: event.target.value
            })
          }
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </span>
    )
    const extra = (
      <span>
        <Button
          type='primary'
          icon='plus'
          onClick={() => this.props.history.push('/product/addupdate')}
        >
          添加商品
        </Button>
      </span>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={products}
          loading={loading}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            total,
            showQuickJumper: true,
            onChange: this.getProducts,
            current: pageNum
          }}
          columns={columns}
          bordered
          rowKey='_id'
        />
      </Card>
    )
  }
}
