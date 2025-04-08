const crypto = require("crypto");
require("./base32.js");

/**
 * OTP class provides methods for generating and managing One-Time Passwords (OTP),
 * including HOTP, TOTP, random key generation, and OTP authentication URL creation.
 */
class OTP {
    /**
     * Generates a HMAC-based One-Time Password (HOTP).
     * @see https://www.ietf.org/rfc/rfc4226.txt
     * @param {Object} options - The parameters for generating HOTP.
     * @param {string} options.key - The secret key used for HOTP generation.
     * @param {number} options.counter - The counter value.
     * @param {string} [options.algorithm="sha1"] - The hash algorithm (sha1, sha256, sha512).
     * @param {number} [options.digits=6] - The number of digits in the OTP.
     * @param {string} [options.encoding="ascii"] - The encoding of the secret key.
     * @returns {string} The generated HOTP.
     */
    static hotp({ key, counter, algorithm = "sha1", digits = 6, encoding = "ascii" } = {}) {
        const keyBytes = Buffer.from(key, encoding);
        const counterBytes = Buffer.alloc(8);
        counterBytes.writeUInt32BE(counter, 4);
        const hash = crypto.createHmac(algorithm, keyBytes).update(counterBytes).digest("hex");
        const offset = parseInt(hash.charAt(hash.length - 1), 16);
        const result = parseInt(hash.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;
        return String(result).padStart(digits, "0").slice(-6);
    }

    /**
     * Generates a Time-based One-Time Password (TOTP).
     * @see https://datatracker.ietf.org/doc/html/rfc6238
     * @param {Object} options - The parameters for generating TOTP.
     * @param {string} options.key - The secret key used for TOTP generation.
     * @param {number} [options.T=Math.floor(Date.now() / 1000)] - The current time in seconds.
     * @param {number} [options.T0=0] - The Unix timestamp that defines the initial counter value.
     * @param {number} [options.X=30] - The time step in seconds.
     * @param {string} [options.algorithm="sha1"] - The hash algorithm (sha1, sha256, sha512).
     * @param {number} [options.digits=6] - The number of digits in the OTP.
     * @param {string} [options.encoding="ascii"] - The encoding of the secret key.
     * @returns {string} The generated TOTP.
     */
    static totp({ key, T = Math.floor(Date.now() / 1000), T0 = 0, X = 30, algorithm = "sha1", digits = 6, encoding = "ascii" } = {}) {
        const counter = Math.floor((T - T0) / X);
        return OTP.hotp({ key, counter, algorithm, digits, encoding });
    }

     /**
     * Generates a random secret key.
     * @param {Object} options - The parameters for key generation.
     * @param {string} options.algorithm - The hash algorithm (sha1, sha256, sha512).
     * @param {string} [options.encoding="base32"] - The encoding of the generated key.
     * @returns {string} The generated secret key.
     */
    static randomKey({ algorithm, encoding = "base32" } = {}) {
        const bytes = { sha1: 20, sha256: 32, sha512: 64 };
        return Buffer.from(crypto.randomBytes(bytes[algorithm] / 2)).toString(encoding);
    }

    /**
     * Generates an OTP Authentication URL and corresponding QR code.
     * @see https://github.com/google/google-authenticator/wiki/Key-Uri-Format
     * @param {Object} options - The parameters for OTP authentication.
     * @param {string} [options.type="totp"] - The OTP type (totp or hotp).
     * @param {string} [options.label="label"] - The label associated with the OTP.
     * @param {string} [options.secret] - The secret key for OTP generation.
     * @param {string} [options.issuer="issuer"] - The issuer name.
     * @param {string} [options.algorithm="sha1"] - The hash algorithm (sha1, sha256, sha512).
     * @param {number} [options.digits=6] - The number of digits in the OTP.
     * @param {number} [options.counter] - The counter value for HOTP.
     * @param {number} [options.period] - The time period for TOTP.
     * @returns {Object} An object containing the OTP URL and a QR code link.
     */
    static otpauth({ type = "totp", label = "label", secret, issuer = "issuer", algorithm = "sha1", digits = 6, counter, period } = {}) {
        if (secret === undefined) {
            secret = OTP.randomKey({ algorithm, encoding: "base32" });
        }

        if (counter === undefined && type === "hotp") {
            counter = 0;
        }

        if (period === undefined && type === "totp") {
            period = 30;
        }

        const url = new URL(`otpauth://${type}/${label}`);
        url.searchParams.set("type", type);
        url.searchParams.set("label", label);
        url.searchParams.set("secret", secret);
        url.searchParams.set("issuer", issuer);
        url.searchParams.set("algorithm", algorithm.toUpperCase());
        url.searchParams.set("digits", digits);

        if (counter !== undefined) {
            url.searchParams.set("counter", counter);
        }

        if (period !== undefined) {
            url.searchParams.set("period", period);
        }

        return { type, label, secret, issuer, algorithm, digits, counter, period, url: url.toString(), qrcode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url.toString())}` };
    }
}

module.exports = OTP;
