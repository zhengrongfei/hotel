import React, {Component} from 'react'
import PropTypes from "prop-types";
import './CommentInput.css';
class CommentInput extends Component {

  static propTypes = {
    onSubmit: PropTypes.func
  }

  constructor () {
    super()
    this.state = {
      username: '',
      content: ''
    }
  }

  componentWillMount () {
    // 将localstorage中存储的username加载到username框
    this._loadUsername()
  }

  componentDidMount () {
    /** 使textarea自动聚焦 */
    console.log('Fouces .......')
    this.textarea.focus()
  } 

  // 将name存储在localstorage
  _saveUsername (username) {
    localStorage.setItem('username', username)
  }
  // 从localstorage中读取username
  _loadUsername () {
    const username = localStorage.getItem('username')
    if (username) {
      this.setState({username: username})
    }
  }

  handleCommentUsernameBlur (event) {
    /** 处理名字框失去焦点 */
    this._saveUsername(event.target.value)
  }

  handleCommentChange (event) {
    if (event.target.name === 'username') {
      this.setState({
        username: event.target.value
      })
    }

    if (event.target.name === 'content') {
      this.setState({
        content: event.target.value
      })
    }
  }

  handleSubmit () {
    console.log(this.state.username + ' | ' + this.state.content)
    // 给父组件传递数据，调用父组件回调函数
    if (this.props.onSubmit) {
      const {username, content} = this.state
      this.props.onSubmit({username, content, createTime: +new Date()})
    }
    this.setState({content: ''})
  }

  render () {
    return (
      <div className='comment-input'>
        <div className='comment-field'>
          <span className='comment-field-name'>用户名：</span>
          <div className='comment-field-input'>
            <input name='username' value={this.state.username} onBlur={this.handleCommentUsernameBlur.bind(this)} onChange={this.handleCommentChange.bind(this)} />
          </div>
        </div>
        <div className='comment-field'>
          <span className='comment-field-name'>评论内容：</span>
          <div className='comment-field-input'>
            <textarea ref={(textarea) => this.textarea = textarea} name='content' value={this.state.content} onChange={this.handleCommentChange.bind(this)} />
          </div>
        </div>
        <div className='comment-field-button'>
          <button onClick={this.handleSubmit.bind(this)} >发布</button>
        </div>
      </div>
    )
  }
}

export default CommentInput
