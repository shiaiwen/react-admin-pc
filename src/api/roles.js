// 接口请求函数
import ajax from './ajax'

// 获取角色列表
const reqRoles = () => ajax('/manage/role/list')
// 添加角色
const reqAddRole = roleName => ajax('/manage/role/add', { roleName }, 'POST')
// 更新角色
const reqUpdateRole = role => ajax('/manage/role/update', role, 'POST')

const role = {
  reqRoles,
  reqAddRole,
  reqUpdateRole
}

export default role
