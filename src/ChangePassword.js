import { Component } from "react";
import './ChangePassword_css.css'

class ChangePassword extends Component {
    state = {
        user : [],
        id : '',
        hint: '',
        hint_answer: '',
        pw : '',
        pw_check : '',
        id_check : false,
    }

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        })
      };

    handleIdCheck = () => {
        fetch('/api/search/id/' + this.state.id)
          .then(res => res.json())
          .then(data => data.length !== 0 ? (window.confirm("해당 아이디가 맞으십니까?") ? this.setState({user:data, id_check:true}) : this.setState({id_check:false})) : alert("아이디가 없습니다."))
    }

    passwordChk = () => {
        let pw = this.state.pw
        let pw_check = this.state.pw_check
    
        if (pw === pw_check) return true;
        else return false;
      };
    
    callback = (data) => {
        if (data.length === 0) 
            alert('힌트 혹은 힌트의 답을 다시 확인해주세요')
        else {
            if (this.passwordChk()) {
                fetch('/api/change', {
                    method : 'PUT',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    body : JSON.stringify({
                        id : this.state.id,
                        pw : this.state.pw
                    })
                }).then(res => res.json())
                .then(data => data.serverStatus === 2 ?
                    (() => {
                      alert("변경이 완료되었습니다");
                      window.location.href = '/login'
                    })()
                     : alert("에러 발생"))
            }
            else {
                alert('비밀번호가 일치하지 않습니다')
            }
        }
    }

    handleChangePW = () => {
        fetch('/api/search/userinfo/' + this.state.id + '/' + this.state.hint + '/' + this.state.hint_answer)
            .then(res => res.json())
            .then(data => this.callback(data));
    }

    render() {
        return (
            <div id='change_main'>
                <div className='input-group mb-3'>
                    <span className='input-group-text change_tag'>사용중인 아이디</span>
                    {this.state.id_check ? 
                    (<input type='text' className='form-control' disabled name='id' value={this.state.id}></input>) :
                    (<input type='text' className='form-control' name='id' value={this.state.id} onChange={this.handleChange}></input>)}
                    {this.state.id_check ? 
                    (<button type="button" className="btn btn-success" disabled id="id_check_btn">확인</button>) :
                    (<button type="button" className="btn btn-secondary" id="id_check_btn" onClick={this.handleIdCheck}>확인</button>)}
                </div><br/>
                <div>
                    <div>
                        {this.state.id_check ?
                        (<select className="form-select" name="hint" onChange={this.handleChange}>
                        <option value="0" selected="selected">
                        힌트 선택
                        </option>
                        <option value="1">당신의 출신 초등학교는?</option>
                        <option value="2">당신이 태어난 고향은?</option>
                        <option value="3">당신이 좋아하는 색깔은?</option>
                        <option value="4">당신의 보물 제1호는?</option>
                        <option value="5">당신의 좌우명은?</option>
                    </select>) :
                        (<select className="form-select" disabled name="hint" onChange={this.handleChange}>
                        <option value="0" selected="selected">
                        힌트 선택
                        </option>
                        <option value="1">당신의 출신 초등학교는?</option>
                        <option value="2">당신이 태어난 고향은?</option>
                        <option value="3">당신이 좋아하는 색깔은?</option>
                        <option value="4">당신의 보물 제1호는?</option>
                        <option value="5">당신의 좌우명은?</option>
                    </select>)}
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text change_tag">힌트의 답</span>
                        {this.state.id_check ? 
                        (<input type="text" className="form-control" onChange={this.handleChange} name='hint_answer' value={this.state.hint_answer} id="hint_answer"/>) : 
                        (<input type="text" className="form-control" disabled id="hint_answer"/>)}
                    </div>
                </div>
                <div className='input-group'>
                    <span className='input-group-text change_tag'>변경할 비밀번호</span>
                    {this.state.id_check ? 
                    (<input type='password' className='form-control' name='pw' onChange={this.handleChange} value={this.state.pw}></input>) :
                    (<input type='password' className='form-control' disabled></input>)}
                    {this.state.id_check ? 
                    (<input type='password' className='form-control' name='pw_check' onChange={this.handleChange} value={this.state.pw_check} placeholder='다시 한번 입력'></input>) :
                    (<input type='password' className='form-control' disabled placeholder='다시 한번 입력'></input>)} 
                </div>
                <div className="btn-toolbar rg_btn_group">
                    <div className="d-grid gap-2 col-4 mx-auto">
                        <a className="btn btn-danger btn-cancle" id="cancel_btn" href="/login">뒤로가기</a>
                    </div>
                    <div className="d-grid gap-2 col-4 mx-auto">
                        <button type="button" className="btn btn-primary btn-rg" id="change_btn" onClick={this.handleChangePW}>변경하기</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangePassword