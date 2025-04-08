/**
 * Converter class provides utility methods for type conversion.
 */
class Converter {
    /**
     * Converts a value into the expected data type.
     * @param {string} expected - The expected data type ("string", "number", "boolean", "date").
     * @param {*} value - The value to convert.
     * @returns {*} The converted value.
     */
    static type(expected, value) {
        switch (expected) {
            case "string":
                return value == null ? "" : String(value);

            case "number":
                const num = Number(value);
                return isNaN(num) ? 0 : num;

            case "boolean":
                if (typeof value === "string") {
                    return ["true", "1"].includes(value.toLowerCase());
                }
                return Boolean(value);

            case "date":
                const date = new Date(value);
                return isNaN(date.getTime()) ? null : date;

            default:
                return value;
        }
    }
}

/**
 * Validator class provides utility methods for validating different data constraints.
 */
class Validator {
    /**
     * Ensures a value is present and not empty.
     * @param {boolean} _expected - Ignored, kept for compatibility.
     * @param {string} [message="This field is required."] - Custom error message.
     * @returns {Function} A validation function.
     */
    static required(_expected, message = `This field is required.`) {
        return (value) => {
            if (value === undefined || value === null || value === "" || (typeof value === "number" && isNaN(value))) {
                return message;
            }
        };
    }

    /**
     * Ensures a string or array has at least the specified minimum length.
     * @param {number} expected - Minimum length required.
     * @param {string} [message] - Custom error message.
     * @returns {Function} A validation function.
     */
    static minLength(expected, message = `Please lengthen this text to at least ${expected} characters.`) {
        return (value) => {
            if (typeof value !== "string" && !Array.isArray(value)) return message;
            if (value.length < expected) return message;
        };
    }

    /**
     * Ensures a string or array does not exceed the specified maximum length.
     * @param {number} expected - Maximum length allowed.
     * @param {string} [message] - Custom error message.
     * @returns {Function} A validation function.
     */
    static maxLength(expected, message = `Please shorten this text to ${expected} characters or less.`) {
        return (value) => {
            if (typeof value !== "string" && !Array.isArray(value)) return message;
            if (value.length > expected) return message;
        };
    }

    /**
     * Ensures a number or date is at least the specified value.
     * @param {number|Date} expected - Minimum value required.
     * @param {string} [message] - Custom error message.
     * @returns {Function} A validation function.
     */
    static min(expected, message = `Value must be ${expected} or more.`) {
        return (value) => {
            if (typeof value !== "number" && !(value instanceof Date)) return message;
            if (value < expected) return message;
        };
    }

    /**
     * Ensures a number or date does not exceed the specified value.
     * @param {number|Date} expected - Maximum value allowed.
     * @param {string} [message] - Custom error message.
     * @returns {Function} A validation function.
     */
    static max(expected, message = `Value must be ${expected} or less.`) {
        return (value) => {
            if (typeof value !== "number" && !(value instanceof Date)) return message;
            if (value > expected) return message;
        };
    }

    /**
     * Ensures a string matches a specified regular expression pattern.
     * @param {RegExp} expected - Regular expression pattern.
     * @param {string} [message="Please match the requested format."] - Custom error message.
     * @returns {Function} A validation function.
     */
    static pattern(expected, message = `Please match the requested format.`) {
        return (value) => {
            if (typeof value !== "string") return message;
            if (!expected.test(value)) return message;
        };
    }
}

/**
 * Validation class manages schema-based validation and type conversion.
 */
class Validation {
    /**
     * Creates an instance of the Validation class.
     * @param {Object} schema - Schema defining validation rules.
     */
    constructor(schema) {
        this.schema = schema;
    }

    /**
     * Validates input data against the schema.
     * @param {Object} data - The data to validate.
     * @returns {Object} The validated result and any validation errors.
     */
    validate(data) {
        const { result, errors } = this.validateSchema(this.schema, data);
        return { result, errors: Object.keys(errors).length ? errors : null };
    }

    /**
     * Recursively validates schema properties.
     * @param {Object} schema - Schema defining validation rules.
     * @param {Object} [data={}] - The data to validate.
     * @param {string} [path=""] - Path tracking nested validation.
     * @returns {Object} The validated result and validation errors.
     */
    validateSchema(schema, data = {}, path = "") {
        const result = {};
        const errors = {};

        for (const key in schema) {
            const fullPath = path ? `${path}.${key}` : key;
            const props = schema[key];
            const defaultValue = typeof props.defaultValue === "function" ? props.defaultValue() : props.defaultValue;

            let value = data?.[key] ?? defaultValue;

            // Handle object
            if (props.type === "object" && typeof props.schema === "object") {
                const { result: nestedResult, errors: nestedErrors } = this.validateSchema(props.schema, value || {}, fullPath);
                result[key] = nestedResult;
                if (Object.keys(nestedErrors).length) Object.assign(errors, nestedErrors);
                continue;
            }

            // Handle array of object
            if (props.type === "array" && Array.isArray(value) && typeof props.items?.schema === "object") {
                result[key] = [];
                for (let i = 0; i < value.length; i++) {
                    const itemValue = value[i];
                    const { result: itemResult, errors: itemErrors } = this.validateSchema(props.items.schema, itemValue, `${fullPath}[${i}]`);
                    result[key].push(itemResult);
                    if (Object.keys(itemErrors).length) Object.assign(errors, itemErrors);
                }
                continue;
            }

            // Conversion
            for (const name in props) {
                const expected = props[name];
                const converter = Validation.Converter[name];
                if (!converter) continue;
                value = converter(expected, value);
            }

            result[key] = value;

            // Validation
            const messages = [];
            for (const name in props) {
                const expected = props[name];
                const validator = Validation.Validator[name];
                if (!validator) continue;
                const message = validator(expected)(value);
                if (message) messages.push(message);
            }

            if (messages.length) {
                errors[fullPath] = messages;
            }
        }

        return { result, errors };
    }
}

Validation.Converter = Converter;
Validation.Validator = Validator;

module.exports = Validation;
