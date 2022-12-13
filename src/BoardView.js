import { Component } from "react";
import { Link } from 'react-router-dom'
import "./BoardView.css";

class BoardView extends Component {
  state = {
    post : [],
    comment : [],
    isPost : false,
    isComment : false,
    input_comment : ''
  }

  getCommentCallback = (commentCallback) => {
    fetch('/api/search/comment/' + this.props.match.params.postnum)
    .then(res => res.json())
    .then(data => commentCallback(data))
  }

  postCallback = (data, getCommentCallback, commentCallback) => {
    this.setState({
      post : data,
      isPost : true
    }, getCommentCallback(commentCallback))
  }

  commentCallback = (data) => {
    this.setState({
      comment : data,
      isComment : true
    })
    document.getElementById('board_content').innerHTML = this.state.post[0].p_content;
  }

  getInfo = (postCallback, getCommentCallback, commentCallback) => {
    fetch('/api/search/post/' + this.props.match.params.postnum)
      .then(res => res.json())
      .then(data => postCallback(data, getCommentCallback, commentCallback));
  }

  constructor(props) {
    super(props);
    this.getInfo(this.postCallback, this.getCommentCallback, this.commentCallback)
  }

  getFormatDate(date){
    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '-' + month + '-' + day;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  pressEnter = (e) => {
    if (e.key === 'Enter') {
      this.editComment();
    }
  }

  editComment = () => {
    if (this.state.input_comment.length > 0) {
      this.setState({
        input_comment : ''
      })
      fetch('/api/add/comment', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
          postnum : this.state.post[0].post_num,
          u_id : sessionStorage.getItem('u_id'),
          nickname : sessionStorage.getItem('nickname'),
          comment : this.state.input_comment
        })
      }).then(res => res.json())
      .then(data => data.serverStatus === 2 ?
        (() => {
          this.getInfo(this.postCallback, this.getCommentCallback, this.commentCallback)
        })()
         : alert("에러 발생"))
    }
    else {
      alert('내용이 없습니다');
    }
  }

  deleteComment = (e) => {
    let confirm = window.confirm("댓글을 삭제 하시겠습니까?")
    if (confirm) {
      fetch('/api/delete/comment', {
        method : 'DELETE',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
          commentnum : e.target.value
        })
      }).then(res => res.json())
      .then(data => data.serverStatus === 2 ?
        (() => {
          this.getInfo(this.postCallback, this.getCommentCallback, this.commentCallback)
        })()
         : alert("에러 발생"))
    }
  }

  deletePost = () => {
    let confirm = window.confirm("글을 삭제하시겠습니까?")
    if (confirm) {
      fetch('/api/delete/post', {
        method : 'DELETE',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
          postnum : this.state.post[0].post_num
        })
      }).then(res => res.json())
      .then(data => data.serverStatus === 2 ?
        (() => {
            alert('삭제를 완료했습니다')
        })()
         : alert("에러 발생"))
    }
  }

  render() {
    const today = this.getFormatDate(new Date());
    const comment = this.state.comment;
    const list = comment.map(data => (
      <tr>
        <th>{data.nickname}</th>
        <th>
          {data.c_content}
        </th>
        <th>{data.c_write_date.split(' ')[0] === today ? 
          data.c_write_date.split(' ')[1] : data.c_write_date.split(' ')[0]}</th>
        <th>
          {sessionStorage.getItem('u_id') === data.u_id || Number(sessionStorage.getItem('admin')) === 1 ? 
          <button type="button" className="btn btn-danger" value={data.comment_num} onClick={this.deleteComment}>
            삭제
          </button> : 
          <button type="button" className="btn btn-danger" style={{visibility:'hidden'}}>
            삭제
          </button>
          }
        </th>
      </tr>
    ))
    return (
      <div>
        {!this.state.isPost && !this.state.isComment ? 
        (<div></div>) :
        (
          <div>
          <div id="board_header">
          <h2 className="fw-bold">{this.state.post[0].post_title}</h2>
          <div id="header_sub">
            <div id="writer">
              <span className="fw-light">{this.state.post[0].nickname}</span>
            </div>
            <div id="etc">
              <span className="fw-light">|</span>
            </div>
            <div id="date">
              <span className="fw-light">{this.state.post[0].write_date}</span>
            </div>
            <div id="count">
              <span className="fw-light">조회수 : {this.state.post[0].read_count}</span>
            </div>
          </div>
        </div>
        <hr></hr>
        <div id="board_content">
        </div>
        <hr></hr>
        <div id='edit_box'>
          <Link to='/board/page/1'><div className="btn btn-primary">목록</div></Link>
          {sessionStorage.getItem('u_id') === this.state.post[0].u_id ? 
          <Link id="edit_btn" to={'/board/edit/' + this.state.post[0].post_num}><div className="btn btn-secondary" onClick={this.moveToEdit}>수정</div></Link> :
          <Link id="edit_btn" to={'/board/edit/' + this.state.post[0].post_num}><div className="btn btn-secondary" style={{visibility:"hidden"}}>수정</div></Link>
          }
          {sessionStorage.getItem('u_id') === this.state.post[0].u_id || Number(sessionStorage.getItem('admin')) === 1 ? 
          <Link id='delete_btn' to='/board/page/1'><button className="btn btn-secondary" onClick={this.deletePost}>삭제</button></Link> :
          <Link id='delete_btn' to='/board/page/1'><button className="btn btn-secondary" style={{visibility:"hidden"}}>삭제</button></Link>
          }
          
          
        </div>
        <hr/>
        <div className="input-group" id="input_comment">
          <span className="input-group-text">댓글 입력</span>
          <textarea className="form-control" name='input_comment' value={this.state.input_comment} onKeyPress={this.pressEnter} onChange={this.handleChange} style={{resize:'none'}}></textarea>
          <Link to={'/board/view/' + this.state.post[0].post_num}><button className="btn btn-primary" onClick={this.editComment}>작성</button></Link>
        </div>
        <br />
        <div id="board_comment">
          <table className="table table-hover">
            <thead>
              <th className="col-2"></th>
              <th className="col-7"></th>
              <th className="col-2"></th>
              <th className="col-1"></th>
            </thead>
            <tbody>
              {list}
            </tbody>
          </table>
        </div>
      </div>
        )}
      </div>
    );
  }
}

export default BoardView;
