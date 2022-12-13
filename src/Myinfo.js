import { Component } from 'react'

class Myinfo extends Component {

  state = {
    count : 0,
  }

  call_back = (data) => {
    this.setState({
      count : data[0].count
    })
  }

  board_count = (call_back) => {
    fetch('/api/search/postcount/' + sessionStorage.getItem('u_id'))
    .then(res => res.json())
    .then(data => call_back(data))
  }

  constructor (props) {
    super(props)
    this.board_count(this.call_back)
  }

  moveToMyPost = () => {
    window.location.href = '/board/search/3/' + sessionStorage.getItem('nickname') + '/1'
  }

  render() {
    const nickname = sessionStorage.getItem('nickname')
    return(
        <div>
            <br/>
              <h3 className='fw-bold d-flex justify-content-center'>{nickname}님, 환영합니다.</h3>
              <br/><hr/>
              <div>
                <dl className='row'>
                  <dt className='col-sm-3'>닉네임</dt>
                  <dd className='col-sm-9'>{nickname}</dd>
                  <p/>
                  <dt className='col-sm-3'>내가 작성한 게시글 수</dt>
                  <dd className='col-sm-9'>{this.state.count}</dd>
                  <p/>
                </dl>
                <div className='d-grid gap-2 d-md-flex justify-content-md-center'>
                  <a className='btn btn-primary me-md-2' href='/pwchange'>비밀번호 변경</a>
                  <button className='btn btn-success' onClick={this.moveToMyPost}>내가 작성한 게시글</button>
                </div>
              </div>
        </div>
    )
  }
}

export default Myinfo;