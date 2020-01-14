import React, {Component} from "react"
import { Redirect} from 'react-router-dom'


export default class Login extends Component {
    constructor(props) {
        super(props)

        let error = ""
        if (props.error !== undefined)
            error = props.error

        this.state = {
            login : "",
            password : "",
            loginError: error
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        let data = {
            "login": this.state.login,
            "password": this.state.password
        }
        let obj = {
            method: 'POST', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
            'Content-Type': 'application/json',
            },
            redirect: 'follow', 
            referrer: 'no-referrer',
            body: JSON.stringify(data)
        }
        fetch(`${this.props.proxy}/api/login`, obj).then(response => {
            response.json().then(data => {
                if (data['error'] === undefined) {
                    this.props.onTokenChange(data['token'])
                } else {
                    this.setState({'loginError': data['error'] })
                }
        })})
    }

    render() {
        const t = this.props.dict
        return (
            <div>
            {this.props.token !== "" &&
                <Redirect to='/profile'>

                </Redirect>
            }
            <form className="auth-form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h2>{t.d['login']}</h2>
                {this.state.loginError === "" ? ("") : (
                    <div className="alert alert-danger">{this.state.loginError}</div>
                )}
                <div className='form-group'>
                    <label>{t.d['profile_login']}</label>
                    <input 
                    className="form-control"
                    name="login"
                    type="text"
                    placeholder={t.d['profile_login']}
                    onChange={this.handleChange}
                    value={this.state.login}
                    required
                    />
                </div>
                <div className='form-group'>
                    <label>{t.d['password']}</label>
                    <input 
                    className="form-control"
                    name='password'
                    type='password'
                    placeholder={t.d['password']}
                    onChange={this.handleChange}
                    value={this.state.password}
                    required
                    ></input>
                </div>
                <button className="btn btn-primary" type='submit'>{t.d['submit']}</button>
            </form>
            </div>
        )
    }
}
