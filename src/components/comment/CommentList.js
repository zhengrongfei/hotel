import React, {Component} from 'react'
import Comment from './Comment'
import './CommentList.js'
class CommentList extends Component {

  static defaultProps = {
    comments: []
  }

  handleDeleteComment (index) {
    if (this.props.onDelete) {
      this.props.onDelete(index)
      console.log(index)
    }
  }

  render () {

    /**
     * Test
     */

    // const testComments = [
    //   {username: 'Jerry', content: 'Hellor'},
    //   {username: 'KImi', content: 'HOly crap'},
    //   {username: 'Haward', content: 'Amazing'}
    // ]
    return (
      <div>
      {this.props.comments.map((comment, i) => {
        return (<Comment key={i} index={i} comment={comment} onDeleteComment={this.handleDeleteComment.bind(this)} />)

        /**
         * Test PropTypes
         */
        // return <Comment comment={1} />
      })}
      </div>
    )
  }
}



export default CommentList
