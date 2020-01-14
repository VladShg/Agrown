import LangRu from "./LangRu"
import LangUa from "./LangUa"
import LangEn from "./LangEn"

export default class LangFactory {
    getLang(code) {
        if (code === 'en')
            return new LangEn()
        if (code === 'ru')
            return new LangRu()
        if (code === 'ua')
            return new LangUa()
    }
}