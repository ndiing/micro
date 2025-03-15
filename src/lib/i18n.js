const fs = require("fs");
const path = require("path");

class I18n {
    static getMessage(template='',data={}) {
        return template.replace(/\$\{(\w+)\}/gs,($,name) => {
            return data[name]
        })
    }
}

module.exports = I18n;

