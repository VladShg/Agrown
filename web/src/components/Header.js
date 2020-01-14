import React, { Component } from "react"
import {Link, BrowserRouter, Route, Switch} from "react-router-dom"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import NotFound from "./NotFound"
import Profile from "./Profile"
import Account from "./profile/Account"
import Home from "./Home"
import ViewSelector from "./ViewSelector"
import Logout from "./auth/Logout"
import Drones from './profile/Drones'
import Flights from './profile/Flights'
import Areas from './profile/Areas'


export default class Heder extends Component {

  render() {
    let token = this.props.token
    const t = this.props.dict
    return (
      <div className="app">
        <BrowserRouter>
        <div>
            <nav>
                <ul className='header' style={{listStyleType: "none"}}>
                    <li className='li-left'><Link to="/">Agrown</Link></li>
                    {token !== "" ? (
                        <li className='li-right'><Link to="/logout">{t.d['logout']}</Link></li>
                        ) : (
                            <li className='li-right'><Link to="/login">{t.d['login']}</Link></li>
                        )}
                    {token !== "" ? (
                        <li className='li-right'><Link to="/profile">{t.d['profile']}</Link></li>
                        ) : (
                            <li className='li-right'><Link to="/signup">{t.d['signup']}</Link></li>
                        )}
                    {token !== "" && (
                        <li className='li-right'><Link to="/account">{t.d['home']}</Link></li>
                    )}
                    <li className='li-right'><ViewSelector dict={this.props.dict} lang={this.props.lang} onLangChange={this.props.onLangChange}/></li>
                </ul>
            </nav>
        </div>
        <div className ="body">
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path={["/account/drones", "/account"]}>
                            <Account {...this.props} child={Drones}/>
                        </Route>
                        <Route exact path="/account/areas">
                            <Account {...this.props} child={Areas}/>
                        </Route>
                        <Route exact path="/account/flights">
                            <Account {...this.props} child={Flights}/>
                        </Route>
                        <Route exact path="/signup">
                            <Signup {...this.props}/>
                        </Route>
                        <Route exact path="/login">
                            <Login {...this.props}/>
                        </Route>
                        <Route exact path="/logout">
                            <Logout {...this.props}/>
                        </Route>
                        <Route exact path="/profile">
                            <Profile {...this.props}/>
                        </Route>
                        <Route exact>
                            <NotFound {...this.props}/>
                        </Route>
                    </Switch>
        </div>
        </BrowserRouter>
      </div>
    )
  }
}
