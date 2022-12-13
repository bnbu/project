import { Component } from 'react'
import './MyPasswordChange.css'

class MyPasswordChange extends Component {  
    state = {
        change_pw : '',
        change_pw_chk : ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    passwordCheck = () => {
        if (this.state.change_pw === this.state.change_pw_chk)
            return true;
        else
            return false;
    }

    handleChangePW = () => {
        if (this.passwordCheck()) {
            fetch('/api/change', {
                method : 'PUT',
                headers : {
                  'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    id : sessionStorage.getItem('u_id'),
                    pw : this.state.change_pw
                })
            }).then(res => res.json())
            .then(data => data.serverStatus === 2 ?
                (() => {
                  alert("비밀번호가 변경되었습니다");
                  window.location.href = '/myinfo'
                })()
                 : alert("에러 발생"))
        }
        else {
            alert('비밀번호가 다릅니다')
        }
    }

    render() {
        return (
            <div>
                <h3>비밀번호 변경</h3><hr />
                <div className="row justify-content-center">
                    {/*<div className="input-group mb-3">
                        <span className="input-group-text inputText change_my_tag">
                            현재 비밀번호
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="현재 비밀번호를 입력하세요."
                            name="pw"
                            id="pw"
                            onChange={this.handleChange} />
                    </div>*/}
                    <div className="input-group mb-3">
                        <span className="input-group-text inputText change_my_tag">
                            변경할 비밀번호
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="변경할 비밀번호를 입력하세요."
                            name="change_pw"
                            id="change_pw"
                            onChange={this.handleChange} />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text inputText change_my_tag ">
                            비밀번호 확인
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="변경할 비밀번호를 재입력하세요."
                            name="change_pw_chk"
                            id="change_pw_chk"
                            onChange={this.handleChange} />
                    </div>
                    <div className="btn-toolbar rg_btn_group">
                        <div className="d-grid gap-2 col-4 mx-auto">
                            <a
                                className="btn btn-danger btn-cancle"
                                href="/myinfo"
                            >
                                뒤로가기
                            </a>
                        </div>
                        <div className="d-grid gap-2 col-4 mx-auto">
                            <button type="button" className="btn btn-primary btn-rg" onClick={this.handleChangePW}>변경하기</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyPasswordChange;