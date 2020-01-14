export default class LangEn {
    constructor() {
        var data = require('./json/ru.json');
        this.d = data
    }

    confirmDelete(name) {
        return `Удалить ${name}?`
    }

    rangeLabel(editInterval) {
        let rangeLabel = `Повторять каждые ${editInterval} дней`;
        if (Number.parseInt(editInterval) === 0)
            rangeLabel = "Повторить 1 раз"
        if (Number.parseInt(editInterval) === 1)
            rangeLabel = "Повторить каждый день"
        return rangeLabel
    }
}