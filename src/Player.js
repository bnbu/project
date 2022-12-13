import { Component } from 'react'
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';
import './player.css'

let current_music = null;
function getAudio(trackNumber, client_id) {
    return new Audio("https://api.soundcloud.com/tracks/" + trackNumber + '/stream?client_id=' + client_id)    
}

let volumeLine;
let timeLine;
let timeLineUpdater;
let time;
let current_time = current_music ? current_music.currentTime : 0;


class Player extends Component {
    defaultProps = {
        client_id : '0b84ba9d7d0084c784c5a6533160ea39'
    }
    
    state = {
        current_index : 0,
        title : 'select music',
        composer : 'select music',
        length : 0,
        volume : 1,
        play : 0,
        mute : 0,
    }

    constructor(props) {
        super(props);
        let music = this.props.music;
        let i = Number(sessionStorage.getItem('current_index'));
        let volume = Number(sessionStorage.getItem('currentVolume'));
        if (music.length > 0) {
            this.state.current_index = i;
            this.state.title = music[i].music_title;
            this.state.composer = music[i].composer;
            this.state.length = music[i].length;
            this.state.volume = volume;
            this.state.play = Number(sessionStorage.getItem('play'));
            this.state.mute = Number(sessionStorage.getItem('mute'));
        }
    }

    componentDidMount() {
        volumeLine = document.getElementById('current-volume');
        timeLine = document.getElementById('current-time');
        time = document.getElementById('time');

        volumeLine.setAttribute('style', 'width : ' + (this.state.volume * 100) + '%');
    }
    
    componentDidUpdate(prevProps, prevState) {
        let music = this.props.music;
        let i = Number(sessionStorage.getItem('current_index'));
        let volume = Number(sessionStorage.getItem('currentVolume'));
        if (prevProps.current_index !== this.props.current_index) {
            if (this.props.music.length > 0) {
                this.setState({
                    current_index : i,
                    title : music[i].music_title,
                    composer : music[i].composer,
                    length : music[i].length,
                    volume : volume,
                    play : 1
                }, () => {
                    sessionStorage.setItem('play', this.state.play)
                    this.playbyIndex(music, i);
                })
            }
        }
    }

    calcDuration = (duration) => {
        let totalSec = Math.floor(duration / 1000);
        let min = Math.floor(totalSec / 60);
        let sec = totalSec % 60 >= 10 ? totalSec % 60 : '0' + totalSec % 60;

        return min + ':' + sec;
    }

    playbyIndex = (music, i) => {
        clearInterval(timeLineUpdater);
        if (current_music) {
            current_music.currentTime = 0;
            current_music.pause();
            current_music = getAudio(music[i].track_num, this.defaultProps.client_id);
            current_music.volume = this.state.volume * 0.15;
        }
        else {
            current_music = getAudio(music[i].track_num, this.defaultProps.client_id);
            current_music.volume = this.state.volume * 0.15;
        }
        current_music.play();
        timeLineUpdater = setInterval(this.updateTimeLine, 200);
    }

    handlePlay = () => {
        let music = this.props.music;
        let i = Number(sessionStorage.getItem('current_index'));
        if (music.length > 0) {
            this.setState({
                play : this.state.play === 0 ? 1 : 0,
            }, () => {
                current_music = current_music ? current_music : getAudio(music[i].track_num, this.defaultProps.client_id);
                if (this.state.play === 1) {
                    current_music.volume = this.state.volume * 0.15;
                    current_music.play();
                    timeLineUpdater = setInterval(this.updateTimeLine, 200);
                }
                else {
                    current_music.pause();
                    clearInterval(timeLineUpdater);
                }
                sessionStorage.setItem('play', this.state.play)
            })
        }
    }

    updateTimeLine = () => {
        current_time = current_music.currentTime;
        let total = current_music.duration;
        timeLine.setAttribute('style', 'width: ' + (current_time / total * 100) + "%");
        time.innerHTML = this.calcDuration(current_time * 1000) + ' / ' + this.calcDuration(this.state.length);

        if (current_time === total) {
            this.loadNext()
        }
    }

    loadNext = () => {
        clearInterval(timeLineUpdater);
        let music = this.props.music;
            if (music.length > 0) {
            this.setState({
                current_index : (this.state.current_index + 1) % music.length,
            }, () => {
                this.setState({
                    title : music[this.state.current_index].music_title,
                    composer : music[this.state.current_index].composer,
                    length : music[this.state.current_index].length,
                    play : 1
                }, () => {
                    sessionStorage.setItem('play', this.state.play)
                    sessionStorage.setItem('current_index', this.state.current_index);
                    this.playbyIndex(music, this.state.current_index);
                })
            })
        }   
    }

