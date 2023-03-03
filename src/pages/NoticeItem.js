import React,{Component} from 'react';

class NoticeItem extends Component{
    
    render() {
        const noticestyle={
            borderBottom:'2px solid #D3D3D3'
          }
        const { id,title,content} = this.props;
        return (
            <div style={noticestyle}>
            <h3 >Notice{id}:{title}</h3>
            <p>{content}</p>
            </div>
        );
    }
}
export default NoticeItem;
