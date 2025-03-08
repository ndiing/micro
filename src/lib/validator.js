const converter = {
    type: (type, value) => {
        const types = {
            string: (val) => (val == null ? "" : String(val)),
            number: (val) => (isNaN(Number(val)) ? 0 : Number(val)),
            boolean: (val) => !!val,
        };

        return types[type] ? types[type](value) : value;
    },
};
const validator = {
    required: (expected = true, message = "required value") => {
        return (value) => {
            return (value !== undefined && value !== null && value !== "") === expected || message;
        };
    },

    minLength: (expected, message = `minimum ${expected} characters required`) => {
        return (value) => {
            return (typeof value === "string" && value.length >= expected) || message;
        };
    },

    maxLength: (expected, message = `maximum ${expected} characters allowed`) => {
        return (value) => {
            return (typeof value === "string" && value.length <= expected) || message;
        };
    },

    min: (expected, message = `value must be at least ${expected}`) => {
        return (value) => {
            return (typeof value === "number" && value >= expected) || message;
        };
    },

    max: (expected, message = `value must be at most ${expected}`) => {
        return (value) => {
            return (typeof value === "number" && value <= expected) || message;
        };
    },

    pattern: (expected, message = "invalid pattern") => {
        return (value) => {
            return (typeof value === "string" && expected.test(value)) || message;
        };
    },
};

function validate(schema, data) {
    const errors = {};
    const result = {};

    for (const name in schema) {
        const properties = schema[name];
        let value = data[name];

        for (const prop in properties) {
            if (converter[prop]) {
                value = converter[prop](properties[prop], value);
            }
        }

        result[name] = value;
        const errorMessages = [];

        for (const prop in properties) {
            if (validator[prop]) {
                const validation = validator[prop](properties[prop])(value);

                if (validation !== true) {
                    errorMessages.push(validation);
                }
            }
        }

        if (errorMessages.length) {
            errors[name] = errorMessages;
        }
    }

    return { result, errors };
}

module.exports = {
    converter,
    validator,
    validate,
};
// // usage
// // add custom validator

// validator.isEmail = (expected = true, message = "invalid email format") => {

//     return (value) => {

//         return (typeof value === "string" && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) || message;
//     };
// };
// // create schema
// const schema = {
//     user: { type: "string", required: true, minLength: 8 },
//     pass: { type: "string", required: true, minLength: 8, maxLength: 16 },
//     email: { type: "string", required: true, isEmail: true },
//     age: { type: "number", required: true, min: 17, max: 40 },
// };
// const data = {
//     user: "username",
//     pass: "password",
//     email: "ndiing.inc@gmail.com",
//     age: 35,
// };
// // validate data
// console.log(validate(schema, data));
