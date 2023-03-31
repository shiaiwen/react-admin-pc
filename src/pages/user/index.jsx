import React, { Component } from 'react'
import API from '../../api'
import { Card, Button, Table, Modal, message } from 'antd'
import dateUtlls from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import UserForm from './user-form'

export default class User extends Component {
  state = {
    users: [],
    isShow: false
  }

  initColumns = () => {
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },

      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: dateUtlls.getStringTime
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: role_id => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: user => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      }
    ]

    this.columns = columns
  }
  getUsers = async () => {
    const res = await API.user.reqUsers()
    console.log('数据请求的结果', res)
    const { users, roles } = res.data
    this.initRoleNames(roles)
    if (res.status === 0) {
      this.setState({
        users,
        roles
      })
    }
  }

  addOrUpdateUser = async () => {
    // 收集表单数据
    let user = this.form.getFieldsValue()
    if (this.user) user._id = this.user._id
    this.form.resetFields()

    // 添加请求函数
    const result = await API.user.reqAddOrUpdateUser(user)
    console.log('添加的请求结果', result)
    if (result.status === 0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.setState({
        isShow: false
      })
      this.getUsers()
    } else {
      message.error(result.msg)
    }
  }
  // 删除指定用户
  deleteUser = async user => {
    const { _id } = user
    const res = await API.user.reqDeleteUser(_id)
    if (res.status === 0) {
      message.success('删除用户成功')
      this.getUsers()
    }
  }

  // 根据 role 数组，生成包含所有角色名的对象(属性名用角色的id值)
  initRoleNames = roles => {
    console.log(roles, '角色的数组')
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    this.roleNames = roleNames
  }

  showUpdate = user => {
    this.user = user
    this.setState({ isShow: true })
  }

  showAdd = () => {
    this.user = null
    this.setState({ isShow: true })
  }

  componentDidMount() {
    this.initColumns()
    this.getUsers()
  }

  render() {
    const { users, isShow, roles } = this.state
    const { user } = this || {}

    const title = (
      <Button type='primary' onClick={() => this.showAdd()}>
        创建用户
      </Button>
    )

    return (
      <Card title={title}>
        <Table
          dataSource={users}
          pagination={{
            defaultPageSize: 3
          }}
          columns={this.columns}
          bordered
          rowKey='_id'
        />

        <Modal
          title={user ? '更新用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({
              isShow: false
            })
          }}
        >
          <div>
            <UserForm
              setForm={form => (this.form = form)}
              roles={roles}
              user={user}
            />
          </div>
        </Modal>
      </Card>
    )
  }
}
