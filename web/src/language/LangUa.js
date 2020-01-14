export default class LangEn {
    constructor() {
        var data = require('./json/ua.json');
        this.d = data
    }

    confirmDelete(name) {
        return `Видалити ${name}?`
    }

    rangeLabel(editInterval) {
        let rangeLabel = `Повторювати кожні ${editInterval} днів`;
        if (Number.parseInt(editInterval) === 0)
            rangeLabel = "Повторити 1 раз"
        if (Number.parseInt(editInterval) === 1)
            rangeLabel = "Повторювати щодня"
        return rangeLabel
    }
}