import { Component } from 'react'
import TextEditor from './TextEditor'
import { Link } from 'react-router-dom'
import './write.css'

class Write extends Component {
    state = {
        post_title : '',
        p_content : ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    writePost = (data) => {
        if (this.state.post_title.length === 0 || this.state.p_content.length === 0) {
          alert("제목 또는 내용을 확인해주세요")
        }
        else if (this.state.post_title.length > 100) {
          alert("제목이 너무 깁니다")
        }
        else {
            fetch('/api/add/post', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    post_title : this.state.post_title,
                    p_content : this.state.p_content,
                    u_id : sessionStorage.getItem('u_id'),
                    nickname : sessionStorage.getItem('nickname')
                })
            }).then(res => res.json())
            .then(data => data.serverStatus === 2 ?
                (() => {
                   alert('작성을 완료했습니다')
                })()
                 : alert("에러 발생"))
        }
    }

  render() {
    return(
      <div>
          <h3 className='fw-bold'>글 작성</h3>
          <div className='input-group mb-3' id='title_name'>
            <input type='text' className='form-control' id='title' placeholder='제목 입력' name='post_title' onChange={this.handleChange}></input>
          </div>
          <div id='edit_content'>
            <TextEditor
              onChange={(data) => {
                this.setState({
                  p_content : data
                })
              }}
            />
          </div>
          <br/>
          <div className='d-grid gap-2 d-md-flex justify-content-md-center' id='write_btn'>
            <Link to='/board/page/1'><div className='btn btn-danger'>취소</div></Link>
            <Link to='/board/page/1'><button className='btn btn-primary' onClick={this.writePost}>작성</button></Link>
          </div>
      </div>
    )
  }
}

export default Write;