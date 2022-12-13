import { Component } from "react";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

class Login extends Component {
  state = {
    id : '',
    pw : ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  pressEnter = (e) => {
    if (e.key === 'Enter') {
      this.handleLogin();
    }
  }

  musicCallback = () => {
    fetch('/api/search/music/' + sessionStorage.getItem('u_id'))
            .then(res => res.json())
            .then(data => {
              sessionStorage.setItem('music', JSON.stringify(data));
              sessionStorage.setItem('current_index', '0');
              sessionStorage.setItem('play', '0');
              sessionStorage.setItem('currentVolume', '1');
              sessionStorage.setItem('volume', '1')
              sessionStorage.setItem('mute', '0');
              window.location.href = '/';
            });
  }

  handleLogin = () => {
    fetch('/api/login/' + this.state.id + '/' + this.state.pw)
      .then(res => res.json())
      .then(data => {
        if (data.length !== 0) {
          sessionStorage.setItem('u_id', data[0].u_id);
          sessionStorage.setItem('nickname', data[0].nickname);
          sessionStorage.setItem('admin', data[0].admin);
          this.musicCallback();
        }
        else {
          alert('아이디 혹은 비밀번호를 다시 확인해주세요')
        }
      });
  }

  render() {
    return (
      <div>
        <div className="container " id="loginForm">
          <div className="row justify-content-center" id="main_logo">
            <img src="logo.png" name="home_logo" id="logo_img" alt='logo'/>
          </div>
          <form>
            <div className="row justify-content-center">
              <div className="col-3">
                <div className="input-group mb3">
                  <span className="input-group-text inputText">ID</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ID"
                    name="id"
                    onChange={this.handleChange}
                    onKeyPress={this.pressEnter}
                  ></input>
                </div>
                <div className="input-group mb3">
                  <span className="input-group-text inputText">PW</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="pw"
                    onChange={this.handleChange}
                    onKeyPress={this.pressEnter}
                  ></input>
                </div>
              </div>
              <div className="col-1">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  id="loginBtn"
                  onClick={this.handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
          <div className='row justify-content-center'>
              <div className='col-2' id='additional_option_box'>
                  <ul id='additional_option'>
                      <li><a href='/register'>sign up</a><span> /</span></li>
                      <li><a href='/forgetpw'>forgot pw?</a></li>
                  </ul>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
