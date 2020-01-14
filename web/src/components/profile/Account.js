import React, {Component} from 'react'

export default class Account extends Component {

    constructor(props) {
        super(props)

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
            isLoading: true
        }

    }

    onHandleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const Child = this.props.child

        return (    
            <div>
                {this.state.isLoading === false && (
                    <Child {...this.props}/>
                )}
            </div>
        )
    }
}