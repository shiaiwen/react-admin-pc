// 接口请求函数
import ajax from './ajax'

// 获取一级/二级分类的列表
const reqCategorys = parentId => ajax('/manage/category/list', { parentId })

// 添加分类
const reqAddCategory = (categoryName, parentId) =>
  ajax('/manage/category/add', { categoryName, parentId }, 'POST')

// 更新分类
const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

// 获取一个分类
const reqCategory = categoryId => ajax('/manage/category/info', { categoryId })

const category = {
  reqCategorys,
  reqAddCategory,
  reqUpdateCategory,
  reqCategory
}

export default category
