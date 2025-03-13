/**
 * @namespace Validator
 */

const validator = {
    required: (expected, message = "Value is required") => (value) =>
        (value !== undefined && value !== null) === expected || message,

    minLength: (expected, message = `Minimum length is ${expected} characters`) => (value) =>
        (typeof value === "string" && value.length >= expected) || message,

    maxLength: (expected, message = `Maximum length is ${expected} characters`) => (value) =>
        (typeof value === "string" && value.length <= expected) || message,

    pattern: (expected, message = "Value does not match the required pattern") => (value) =>
        (typeof value === "string" && expected.test(value)) || message,

    min: (expected, message = `Value must be at least ${expected}`) => (value) =>
        (typeof value === "number" && value >= expected) || message,

    max: (expected, message = `Value must be at most ${expected}`) => (value) =>
        (typeof value === "number" && value <= expected) || message,
};

const converter = {
    type: (expected, value) => {
        const types = {
            string: (value) => String(value ?? ""),
            number: (value) => (isNaN(Number(value)) ? 0 : Number(value)),
            boolean: (value) => (typeof value === "string" ? (value === "true" ? true : value === "1" ? true : false) : value ?? false),
        };
        return types[expected] ? types[expected](value) : value;
    },
};

/**
 * 
 * @memberof Validator
 */
function validate(schema, data) {
    const result = {};
    const errors = {};
    for (const name in schema) {
        let value = data[name];

        const properties = schema[name];

        for (const property in properties) {
            const expected = properties[property];

            const method = converter[property];
            if (method) {
                value = method(expected, value);
            }
        }

        result[name] = value;
        const messages = [];

        for (const property in properties) {
            const expected = properties[property];

            const method = validator[property];
            if (method) {
                const message = method(expected)(value);
                if (typeof message === "string") {
                    messages.push(message);
                }
            }
        }

        if (messages.length) {
            errors[name] = messages;
        }
    }

    return { result, errors };
}

module.exports = {
    validator,
    converter,
    validate,
};

