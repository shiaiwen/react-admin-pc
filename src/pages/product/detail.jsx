import { Card, Icon, List } from 'antd'
import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL_Detail } from '../../utils/constant'
import API from '../../api'
const Item = List.Item

export default class Detail extends Component {
  state = {
    cname1: '',
    cname2: ''
  }

  componentDidMount() {
    this.getName()
  }

  getName = async () => {
    // 得到商品的分类 id
    const { pCategoryId, categoryId } = this.props.location.state || {}
    if (pCategoryId === '0') {
      const result = await API.category.reqCategory(categoryId)
      const cname1 = result.data.name
      this.setState({
        cname1
      })
    } else {
      // 二级分类的id
      // 一次发送多个 请求
      const results = await Promise.all(
        [pCategoryId, categoryId].map(item => API.category.reqCategory(item))
      )
      const cname1 = results[0].data.name
      const cname2 = results[1].data.name
      this.setState({
        cname1,
        cname2
      })
    }
  }

  render() {
    // 读取上个页面传递过来的产品对象
    // console.log(this.props.location.state)
    const { name, desc, imgs, price, detail, pCategoryId, categoryId } =
      this.props.location.state || {}

    const { cname1, cname2 } = this.state
    console.log(imgs, '图片')

    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={{ marginRight: 15, fontSize: 20 }}
            onClick={() => this.props.history.goBack()}
          ></Icon>
        </LinkButton>

        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span>
            <span>
              {cname1} {cname2 ? `--->${cname2}` : ''}
            </span>
          </Item>
          <Item>
            <span className='left'>商品图片：</span>
            <span>
              {imgs.map((img, index) => (
                <img
                  src={`${BASE_IMG_URL_Detail}${img}`}
                  alt=''
                  className='product-img'
                  key={index}
                />
              ))}
            </span>
          </Item>

          <Item>
            <span className='left'>商品详情：</span>
            <span
              dangerouslySetInnerHTML={{
                __html: detail
              }}
            ></span>
          </Item>
        </List>
      </Card>
    )
  }
}
