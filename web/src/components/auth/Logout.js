import React, { Component } from "react"
import { Redirect} from 'react-router-dom'


export default class Logout extends Component {
    constructor(props) {
        super(props)

        this.componentDidMount = this.componentDidMount.bind(this)
    }
    componentDidMount() {
        this.props.onTokenChange("")
    }

    render() {
        return (
            <Redirect to="/">

            </Redirect>
        )
    }
}