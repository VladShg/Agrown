import React, {Component} from 'react'

export default class ViewSelector extends Component {
    handleSetLanguage(langCode) {
        this.props.onLangChange(langCode)
    }

    render() {
        const t = this.props.dict
        return (
            <>
                <button class="dropdown-toggle btn btn-outline-light" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {t.d['lang']}
                </button>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <button class="dropdown-item" onClick={() => this.handleSetLanguage("en")}><img alt='Edit' style={{width: "20px", height: '20px', marginRight: "7px"}} src={process.env.PUBLIC_URL + '/en.png'}></img>{t.d['en']}</button>
                    <button class="dropdown-item" onClick={() => this.handleSetLanguage("ru")}><img alt='Edit' style={{width: "20px", height: '20px', marginRight: "7px"}} src={process.env.PUBLIC_URL + '/ru.png'}></img>{t.d['ru']}</button>
                    <button class="dropdown-item" onClick={() => this.handleSetLanguage("ua")}><img alt='Edit' style={{width: "20px", height: '20px', marginRight: "7px"}} src={process.env.PUBLIC_URL + '/ua.png'}></img>{t.d['ua']}</button>
                </div>
            </>
        )
    }
}