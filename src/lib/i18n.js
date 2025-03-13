/**
 * I18n class responsible for handling internationalization tasks such as message templating and data extraction.
 */
class I18n {
    /**
     * Escapes special characters for regex.
     * @param {string} str - The string to escape.
     * @returns {string} The escaped string.
     */
    static escapeRegex(str) {
        return str.replace(/[\.#| ]/g, "\\$&");
    }

    /**
     * Unescapes previously escaped regex characters.
     * @param {string} str - The string to unescape.
     * @returns {string} The unescaped string.
     */
    static unescapeRegex(str) {
        return str.replace(/\\([.#| ])/g, "$1");
    }

    /**
     * Replaces placeholders in a template string with values from a data object.
     * @param {string} template - The template string containing placeholders.
     * @param {Object} data - The data object containing values to replace the placeholders.
     * @returns {string} The template string with placeholders replaced by values from the data object.
     */
    static getMessage(template, data) {
        while (/\{(\w+)(?:\[(.*?)\])?\}/.test(template)) {
            template = template.replace(/\{(\w+)(?:\[(.*?)\])?\}/gs, ($0, name, repetition) => {
                const value = data[name] ?? "";
                if (Array.isArray(value)) {
                    return value.map((item) => repetition.replace(/\{(\w+)\}/g, (_, key) => item[key] ?? "")).join("");
                }
                return value;
            });
        }
        return template;
    }

    /**
     * Extracts data from a text string based on a template string with placeholders.
     * @param {string} template - The template string containing placeholders.
     * @param {string} text - The text string to extract data from.
     * @returns {Object} An object containing the extracted data.
     */
    static getData(template, text) {
        const repetition = {};
        const escapedTemplate = I18n.escapeRegex(template);
        const pattern =
            "^" +
            escapedTemplate.replace(/\{(\w+)\}/gs, "(?<$1>.*?)").replace(/\{(\w+)\[(.*?)\]\}/gs, ($0, name, repetitionPattern) => {
                repetition[name] = repetitionPattern;
                repetitionPattern = repetitionPattern.replace(/\?<\w+>/gs, "");
                return `(?<${name}>(${repetitionPattern}){1,})`;
            }) +
            "$";

        const matches = text.match(new RegExp(pattern));
        if (!matches?.groups) return {};

        for (const name in repetition) {
            const repetitionPattern = repetition[name];
            const regex = new RegExp(repetitionPattern, "gs");
            let match,
                result = [];

            while ((match = regex.exec(matches.groups[name])) !== null) {
                result.push(match.groups);
            }

            matches.groups[name] = result;
        }

        return matches.groups;
    }
}

module.exports = I18n;

// {
//     const template = `Produk {nama}\n{produk[{nama} {harga}\n]}`;

//     const text = I18n.getMessage(template, {
//         nama: "XL",
//         produk: [
//             { nama: "XL5", harga: 5000 },
//             { nama: "XL10", harga: 10000 },
//             { nama: "XL15", harga: 15000 },
//         ],
//     });
//     console.log(text);

//     const data = I18n.getData(template, text);
//     console.log(data);
// }

// // metode 1
// {
//     const template = `isi.{data[{kode}.{nopel}.]}{pin}`;

//     const text = I18n.getMessage(template, {
//         data: [
//             { kode: "XL5", nopel: '6281935155404' },
//             { kode: "XL10", nopel: '6281935155405' },
//             { kode: "XL15", nopel: '6281935155406' },
//         ],
//         pin: '1234'
//     });
//     console.log(text);

//     const data = I18n.getData(template, text);
//     console.log(data);
// }

// // metode 2
// {
//     const template = `isi.[{kode}.{nopel}.]{pin}`;

//     const text = I18n.getMessage(template, {
//         kode: [
//             "XL5",
//             "XL10",
//             "XL15",
//         ],
//         nopel: [
//             "6281935155404",
//             "6281935155405",
//             "6281935155406",
//         ],
//         pin: '1234'
//     });
//     console.log(text);

//     const data = I18n.getData(template, text);
//     console.log(data);
// }
