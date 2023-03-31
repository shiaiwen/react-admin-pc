// 接口请求函数
import ajax from './ajax'

// 获取用户列表
const reqUsers = () => ajax('/manage/user/list')
// 更新或者添加用户
const reqAddOrUpdateUser = user =>
  ajax(user._id ? '/manage/user/update' : '/manage/user/add', user, 'POST')

// 删除指定用户
const reqDeleteUser = userId => ajax('/manage/user/delete', { userId }, 'POST')
const user = {
  reqUsers,
  reqAddOrUpdateUser,
  reqDeleteUser
}

export default user
