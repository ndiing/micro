const crypto = require("crypto");
const qrcode = require("qrcode");

/**
 * @namespace OTP
 */

const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encodes a buffer into a Base32 string.
 * @memberof OTP
 * @param {Buffer} buffer - The buffer to encode.
 * @returns {string} The Base32 encoded string.
 */
function base32Encode(buffer) {
    let bits = "",
        encoded = "";

    for (const byte of buffer) {
        bits += byte.toString(2).padStart(8, "0");
    }
    bits = bits.padEnd(Math.ceil(bits.length / 5) * 5, "0");

    for (let i = 0; i < bits.length; i += 5) {
        encoded += base32Chars[parseInt(bits.slice(i, i + 5), 2)];
    }

    return encoded;
}

/**
 * Decodes a Base32 string into a buffer.
 * @memberof OTP
 * @param {string} string - The Base32 string to decode.
 * @returns {Buffer} The decoded buffer.
 * @throws {Error} If the string contains invalid Base32 characters.
 */
function base32Decode(string) {
    let bits = "",
        decoded = [];

    for (const char of string.toUpperCase()) {
        let index = base32Chars.indexOf(char);
        if (index === -1) throw new Error("Invalid Base32 character");
        bits += index.toString(2).padStart(5, "0");
    }
    bits = bits.slice(0, bits.length - (bits.length % 8));

    for (let i = 0; i < bits.length; i += 8) {
        decoded.push(parseInt(bits.slice(i, i + 8), 2));
    }

    return Buffer.from(decoded);
}
const originalBufferFrom = Buffer.from;

Buffer.from = function (data, encoding) {
    if (encoding === "base32") {
        return base32Decode(data);
    }

    return originalBufferFrom.apply(Buffer, arguments);
};
const originalBufferToString = Buffer.prototype.toString;

Buffer.prototype.toString = function (encoding, ...args) {
    if (encoding === "base32") {
        return base32Encode(this);
    }

    return originalBufferToString.apply(this, arguments);
};

/**
 * Generates a HMAC-based One-Time Password (HOTP).
 * @memberof OTP
 * @param {Object} options - The options for generating the HOTP.
 * @param {string} options.key - The secret key used for generating the HOTP.
 * @param {number} options.counter - The counter value.
 * @param {string} [options.algorithm="sha1"] - The hash algorithm to use (e.g., "sha1", "sha256", "sha512").
 * @param {number} [options.digits=6] - The number of digits for the HOTP.
 * @param {string} [options.encoding="ascii"] - The encoding of the secret key.
 * @returns {string} The generated HOTP.
 */
function hotp({ key, counter, algorithm = "sha1", digits = 6, encoding = "ascii" }) {
    const keyBytes = Buffer.from(key, encoding);
    const counterBytes = Buffer.alloc(8);
    counterBytes.writeBigUInt64BE(BigInt(counter));
    const hash = crypto.createHmac(algorithm, keyBytes).update(counterBytes).digest();
    const offset = hash[hash.length - 1] & 0xf;
    const result = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);

    return String(result).padStart(digits, "0").slice(-digits);
}

/**
 * Generates a Time-based One-Time Password (TOTP).
 * @memberof OTP
 * @param {Object} options - The options for generating the TOTP.
 * @param {string} options.key - The secret key used for generating the TOTP.
 * @param {number} [options.T=Math.floor(Date.now() / 1000)] - The current time in seconds.
 * @param {number} [options.T0=0] - The start time in seconds.
 * @param {number} [options.X=30] - The time step in seconds.
 * @param {string} [options.algorithm="sha1"] - The hash algorithm to use (e.g., "sha1", "sha256", "sha512").
 * @param {number} [options.digits=6] - The number of digits for the TOTP.
 * @param {string} [options.encoding="ascii"] - The encoding of the secret key.
 * @returns {string} The generated TOTP.
 */
function totp({ key, T=Math.floor(Date.now() / 1000), T0 = 0, X = 30, algorithm = "sha1", digits = 6, encoding = "ascii", }) {

    return hotp({ key, counter :Math.floor((T - T0) / X), algorithm, digits, encoding });
}

/**
 * Generates an otpauth URL and corresponding QR code for OTP configuration.
 * @memberof OTP
 * @param {Object} options - The options for generating the otpauth URL.
 * @param {string} [options.type="totp"] - The type of OTP (e.g., "hotp", "totp").
 * @param {string} [options.label="label"] - The label for the OTP.
 * @param {string} [options.secret] - The secret key for the OTP.
 * @param {string} [options.issuer] - The issuer of the OTP.
 * @param {string} [options.algorithm="sha1"] - The hash algorithm to use (e.g., "sha1", "sha256", "sha512").
 * @param {number} [options.digits=6] - The number of digits for the OTP.
 * @param {number} [options.counter=0] - The counter value for HOTP.
 * @param {number} [options.period=30] - The time period in seconds for TOTP.
 * @returns {Promise<Object>} A promise that resolves with the OTP configuration and QR code.
 */
function otpauth({ type = "totp", label = "label", secret, issuer, algorithm = "sha1", digits = 6, counter = 0, period = 30 } = {}) {
    const url = new URL(`otpauth://${type}/${label}`);

    if (!secret) {
        const bytes = {
            sha1: 20,
            sha256: 32,
            sha512: 64,
        };
        secret = Buffer.from(crypto.randomBytes(bytes[algorithm] / 2)).toString("base32");
    }
    url.searchParams.set("secret", secret);

    if (issuer) {
        url.searchParams.set("issuer", issuer);
    }
    url.searchParams.set("algorithm", algorithm);
    url.searchParams.set("digits", digits);

    if (type === "hotp") {
        url.searchParams.set("counter", counter);
    }

    if (type === "totp") {
        url.searchParams.set("period", period);
    }

    return new Promise((resolve, reject) => {
        qrcode.toDataURL(url.toString(), (err, qrImage) => {
            if (err) {
                return reject(err);
            }
            resolve({
                type,
                label,
                secret,
                issuer,
                algorithm,
                digits,
                counter,
                period,
                url: url.toString(),
                qr: qrImage,
            });
        });
    });
}

module.exports = {
    base32Encode,
    base32Decode,
    hotp,
    totp,
    otpauth,
};
