/**
 * Base32 class responsible for encoding and decoding data using Base32 encoding.
 */
class Base32 {
    /**
     * Alphabet used for Base32 encoding.
     * @type {string}
     */
    static alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    /**
     * Encodes a given buffer into a Base32 string.
     * @param {Buffer|string} buffer - The data to encode. If a string is provided, it will be converted into a Buffer.
     * @returns {string} The Base32 encoded string.
     * @throws {Error} If an invalid buffer is provided.
     */
    static encode(buffer) {
        if (!Buffer.isBuffer(buffer)) buffer = Buffer.from(buffer);

        let bits = "",
            encoded = "";

        for (const byte of buffer) {
            bits += byte.toString(2).padStart(8, "0");
        }

        bits = bits.padEnd(Math.ceil(bits.length / 5) * 5, "0");

        for (let i = 0; i < bits.length; i += 5) {
            encoded += Base32.alphabet[parseInt(bits.slice(i, i + 5), 2)];
        }

        return encoded;
    }

    /**
     * Decodes a Base32 encoded string into a Buffer.
     * @param {string} string - The Base32 encoded string to decode.
     * @returns {Buffer} The decoded data as a Buffer.
     * @throws {Error} If the string contains invalid Base32 characters.
     */
    static decode(string) {
        let bits = "",
            decoded = [];

        for (const char of string.toUpperCase().replace(/=+$/, "")) {
            const index = Base32.alphabet.indexOf(char);
            if (index === -1) throw new Error("Invalid Base32 character");
            bits += index.toString(2).padStart(5, "0");
        }

        bits = bits.slice(0, bits.length - (bits.length % 8));

        for (let i = 0; i < bits.length; i += 8) {
            decoded.push(parseInt(bits.slice(i, i + 8), 2));
        }

        return Buffer.from(decoded);
    }
}



/**
 * Overrides the Buffer.toString method to support Base32 encoding.
 * @param {string} encoding - The encoding type.
 * @param {...any} args - Additional arguments passed to the original toString method.
 * @returns {string} The encoded string if encoding is Base32, otherwise the original behavior.
 */
const originalToString = Buffer.prototype.toString;
Buffer.prototype.toString = function (encoding, ...args) {
    if (encoding === "base32") {
        return Base32.encode(this);
    }
    return originalToString.call(this, encoding, ...args);
};

/**
 * Overrides the Buffer.from method to support Base32 decoding.
 * @param {string} input - The Base32 encoded string.
 * @param {string} encoding - The encoding type.
 * @param {...any} args - Additional arguments passed to the original Buffer.from method.
 * @returns {Buffer} The decoded buffer if encoding is Base32, otherwise the original behavior.
 */
const originalFrom = Buffer.from;
Buffer.from = function (input, encoding, ...args) {
    if (encoding === "base32") {
        return Base32.decode(input);
    }
    return originalFrom.call(Buffer, input, encoding, ...args);
};

module.exports = Base32;
