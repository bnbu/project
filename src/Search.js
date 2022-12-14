import { Component } from "react";
import { Link } from 'react-router-dom'
import './Board.css'

class Search extends Component {
    state = {
        post : [],
        commentNum : [],
        currentpage : 1,
        startpage : 1,
        endpage : 10,
        maxpage : 1,
        search_type : 1,
        keyword : ''
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match !== this.props.match) {
            this.getPost(this.callback);
        }
    }

    getPost = (callback) => {
        let type = Number(this.props.match.params.type);
        let keyword = this.props.match.params.keyword;
        if (type === 1) {
            fetch('/api/search/postbytitle/' + keyword)
                .then(res => res.json())
                .then(data => callback(data));
        }
        else if (type === 2) {
            fetch('/api/search/postbyname/' + keyword)
                .then(res => res.json())
                .then(data => callback(data));
        }
        else {
            fetch('/api/search/mypost/' + keyword)
                .then(res => res.json())
                .then(data => callback(data));
        }
    }

    callback = (post) => {
        let maxPageData, currentpageData;
        maxPageData =  Math.ceil(post.length / 15);
        currentpageData = Number(this.props.match.params.pagenum)

        if (currentpageData % 10 === 0)
            this.setState({
                post : post,
                maxpage : maxPageData,
                currentpage : currentpageData,
                startpage : (Math.floor(currentpageData / 10) - 1) * 10 + 1,
                endpage : (Math.floor(currentpageData / 10) - 1) * 10 + 10
            })

        else
            this.setState({
                post : post,
                maxpage : maxPageData,
                currentpage : currentpageData,
                startpage : (Math.floor(currentpageData / 10)) * 10 + 1,
                endpage : (Math.floor(currentpageData / 10)) * 10 + 10
            })

    }

    constructor(props) {
        super(props);
        this.getPost(this.callback);
    }

    getFormatDate(date){
        var year = date.getFullYear();
        var month = (1 + date.getMonth());
        month = month >= 10 ? month : '0' + month;
        var day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    }
    
    moveToView = (e) => {
        fetch('/api/add/count', {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                post_num : Number(e.target.value)
            })
        })
        .then(res => res.json())
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }  

    render() {
        const today = this.getFormatDate(new Date());
        let arr = Array.from({length : (this.state.endpage < this.state.maxpage ? this.state.endpage : this.state.maxpage) - this.state.startpage + 1}, (_, i) => i + this.state.startpage);
        let postarr = Array.from({length : (15 > this.state.post.length - 15*(this.state.currentpage - 1) ? this.state.post.length - 15*(this.state.currentpage - 1) : 15)},
                                 (_, i) => i + 15*(this.state.currentpage - 1))
        let postList;
        if (this.state.post.length > 0) {
            postList = postarr.map(i => 
                (<tr>
                    <td>{this.state.post[i].post_num}</td>
                    <td>
                    <Link to={'/board/view/' + this.state.post[i].post_num}><button className="board_title" onClick={this.moveToView} value={this.state.post[i].post_num}>{this.state.post[i].post_title}</button></Link>
                        {this.state.post[i].comment_count > 0 ? ('[' + this.state.post[i].comment_count + ']') : ('')}
                    </td>
                    <td>{this.state.post[i].nickname}</td>
                    <td>{this.state.post[i].write_date.split(' ')[0] === today ?
                        this.state.post[i].write_date.split(' ')[1] : 
                        this.state.post[i].write_date.split(' ')[0]}</td>
                    <td>{this.state.post[i].read_count}</td>
                </tr>)
            )
        }
        const prevpage = <Link to={'/board/search/' + this.state.search_type + '/' + this.state.keyword + '/' + (this.state.startpage - 10)}><button type='button' className='btn btn-outline-primary' onClick={this.handleClickPrev}>??????</button></Link>
        const nextpage = <Link to={'/board/search/' + this.state.search_type + '/' + this.state.keyword + '/' + (this.state.startpage + 10)}><button type='button' className='btn btn-outline-primary' onClick={this.handleClickNext}>??????</button></Link>
        const pagingList = arr.map(i => (
                i === this.state.currentpage ? 
                (<Link to={'/board/search/' + this.state.search_type + '/' + this.state.keyword + '/' + i}><button type='button' className='btn btn-primary' checked>{i}</button></Link>) :
                (<Link to={'/board/search/' + this.state.search_type + '/' + this.state.keyword + '/' + i}><button type='button' className='btn btn-outline-primary'>{i}</button></Link>)
            ));
        
         return(
            <div className='border'>
                <div id='border-wrap'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th className='col-1' scope='col'>#</th>
                                <th className='col-5' scope='col'>??????</th>
                                <th className='col-3' scope='col'>?????????</th>
                                <th className='col-2' scope='col'>?????????</th>
                                <th className='col-1' scope='col'>?????????</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postList}
                        </tbody>
                    </table>
                </div>
                <div id='etc'>
                    <div id='search_box' class='input-group mb-4'>
                      <select className='form-select' name='search_type' id="search_type" onChange={this.handleChange} value={this.state.search_type}>
                          <option value='1'>??????</option>
                          <option value='2'>?????????</option>
                      </select>
                      <input class="form-control" name='keyword' onChange={this.handleChange}></input>
                      <Link to={'/board/search/' + this.state.search_type + '/' + this.state.keyword + '/1'}><div class='btn btn-outline-primary'>??????</div></Link>
                    </div>
                    <div id='edit_box'>
                        <Link to='/board/write'><div className='btn btn-primary'>?????????</div></Link>
                    </div>
                </div>
                <div id='paging'>
                    <div className='btn-group' role='group'>
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
        )
    }
}

export default Search;