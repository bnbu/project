import { Component } from 'react'
import { Link, Route, Redirect, Switch } from 'react-router-dom'
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './core.css'
import Board from './Board'
import Search from './Search'
import Music from './Music'
import Player from './Player'
import AddMusic from './AddMusic'
import BoardView from './BoardView'
import Write from './Write'
import Edit from './Edit'
import Myinfo from './Myinfo'
import MyPasswordChange from './MyPasswordChange'

class Core extends Component {
    state = {
        u_id : '',
        nickname : '',
        admin : '',
        login : false,
        music : [],
        current_index : 0,
    }

    constructor(props) {
        super(props);
        if (sessionStorage.getItem("u_id") === null)
            this.state.login = false;
        else {
            this.state.u_id = sessionStorage.getItem('u_id');
            this.state.nickname = sessionStorage.getItem('nickname');
            this.state.admin = sessionStorage.getItem('admin');
            this.state.login = true;
            this.state.music = JSON.parse(sessionStorage.getItem('music'));
            this.state.current_index = Number(sessionStorage.getItem('current_index'));
        }
    }

    handleLogout = () => {
        sessionStorage.clear()
        window.location.href = '/'
    }  

    setMusicIndex = (index) => {
        this.setState({
            current_index : index,
        }, (() => {
            sessionStorage.setItem('current_index', index)
        })())
    }

    render() {
        return(
            <div className='common'>
                {(() => {
                    if (!this.state.login) return <Redirect to='/login'/>
                })()}
                <div className='container-fluid' id='container'>
                    <div className='row justify-content-center' id='header_main'>
                        <div className='d-flex border' id='header'>
                        <div className='col-8' id='player_area'>  
                            <Player music={this.state.music} current_index={this.state.current_index}/>
                        </div>
                        <div className='col-4' id='user_info_area'>
                            <p></p>
                            <span id='user_hello'>{this.state.nickname}님 안녕하세요!</span><br/>
                            <div className='btn-group btn-group-sm' id='header_btn_group'>
                                <Link to='/myinfo'><div className='btn btn-outline-secondary'>내 정보</div></Link>
                                <button className='btn btn-outline-secondary' id='logout' onClick={this.handleLogout}>로그아웃</button>
                            </div>
                        </div>
                    </div>
                </div> 
                    <div className='row justify-content-center'>
                        <div className='col-3' id='side'>
                            <div className='panel panel-default'>
                                <div className='panel-title' id='side_logo'>
                                    <h2 className='fw-bold'>MENU</h2>
                                </div>
                                <ul className='list-group' id='side_menu'>
                                    <Link to='/board/page/1'><li className='list-group-item menu_item'>BOARD</li></Link>
                                    <Link to='/music/page/1'><li className='list-group-item menu_item'>MUSIC</li></Link>
                                    <Link to='/addmusic/'><li className='list-group-item menu_item'>ADD MUSIC</li></Link>
                                </ul>
                            </div>
                        </div>
                        <div className='col-9' id='content'>
                        <Switch>
                            <Route exact path='/' component={Board} />
                            <Route path='/board/page/:pagenum' component={Board} />
                            <Route path='/board/write' component={Write}/>
                            <Route path='/board/search/:type/:keyword/:pagenum' component={Search}/>
                            <Route path='/board/view/:postnum' component={BoardView}/>
                            <Route path='/board/edit/:postnum' component={Edit}/>
                            <Route path='/myinfo' component={Myinfo} />
                            <Route path='/pwchange' component={MyPasswordChange}/>
                            <Route path='/music/page/:pagenum' render={props => (<Music setMusicIndex={this.setMusicIndex} {...props}/>)}/>
                            <Route path='/addmusic' component={AddMusic} />
                        </Switch>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                    <div className='col-12' id='footer'>
                            <div className='border'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Core;