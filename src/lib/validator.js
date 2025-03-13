/**
 * @namespace Validator
 */

const validator = {
    /**
     * Validates if a value is required.
     * @param {boolean} expected - The expected presence of the value (true for required).
     * @param {string} [message="Value is required"] - The error message to return if validation fails.
     * @returns {Function} The validation function.
     */
    required: (expected, message = "Value is required") => (value) =>
        (value !== undefined && value !== null) === expected || message,

    /**
     * Validates the minimum length of a string.
     * @param {number} expected - The expected minimum length.
     * @param {string} [message=`Minimum length is ${expected} characters`] - The error message to return if validation fails.
     * @returns {Function} The validation function.
     */
    minLength: (expected, message = `Minimum length is ${expected} characters`) => (value) =>
        (typeof value === "string" && value.length >= expected) || message,

    /**
     * Validates the maximum length of a string.
     * @param {number} expected - The expected maximum length.
     * @param {string} [message=`Maximum length is ${expected} characters`] - The error message to return if validation fails.
     * @returns {Function} The validation function.
     */
    maxLength: (expected, message = `Maximum length is ${expected} characters`) => (value) =>
        (typeof value === "string" && value.length <= expected) || message,

    /**
     * Validates if a value matches a regular expression pattern.
     * @param {RegExp} expected - The regular expression pattern.
     * @param {string} [message="Value does not match the required pattern"] - The error message to return if validation fails.
     * @returns {Function} The validation function.
     */
    pattern: (expected, message = "Value does not match the required pattern") => (value) =>
        (typeof value === "string" && expected.test(value)) || message,

    /**
     * Validates if a number is greater than or equal to a minimum value.
     * @param {number} expected - The expected minimum value.
     * @param {string} [message=`Value must be at least ${expected}`] - The error message to return if validation fails.
     * @returns {Function} The validation function.
     */
    min: (expected, message = `Value must be at least ${expected}`) => (value) =>
        (typeof value === "number" && value >= expected) || message,

    /**
     * Validates if a number is less than or equal to a maximum value.
     * @param {number} expected - The expected maximum value.
     * @param {string} [message=`Value must be at most ${expected}`] - The error message to return if validation fails.
     * @returns {Function} The validation function.
     */
    max: (expected, message = `Value must be at most ${expected}`) => (value) =>
        (typeof value === "number" && value <= expected) || message,
};

const converter = {
    /**
     * Converts a value to the expected type.
     * @param {string} expected - The expected type (e.g., "string", "number", "boolean").
     * @param {*} value - The value to convert.
     * @returns {*} The converted value.
     */
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
 * Validates and converts data based on a schema.
 * @memberof Validator
 * @param {Object} schema - The schema defining the validation and conversion rules.
 * @param {Object} data - The data to validate and convert.
 * @returns {Object} The result object containing the converted values and any validation errors.
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

