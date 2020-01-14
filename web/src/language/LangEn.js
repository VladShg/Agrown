export default class LangEn {
    constructor() {
        var data = require('./json/en.json');
        this.d = data
    }

    confirmDelete(name) {
        return `Delete ${name}?`
    }

    rangeLabel(editInterval) {
        let rangeLabel = `Repeat every ${editInterval} days`;
        if (Number.parseInt(editInterval) === 0)
            rangeLabel = "Repeat once"
        if (Number.parseInt(editInterval) === 1)
            rangeLabel = "Repeat every day"
        return rangeLabel
    }
}