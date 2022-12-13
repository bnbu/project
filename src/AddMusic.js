import { Component } from 'react'
import * as Icon from 'react-bootstrap-icons';

class AddMusic extends Component { 
    defaultProps = {
        client_id : '0b84ba9d7d0084c784c5a6533160ea39'
    }

    state = {
        url : '',
        music : [],
        user : [],
        searched : false,
        music_added : '',
        list_added : ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    searchCallback = (data) => {
        if (data.errors) {
            alert('잘못된 주소를 입력하셨습니다.')
        }
        else {
            this.setState({
                music : data,
                user : data.user,
                searched : true
            })
        }
    }


    handleSearchMusic = () => {
        if (this.state.url.length === 0) {
            alert('주소를 입력해주세요')
        }   
        else {
            fetch('https://api.soundcloud.com/resolve.json?url=' + this.state.url + '&client_id=' + this.defaultProps.client_id)
                .then(res => res.json())
                .then(data => this.searchCallback(data));
        }
    }

    addMusicCallback = (data, type) => {
        if (type === 1) {
            this.setState({
                music_added : true
            })
        }
        else if (type === 2) {
            this.setState({
                list_added : true
            })
        }
        else {
            this.setState({
                music_added : true,
                list_added : true
            })
        }

        if (this.state.music_added && this.state.list_added) {
            fetch('/api/search/music/' + sessionStorage.getItem('u_id'))
            .then(res => res.json())
            .then(data => {
              console.log(data);
              if (data.length !== 0) {
                sessionStorage.setItem('music', JSON.stringify(data));
                alert('추가를 완료했습니다');
              }
              else {
                alert('에러 발생')
              }
            });
            
        }
    }

    listCheckCallback = (data) => {
        if (data.length > 0) {
            alert('이미 리스트에 존재합니다');
        }
        else {
            fetch('/api/add/musiclist', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    u_id : sessionStorage.getItem('u_id'),
                    track_num : this.state.music.id
                  })
            }).then(res => res.json())
            .then(data => this.addMusicCallback(data, 3))
        }
    }

    checkCallback = (data) => {
        if (data.length > 0) {
            this.listDupCheck()
        }
        else {
            fetch('/api/add/music', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    track_num : this.state.music.id,
                    music_title : this.state.music.title,
                    composer : this.state.user.username,
                    thumbnail_url : this.state.music.artwork_url,
                    length : this.state.music.duration
                  })
            }).then(res => res.json())
            .then(data => this.addMusicCallback(data, 1))
    
            fetch('/api/add/musiclist', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    u_id : sessionStorage.getItem('u_id'),
                    track_num : this.state.music.id
                  })
            }).then(res => res.json())
            .then(data => this.addMusicCallback(data, 2))
        }
    }

    musicDupCheck = () => {
        fetch('/api/search/musicbynum/' + this.state.music.id)
        .then(res => res.json())
        .then(data => this.checkCallback(data))
    }

    listDupCheck = () => {
        fetch('/api/search/musiclist/' + sessionStorage.getItem('u_id') + '/' + this.state.music.id)
        .then(res => res.json())
        .then(data => this.listCheckCallback(data))
    }

    handleAddMusic = () => {
        fetch('/api/add/music', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                track_num : this.state.music.id,
                music_title : this.state.music.title,
                composer : this.state.user.username,
                thumbnail_url : this.state.music.artwork_url,
                length : this.state.music.duration
              })
        }).then(res => res.json())
        .then(data => this.addMusicCallback(data, 1))

        fetch('/api/add/musiclist', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                u_id : sessionStorage.getItem('u_id'),
                track_num : this.state.music.id
              })
        }).then(res => res.json())
        .then(data => this.addMusicCallback(data, 2))
    }

    calcDuration = (duration) => {
        let totalSec = Math.floor(duration / 1000);
        let min = Math.floor(totalSec / 60);
        let sec = totalSec % 60 > 10 ? totalSec % 60 : '0' + totalSec % 60;

        return min + ':' + sec
    }

    render() {
        return (
            <div>
             <h2 className='fw-bold text-center'>Add Music</h2>
                 <div className='mb-3' id='add_music'>
                     <label className='form-label fs-4'>Add Music URL</label>
                     <input type='text' className='form-control' name='url' onChange={this.handleChange}></input>
                     <div className='form-text'>추가할 음악의 soundcloud URL을 입력하고, 확인 버튼을 눌러주세요.</div>
                     <div className='form-text'>음악을 추가할 때, 노래를 정지해주셔야 오류가 발생하지 않습니다. **api 정책이 바뀌어서 죽음</div>
                 </div>
                 <button className='btn btn-primary' id='btn_check' onClick={this.handleSearchMusic}>확인</button>
                 <hr/>
                 <div id='music_info'>
                     <ul className='list-group list-group'>
                         {this.state.searched ? (
                             <li className='list-group-item d-flex justify-content-between align-items-start' id='ms_list'>
                             <img src={this.state.music.artwork_url} width='100px' height='100px' className='rounded ms_img' alt='thumbnail'></img>
                             <div className='ms-2 me-auto'>
                                 <div className='fw-bold fs-5' id='ms_title'>{this.state.music.title}</div>
                                 <p className='fs-6'></p>
                                 <div style={{ fontSize:"14px" }} id='ms_composer'>{this.state.user.username}</div>
                                 <div style={{ fontSize:"14px" }} id='ms_length'>{this.calcDuration(this.state.music.duration)}</div>
                             </div>
                             <button className='btn' id='btn_add' onClick={this.musicDupCheck}><Icon.PlusLg size={30}/></button>
                         </li>
                         ) : null}
                     </ul>
                     <div className='form-text'>해당 음악이 맞으면 + 버튼을 눌러 추가하세요.</div>
                 </div>
            </div>
        )
    }
}

export default AddMusic;