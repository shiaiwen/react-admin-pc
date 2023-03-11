// 接口请求函数
import ajax from './ajax'

// 获取商品列表
const reqProducts = (pageNum, pageSize) =>
  ajax('/manage/product/list', { pageNum, pageSize })
// 添加 && 更新商品 模板字符串里面可以传递 模板字符串
const reqAddOrUpdateProduct = product =>
  ajax(`/manage/product/${product._id ? 'update' : 'add'}`, product, 'POST')
// 删除图片
const reqDeleteImg = name => ajax('/manage/img/delete', { name }, 'POST')
// 获取商品列表  searchName 有可能是商品名称或者商品的描述信息
// searchType 的值作为 对象的属性的名字
// 可能取的值有  productName 或者 productDesc
const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) =>
  ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
  })

// 更新产品的状态(上架和下架的操作)
const reqUpdateStatus = (productId, status) =>
  ajax('/manage/product/updateStatus', { productId, status }, 'POST')

const category = {
  reqProducts,
  reqDeleteImg,
  reqSearchProducts,
  reqAddOrUpdateProduct,
  reqUpdateStatus
}

export default category
