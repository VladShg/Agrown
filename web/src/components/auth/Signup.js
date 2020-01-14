import React, {Component} from "react"
import {Redirect} from 'react-router-dom'

export default class Signup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            "login": "",
            "email": "",
            "password": "",
            "password_confirmation": "",
            "registrationErrors": ""
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        const t = this.props.dict
        if (this.state.password !== this.state.password_confirmation) {
            this.setState({registrationErrors: t.d['password_match']})
            event.preventDefault()
        } else {

        let data = {
            "login": this.state.login,
            "password": this.state.password,
            "email": this.state.email
        }
        let obj = {
            method: 'POST', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            redirect: 'follow', 
            referrer: 'no-referrer',
            body: JSON.stringify(data)
        }
        fetch(`${this.props.proxy}/api/signup`, obj).then(response => {
            response.json().then(data => {
                if(data['error'] !== undefined)
                    this.setState({'registrationErrors': data['error']})
                else {
                    this.props.onTokenChange(data['token'])
                }
            }
                
            )})
        event.preventDefault()
    }
    }
    
    render() {
        const t = this.props.dict
        return (
            <div>
                {this.props.token !== "" && 
                    <Redirect to="/profile"></Redirect>
                }
                <form className="auth-form" onSubmit={this.handleSubmit}>
                <h2>Sign up</h2>
                <br/>
                {this.state.registrationErrors === "" ? ("") :(
                    <div className="alert alert-danger">{this.state.registrationErrors}</div>
                )}
                    <div className="form-group">
                        <label>{t.d['profile_login']}</label>
                        <input
                            className="form-control"
                            type="text"
                            name='login'
                            placeholder={t.d['profile_login']}
                            value={this.state.login}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.d['profile_email']}</label>
                        <input
                            className="form-control"
                            type="email"
                            name='email'
                            placeholder={t.d['profile_email']}
                            value={this.state.email}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                    <div className="col">
                        <label>{t.d['password']}</label>
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder={t.d['password']}
                            value={this.state.password}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="col">
                        <label>{t.d['password_confirm_reg']}</label>
                        <input
                            className="form-control"
                            type="password"
                            name="password_confirmation"
                            placeholder={t.d['password_confirm_reg']}
                            value={this.state.password_confirmation}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    </div>
                    <br/>
                    <br/>
                        <button className="btn btn-primary" type="submit">{t.d['submit']}</button>
                    <div className="submit">
                    </div>
                </form>
            </div>
        );
    }
}