const crypto = require("crypto");
require("./base32.js");

class OTP {
    /**@see https://www.ietf.org/rfc/rfc4226.txt*/
    static hotp({ key, counter, algorithm = "sha1", digits = 6, encoding = "ascii" } = {}) {
        const keyBytes = Buffer.from(key, encoding);
        const counterBytes = Buffer.alloc(8);
        counterBytes.writeUInt32BE(counter, 4);
        const hash = crypto.createHmac(algorithm, keyBytes).update(counterBytes).digest("hex");
        const offset = parseInt(hash.charAt(hash.length - 1), 16);
        const result = parseInt(hash.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;
        return String(result).padStart(digits, "0").slice(-6);
    }

    /**@see https://datatracker.ietf.org/doc/html/rfc6238*/
    static totp({ key, T = Math.floor(Date.now() / 1000), T0 = 0, X = 30, algorithm = "sha1", digits = 6, encoding = "ascii" } = {}) {
        const counter = Math.floor((T - T0) / X);
        return OTP.hotp({ key, counter, algorithm, digits, encoding });
    }

    static randomKey({ algorithm, encoding = "base32" } = {}) {
        const bytes = { sha1: 20, sha256: 32, sha512: 64 };
        return Buffer.from(crypto.randomBytes(bytes[algorithm] / 2)).toString(encoding);
    }

    /**@see https://github.com/google/google-authenticator/wiki/Key-Uri-Format*/
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
