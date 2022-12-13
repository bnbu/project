import { Component } from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Login from './Login'
import Core from './Core'
import Register from './Register'
import ChangePassword from './ChangePassword'

class App extends Component {
    render() {
        return (
            <Router>
                <Route exact path='/' component={Core} />
                <Route path='/board' component={Core} />
                <Route path='/myinfo' component={Core} />
                <Route path='/pwchange' component={Core} />
                <Route path='/music' component={Core} />
                <Route path='/addmusic' component={Core}/>
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register}/>
                <Route path='/forgetpw' component={ChangePassword}/>
            </Router>
        )
    }
}

export default App;