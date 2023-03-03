import React, {Component} from 'react'
import PropTypes from 'prop-types' // [组件参数验证]确保传入的参数类型正确
import './Comment.css';
class Comment extends Component {

  static propTypes = {
    comment: PropTypes.object.isRequired, // 强制该参数必须传入
    index: PropTypes.number
  }

  constructor () {
    super()
    this.state = {
      createTimeString: ''
    }
  }

  
  componentWillMount () {
    this._updateCreateTimeString()
    /**
     * 自动更新时间戳
     */
    this._timer = setInterval(this._updateCreateTimeString.bind(this), 5000)
  }

  componentWillUnmount () {
    clearInterval(this._timer)
  }

  _updateCreateTimeString () {
    const comment = this.props.comment
    let duration = (+Date.now() - comment.createTime) / 1000
    this.setState({createTimeString: duration>60 ? `${Math.round(duration/60)} 分钟前` : `${Math.round(Math.max(duration, 1))} 秒前`})

  }

  handleDeleteComment () {
    if (this.props.onDeleteComment) { // 将删除交给具有删除权限的操作者[CommentApp]，与存储数据在同一逻辑层
      this.props.onDeleteComment(this.props.index)
      console.log("log-delete"+this.props.index)
    }
  }

  _getProcessedCotent (content) {
    return content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/`([\S\s]+?)`/g, '<code>$1</code>')
  }

  render () {
    return (
      <div className='comment'>
        <div className='comment-user'>
          <span>{this.props.comment.username}</span> : 
        </div>
        
        <p dangerouslySetInnerHTML={{__html: this._getProcessedCotent(this.props.comment.content)}}></p>
        <span className='comment-createtime'>{this.state.createTimeString}</span>
        <span className='comment-delete' onClick={this.handleDeleteComment.bind(this)}>删除</span>
      </div>
    )
  }
}

export default Comment
