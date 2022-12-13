import { Component } from 'react'
import { Link } from 'react-router-dom'
import TextEditor from './TextEditor'

class Edit extends Component {
    state = {
        post_title : '',
        p_content : ''
    }

    constructor(props) {
        super(props);
        this.getPost(this.postCallback);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    postCallback = (data) => {
        this.setState({
            post_title : data[0].post_title,
            p_content : data[0].p_content
        })
    }

    getPost = (postCallback) => {
        fetch('/api/search/post/' + this.props.match.params.postnum)
        .then(res => res.json())
        .then(data => postCallback(data))
    }

    EditPost = () => {
        if (this.state.post_title.length === 0 || this.state.p_content.length === 0)
            alert("제목 또는 내용을 확인해주세요")
        else if (this.state.post_title.length > 100) {
          alert("제목이 너무 깁니다")
        }
        else {
            fetch('/api/edit/post', {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    post_title : this.state.post_title,
                    p_content : this.state.p_content,
                    post_num : this.props.match.params.postnum
                })
            }).then(res => res.json())
            .then(data => data.serverStatus === 2 ?
                (() => {
                  alert('수정을 완료했습니다')
                })()
                 : alert("에러 발생"))
        }
    }

  render() {
    return(
      <div>
          <h3 className='fw-bold'>글 작성</h3>
          <div className='input-group mb-3' id='title_name'>
            <input type='text' className='form-control' id='title' placeholder='제목 입력' name='post_title' value={this.state.post_title} onChange={this.handleChange}></input>
          </div>
          <div id='edit_content'>
            <TextEditor
              onChange={(data) => {
                this.setState({
                  p_content : data
                })
              }}
              value={this.state.p_content}
            />
          </div>
          <br/>
          <div className='d-grid gap-2 d-md-flex justify-content-md-center' id='write_btn'>
            <Link to={'/board/view/' + this.props.match.params.postnum}><button className='btn btn-danger'>취소</button></Link>
            <Link to={'/board/view/' + this.props.match.params.postnum}><button className='btn btn-primary' onClick={this.EditPost}>수정</button></Link>
          </div>
      </div>
    )
  }
}

export default Edit;