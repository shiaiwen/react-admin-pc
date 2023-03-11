import React, { Component } from 'react'
import { Input, Tree, Form } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree

export default class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object
  }
  constructor(props) {
    super(props)
    const { menus } = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }
  // 当组件接收到新的属性的时候自动调用，在 render 之前
  UNSAFE_componentWillReceiveProps(np) {
    const menus = np.role.menus
    console.log('UNSAFE_componentWillReceiveProps')
    this.setState({
      checkedKeys: menus
    })
  }

  UNSAFE_componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  getTreeNodes = menuList => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }
  // 为 父组件 提供最新的 menus 的数据
  getMenus = () => this.state.checkedKeys

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys)
    this.setState({ checkedKeys })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const { role } = this.props
    const { checkedKeys } = this.state
    return (
      <div>
        <Form {...formItemLayout}>
          <Item label='角色名称'>
            <Input placeholder='请输入角色名称' value={role.name} disabled />
          </Item>
        </Form>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          {this.treeNodes}
        </Tree>
      </div>
    )
  }
}
