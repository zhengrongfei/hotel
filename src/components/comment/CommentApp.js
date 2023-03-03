import React, {Component} from 'react'
import CommentInput from './CommentInput'
import CommentList from './CommentList'
import './CommentApp.css'

class CommentApp extends Component{

  constructor () {
    super()
    this.state = {
      comments: []
    }
  }

  componentWillMount () {
    this._loadComments()
  }

  // load data from localstorage
  _loadComments () {
    const comments = localStorage.getItem('comments')
    if (comments) {
      this.setState({comments: JSON.parse(comments)})
    }
  }

  // save to localstorage
  _saveComments (comments) {
    localStorage.setItem('comments', JSON.stringify(comments))
  }

  handleSubmitContent (comment) {
    console.log(comment+typeof(comment.content)+comment.createTime);
    // check comment
    if (!comment) {
      return
    }

    if (!comment.username) {
      alert('请输入你的用户昵称')
      return
    }
    if (!comment.content) {
      alert('请输入评论内容')
      return
    }

    let tempComments = this.state.comments
    tempComments.push(comment)
    this.setState({
      comments: tempComments
    })

    // 将comments存储到localstorage
    this._saveComments(this.state.comments)
  }

  handleDelete (index) {
    const comments = this.state.comments
    comments.splice(index, 1)
    this.setState({comments: comments})

    // update localstorage
    this._saveComments(this.state.comments)

  }

  render () {
    return (
      <div className='wrapper'>
        <CommentInput onSubmit={this.handleSubmitContent.bind(this)} />
        <CommentList comments={this.state.comments} onDelete={this.handleDelete.bind(this)} />
      </div>
    )
  }
}

export default CommentApp