    loadPrev = () => {
        clearInterval(timeLineUpdater);
        let music = this.props.music;
        if (music.length > 0) {
            this.setState({
                current_index : ((this.state.current_index - 1 < 0 ? this.state.current_index - 1 + music.length : this.state.current_index - 1 ))
            }, () => {
                this.setState({
                    title : music[this.state.current_index].music_title,
                    composer : music[this.state.current_index].composer,
                    length : music[this.state.current_index].length,
                    play : 1
                }, () => {
                    sessionStorage.setItem('play', this.state.play)
                    sessionStorage.setItem('current_index', this.state.current_index);
                    this.playbyIndex(music, this.state.current_index)
                })
            })
        }
    }

    controlTime = (e) => {
        let xPosition = e.nativeEvent.offsetX;
        let endPosition = e.target.offsetWidth;

        let percentage = (xPosition / endPosition) * 100;

        if (current_music) {
            timeLine.style.width = percentage + "%";
            let destination = Math.floor((xPosition / endPosition) * current_music.duration);
            current_time = destination;
            current_music.currentTime = destination;
            this.updateTimeLine()
        }
    }   

    controlVolume = (e) => {
        let xPosition = e.nativeEvent.offsetX;
        let endPosition = e.currentTarget.offsetWidth;

        let percentage = xPosition / endPosition;
        this.setState({
            volume : percentage,
            mute : percentage > 0 ? 0 : 1
        }, () => {
            sessionStorage.setItem('volume', this.state.volume)
            sessionStorage.setItem('currentVolume', this.state.volume)
            volumeLine.style.width = (percentage * 100) + '%';
            if (current_music) {
                current_music.volume = this.state.volume * 0.15;
            }
        })
    }

    handleMute = () => {
        // 1일떄 음소거
        if (this.state.mute === 0) {
            this.setState({
                mute : 1,
                volume : 0
            }, () => {
                sessionStorage.setItem('mute', this.state.mute);
                sessionStorage.setItem('currentVolume', this.state.volume)
                volumeLine.style.width = (this.state.volume * 100) + '%';
            if (current_music) {
                current_music.volume = this.state.volume * 0.15;
            }
            })
        }
        else {
            this.setState({
                mute : 0,
                volume : Number(sessionStorage.getItem('volume'))
            }, () => {
                sessionStorage.setItem('mute', this.state.mute);
                sessionStorage.setItem('volume', this.state.volume)
                volumeLine.style.width = (this.state.volume * 100) + '%';
            if (current_music) {
                current_music.volume = this.state.volume * 0.15;
            }
            })
        }
    }

    render() {
        return(
            <div>
                <div className="music-player">
                    <div className="music-player-upper">
                        <div className="music-title">
                            <p id="title">{this.state.title}</p>
                            <p id="composer">{this.state.composer}</p>
                        </div>
                        <div className="control-panel">
                            <button id="music-play" className="prev-btn" onClick={this.loadPrev}><Icon.SkipBackwardFill/></button>
                            <button id="music-play" className="play-btn" onClick={this.handlePlay}>
                                {this.state.play === 1 ? 
                                (<Icon.PauseFill />) :
                                (<Icon.PlayFill />)
                                }
                            </button>
                            <button id="music-play" className="next-btn" onClick={this.loadNext}><Icon.SkipForwardFill/></button>
                        </div>
                        <div className="volume-panel">
                            <div id='volume-icon'>
                                {this.state.volume === 0 ? 
                                (<Icon.VolumeMute size={35} onClick={this.handleMute} style={{cursor : 'pointer'}}/>) :
                                (<Icon.VolumeUp size={35} onClick={this.handleMute} style={{cursor : 'pointer'}}/>)
                                }
                            </div>
                            <div id="volume-line" onClick={this.controlVolume}>
                                <div id="total-volume"></div>
                                <div id="current-volume"></div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex duration-status">
                        <div id="timeline" onClick={this.controlTime}>
                            <div id="total-duration"></div>
                            <div id="current-time"></div>
                        </div>
                        <div className="col-2 time">
                            <p id="time">{this.calcDuration(current_time)} / {this.calcDuration(this.state.length)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Player;