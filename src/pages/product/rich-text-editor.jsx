import React, { Component } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import PropTypes from 'prop-types'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props)
    const html = this.props.detail
    console.log(html)
    if (html) {
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState
        }
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }
  }

  // 返回 html 结构的字符串 父组件调用这个方法
  getDetail = () =>
    draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  onEditorStateChange = editorState => {
    console.log('数据发生变化', editorState)
    // 富文本编辑器接收的是 标签的结构的 html 的字符串
    this.setState({
      editorState
    })
  }
  uploadImageCallBack = file => {
    return new Promise((resolve, reject) => {
      console.log('上传图片的 promiose 执行')
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `/manage/img/upload`)
      const formData = new FormData()
      formData.append('image', file)
      xhr.send(formData)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        const url = response.data.url
        resolve({
          data: {
            link: url
          }
        })
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  render() {
    const { editorState } = this.state
    console.log(editorState, 'render editorState')
    // editorState = { editorState }  内容回显富文本编辑器是 editorState 不是 init 那个
    return (
      <Editor
        editorState={editorState}
        editorStyle={{
          border: '1px solid #000',
          minHeight: 200,
          maxHeight: 600,
          padding: 5
        }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, previewImage: true }
          }
        }}
      />
    )
  }
}
