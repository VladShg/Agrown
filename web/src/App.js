import React, { Component } from "react";
import Header from "./components/Header";
import cookie from 'react-cookies'
import "./App.css";
import "./bootstrap.css"
import LangFactory from "./language/LangFactory"

export default class App extends Component {
    constructor(props) {
        super(props)

        let token = cookie.load('token')
        if (token === undefined || token === "undefined") {
            token = ""
            cookie.save('token', token, { path: '/' })
        }
        let lang = cookie.load('lang')
        if (lang === undefined || lang === "undefined") {
            lang = 'en'
            cookie.save('lang', lang, {path: '/'})
        }
        
        let l = new LangFactory()
        let dict = l.getLang(lang)
        this.state = {
            token: token,
            proxy: "http://localhost:5000",
            mapApiKey: 'AIzaSyD3w9XktRCvemwl24foVwZhE0CBzStHsYA',
            mapCenter: {lat: 49.277355, lng: 32.701082 },
            lang: lang,
            dict: dict
        }

        this.onTokenChange = this.onTokenChange.bind(this)
        this.onLangChange = this.onLangChange.bind(this)
    }

    onLangChange(lang) {
        let l = new LangFactory()
        let dict = l.getLang(lang)
        this.setState({lang: lang, dict: dict})
        cookie.save('lang', lang, {path: '/'})
    }

    onTokenChange(token) {
        this.setState({token: token})
        cookie.save('token', token, { path: '/' })
    }

    render() {
        return (
            <div className="App">
                <Header 
                    proxy={this.state.proxy} 
                    token={this.state.token} 
                    onTokenChange={this.onTokenChange}
                    mapCenter={this.state.mapCenter}
                    mapApiKey={this.state.mapApiKey}
                    lang={this.state.lang}
                    dict={this.state.dict}
                    onLangChange={this.onLangChange} />
            </div>
        );
    }
}