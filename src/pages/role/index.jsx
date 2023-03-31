import React, { Component } from 'react'
import API from '../../api'
import { Card, Button, Table, Modal, message } from 'antd'
import AddForm from './add-form'
import AuthForm from './auth-form'
import localStorage from '../../utils/localStorage'
import storage from '../../utils/storage'

import dateUtlls from '../../utils/dateUtils'

export default class Category extends Component {
  constructor(props) {
    super(props)
    this.auth = React.createRef()
  }

  state = {
    roles: [],
    role: null,
    isShowAdd: false
  }

  initColumns = () => {
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: dateUtlls.getStringTime
      },
      // 上下两种 render 的写法是一样的
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: auth_time => dateUtlls.getStringTime(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]

    this.columns = columns
  }
  getRoles = async () => {
    const res = await API.roles.reqRoles()
    console.log('数据请求的结果', res)
    if (res.status === 0) {
      this.setState({
        roles: res.data
      })
    }
  }

  onRow = role => {
    return {
      onClick: event => this.setState({ role })
    }
  }

  addRole = async () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 校验通过
        const { roleName } = values
        console.log(roleName, '填写的名字')
        const res = await API.roles.reqAddRole(roleName)
        if (res.status === 0) {
          message.success('添加成功')
          this.form.resetFields()
          // this.getRoles()
          const role = res.data
          // // const { roles } = this.state   // React 不建议直接去修改原来的数据
          // const roles = [...this.state.roles]
          // role.push(role)
          // this.setState({
          //   roles,
          //   isShowAdd: false
          // })
          // 基于原来的状态去修改的时候，可以写成这种返回对象的形式
          this.setState(state => ({
            roles: [...state.roles, role],
            isShowAdd: false
          }))
        } else {
          message.error(res.message)
        }
      }
    })
  }

  setAuth = async () => {
    // 通过事件的方式的方式去接收子组件的传递过来的参数
    const menus = this.auth.current.getMenus()
    const role = this.state.role
    role.menus = menus
    role.auth_name = localStorage.getUser().username
    const res = await API.roles.reqUpdateRole(role)

    if (res.status === 0) {
      if (role._id === storage.user.role_id) {
        storage.user = {}
        localStorage.removeUser()
        this.props.history.replace('/login')
        message.success('当前角色权限已经修改,请重新登录')
      } else {
        message.success('设置角色权限成功')
      }
      this.setState({
        isShowAuth: false
      })
    } else {
      this.setState({
        isShowAuth: true
      })
    }
  }

  componentDidMount() {
    this.initColumns()
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state
    const { _id } = role || {}

    const title = (
      <span>
        <Button
          type='primary'
          style={{
            marginRight: 10
          }}
          onClick={() => {
            this.setState({
              isShowAdd: true
            })
          }}
        >
          创建角色
        </Button>
        <Button
          type='primary'
          disabled={!_id}
          onClick={() => {
            this.setState({
              isShowAuth: true
            })
          }}
        >
          设置角色权限
        </Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          dataSource={roles}
          pagination={{
            defaultPageSize: 3
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [_id],
            onSelect: role => {
              // 选择 某个 radio 的 回调
              this.setState({ role })
            }
          }}
          columns={this.columns}
          bordered
          rowKey='_id'
          onRow={this.onRow}
        />

        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({
              isShowAdd: false
            })
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={form => {
              this.form = form
            }}
          />
        </Modal>

        <Modal
          title='设置角色权限'
          visible={isShowAuth}
          onOk={this.setAuth}
          onCancel={() => {
            this.setState({
              isShowAuth: false
            })
          }}
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}
