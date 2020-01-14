import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

export default class Profile extends Component{
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmitInfo = this.handleSubmitInfo.bind(this)
        this.handleSubmitPassword = this.handleSubmitPassword.bind(this)

        let obj = {
            method: 'POST', 
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'token': props.token})
        }
        fetch(`${this.props.proxy}/api/profile`, obj).then(response => {
            response.json().then(obj => {
                try {
                    this.setState({
                        login: obj['login'],
                        email: obj['email'],
                        isLoading: false
                    })
                } catch(e) {
                    props.onTokenChange("")
                }
            })
        })
        this.state = {
            login: "",
            email: "",
            password: "",
            passwordConfirm: "",
            passwordOld: "",
            errorInfo: "",
            errorPassword: "",
            messageInfo: "",
            messagePassword: "",
            isLoading: true
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmitInfo(event) {
        event.preventDefault()
        this.setState({
            messageInfo: "",
            errorInfo: ""
        })

        let obj = {
            method: 'POST', 
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'token': this.props.token, 
                'email': this.state.email
            })
        }
        fetch(`${this.props.proxy}/api/update_user`, obj).then(response => {
            response.json().then(data => {
                if (data['error'] !== undefined) {
                    this.setState({
                        errorInfo: data['error']
                    })
                } else {
                    this.setState({
                        messageInfo: "Information updated"
                    })
                }
            })
        })
    }

    handleSubmitPassword(event) {
        event.preventDefault()
        this.setState({
            messagePassword: "",
            errorPassword: ""
        })

        if (this.state.passwordConfirm !== this.state.password) {
            this.setState({
                errorPassword: ""
            })
            return
        }

        let obj = {
            method: 'POST', 
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'token': this.props.token, 
                'password_old': this.state.passwordOld, 
                'password': this.state.password
            })
        }
        fetch(`${this.props.proxy}/api/change_password`, obj).then(response => {
            response.json().then(data => {
                if (data['error'] !== undefined) {
                    this.setState({
                        errorPassword: this.state.dict.d['password_error']
                    })
                } else {
                    this.setState({
                        messagePassword: this.state.dict.d['password_updated']
                    })
                }
            })
        })
    }

    render() {
        const t = this.props.dict
        return (
            <div className='body'>
            {this.state.isLoading === true ? ("") : (
                <div>
                {this.props.token === '' && (
                    <Redirect to="/login"/>
                )}
                <form onSubmit={this.handleSubmitInfo}>
                <h3>{t.d['profile']}</h3>
                <hr/>
                {this.state.messageInfo !== "" && (
                    <div className="alert alert-success">
                        {this.state.messageInfo}
                    </div>
                )}
                {this.state.errorInfo !== "" && (
                    <div className="alert alert-danger">
                        {this.state.errorInfo}
                    </div>
                )}
                <div className='form-group'>
                <label>{t.d['profile_login']}</label>
                <input
                    className='form-control'
                    defaultValue={this.state.login}
                    readOnly
                    name='login'
                    type='text'
                    placeholder={t.d['profile_login']}
                />
                <small>{t.d['profile_login_label']}</small>
                </div>
                <div className='form-group'>
                    <label>{t.d['profile_email']}</label>
                    <input
                        className='form-control'
                        value={this.state.email}
                        onChange={this.handleChange}
                        name="email"
                        type="email"
                        placeholder={t.d['profile_email']}
                    />
                    <small>{t.d['profile_email_label']}</small>
                </div>
                <button className="btn btn-primary" type='submit'>{t.d['update']}</button>
            </form>
            <br/>
            <h6>{t.d['password_change']}</h6>
            <hr></hr>
            {this.state.messagePassword !== "" && (
                    <div className="alert alert-success">
                        {this.state.messagePassword}
                    </div>
            )}
            {this.state.errorPassword !== "" && (
                <div className="alert alert-danger alert-dismissible">
                    {this.state.errorPassword}
                </div>
            )}
            <form onSubmit={this.handleSubmitPassword}>
                <div className="form-group">
                    <label>{t.d['password_current']}</label>
                    <input 
                        className='form-control'
                        required
                        type='password'
                        name='passwordOld'
                        placeholder={t.d['password_current']}
                        value={this.state.passwordOld}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>{t.d['password_new']}</label>
                    <input 
                        className='form-control'
                        required
                        type='password'
                        name='password'
                        placeholder={t.d['password_new']}
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>{t.d['password_confirm']}</label>
                    <input 
                        className='form-control'
                        required
                        type='password'
                        name='passwordConfirm'
                        placeholder={t.d['password_confirm']}
                        value={this.state.passwordConfirm}
                        onChange={this.handleChange}
                    />
                </div>
                <button className='btn btn-primary'>{t.d['update']}</button>
            </form>
            </div>
            )}
            </div>
        )
    }
}