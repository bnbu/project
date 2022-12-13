import { Component } from 'react'
import { Link } from 'react-router-dom'
import * as Icon from 'react-bootstrap-icons';
import './Music.css'

class Music extends Component {
    defaultProps = {
        client_id : '0b84ba9d7d0084c784c5a6533160ea39'
    }

    state = {
        music : JSON.parse(sessionStorage.getItem('music')),
        currentpage : 1,
        startpage : 1,
        endpage : 10,
        maxpage : 1
    }

    constructor(props) {
        super(props);
        let maxPageData, currentpageData;
        maxPageData =  Math.ceil(this.state.music.length / 6);
        this.props.match.params.pagenum ? currentpageData = Number(this.props.match.params.pagenum) : window.location.href = '/music/page/1';
        if (currentpageData % 10 === 0) {
            this.state.maxpage = maxPageData;
            this.state.currentpage = currentpageData;
            this.state.startpage = (Math.floor(currentpageData / 10) - 1) * 10 + 1;
            this.state.endpage = (Math.floor(currentpageData / 10) - 1) * 10 + 10;
        }
        else {
            this.state.maxpage = maxPageData;
            this.state.currentpage = currentpageData;
            this.state.startpage = (Math.floor(currentpageData / 10)) * 10 + 1;
            this.state.endpage = (Math.floor(currentpageData / 10)) * 10 + 10;
        }
    }
    
    componentDidUpdate(prevProps) {
        if(prevProps.match !== this.props.match) {
            this.setState({
                currentpage : Number(this.props.match.params.pagenum)
            })
        }
    }

    calcDuration = (duration) => {
        let totalSec = Math.floor(duration / 1000);
        let min = Math.floor(totalSec / 60);
        let sec = totalSec % 60 > 10 ? totalSec % 60 : '0' + totalSec % 60;

        return min + ':' + sec
    }

    handleMusicPlay = (e) => {
        this.props.setMusicIndex(e.currentTarget.value);
    }

    handleDelete = (e) => { 
        let confirm = window.confirm("노래를 리스트에서 삭제하시겠습니까?")
        if (confirm) {
            fetch("/api/delete/musiclist", {
                method : 'DELETE',
                headers : {
                  'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                  u_id : sessionStorage.getItem('u_id'),
                  track_num : this.state.music[e.currentTarget.value].track_num
                })
            })
            .then(res => res.json())
            .then(data => data.serverStatus === 2 ?
               (() => {
                   alert('삭제를 완료했습니다')
                   fetch('/api/search/music/' + sessionStorage.getItem('u_id'))
                    .then(res => res.json())
                    .then(data => {
                      console.log(data);
                      if (data.length !== 0) {
                        sessionStorage.setItem('music', JSON.stringify(data));
                        window.location.href = '/music/page/1';
                      }
                      else {
                        sessionStorage.setItem('music', JSON.stringify(data));
                        window.location.href = '/music/page/1';
                      }
            });
               })()
                : alert("에러 발생"))
        }
    }

    render() {
        let arr = Array.from({length : (this.state.endpage < this.state.maxpage ? this.state.endpage : this.state.maxpage) - this.state.startpage + 1}, (_, i) => i + this.state.startpage);
        let musicArr = Array.from({length : (6 > this.state.music.length - 6*(this.state.currentpage - 1) ? this.state.music.length - 6*(this.state.currentpage - 1) : 6)},
                                 (_, i) => i + 6*(this.state.currentpage - 1))
        let musicList;
        if (this.state.music.length > 0) {
            musicList = musicArr.map(i => 
                (
                    <li className='list-group-item d-flex justify-content-between align-items-start ms_list'>
                        <button className='btn musicPlayBtn' value={i} onClick={this.handleMusicPlay}><Icon.PlayFill opacity={'0.85'} color={'white'} size={75}/></button>
                        <img src={this.state.music[i].thumbnail_url} width='100px' height='100px'className='rounded ms_img' alt='thumbnail'></img>
                        <div className='ms-2 me-auto'>
                            <div className='fw-bold fs-5 ms_title'>{this.state.music[i].music_title}</div>
                            <p className='fs-6'></p>
                            <div style={{ fontSize: "14px" }} className='ms_composer'>{this.state.music[i].composer}</div>
                            <div style={{ fontSize: "14px" }} className='ms_length'>{this.calcDuration(this.state.music[i].length)}</div>
                        </div>
                        <button className='btn mu_del' onClick={this.handleDelete} value={i}><Icon.XLg /></button>
                     </li>
                ))
        }
        const prevpage = <Link to={'/music/page/' + (this.state.startpage - 10)}><button type='button' className='btn btn-outline-primary' onClick={this.handleClickPrev}>이전</button></Link>
        const nextpage = <Link to={'/music/page/' + (this.state.startpage + 10)}><button type='button' className='btn btn-outline-primary' onClick={this.handleClickNext}>다음</button></Link>
        const pagingList = arr.map(i => (
            i === this.state.currentpage ? 
            (<Link to={'/music/page/' + i}><button type='button' className='btn btn-primary'>{i}</button></Link>) :
            (<Link to={'/music/page/' + i}><button type='button' className='btn btn-outline-primary'>{i}</button></Link>)
        ));
        return (
            <div>
                <div id='play_list'>
                    <ul className='list-group list-group' id='music_list'>
                       {musicList}
                    </ul>
                    <div id='paging'>
                        <div className='btn-group' role='group' id='pagingBtn'>
                        {(() => {
                            if (this.state.startpage !== 1)
                            return prevpage;
                        })()}
                        {pagingList}
                        {
                            (() => {
                                if (this.state.endpage < this.state.maxpage)
                                return nextpage;
                            })()
                        }
                        </div>  
                    </div>
                </div>
            </div>
        )
    }
}

export default Music;