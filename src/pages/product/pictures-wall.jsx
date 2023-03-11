import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import { BASE_IMG_URL_Detail } from '../../utils/constant'
import PropTypes from 'prop-types'
import API from '../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }

  constructor(props) {
    super(props)
    let fileList = []
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((c, index) => ({
        uid: -index,
        name: c,
        status: 'done',
        url: `${BASE_IMG_URL_Detail}${c}`
      }))
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList // 指定图片的初始数据
    }
  }

  getImgs = () => this.state.fileList.map(c => c.name)

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    })
  }

  handleChange = async ({ file, fileList }) => {
    console.log('handleChange', file.status, fileList)
    if (file.status === 'done') {
      const result = file.response //上传成功的返回
      if (result.status === 0) {
        message.success('上传图片成功')
        const { name, url } = result.data
        // 修改的 fileList 的最后一个的元素
        // 构造后端需要的数据字段
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      // 删除
      // const url = '/manage/img/delete'
      const result = await API.product.reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }

    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>Upload</div>
      </div>
    )
    return (
      <div className='clearfix'>
        <Upload
          action='/manage/img/upload'
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name='image' /**请求参数名 */
          accept='image/*'
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
