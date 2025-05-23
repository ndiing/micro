const crypto = require("crypto");

/**
 * Signer class provides cryptographic signing functions for various algorithms.
 */
class Signer {
    /**
     * Signs data using HMAC with SHA-256.
     * @param {string|Buffer} data - The data to sign.
     * @param {string|Buffer} key - The secret key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static HS256(data, key) {
        return crypto.createHmac("sha256", key).update(data).digest("base64url");
    }

    /**
     * Signs data using HMAC with SHA-384.
     * @param {string|Buffer} data - The data to sign.
     * @param {string|Buffer} key - The secret key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static HS384(data, key) {
        return crypto.createHmac("sha384", key).update(data).digest("base64url");
    }

    /**
     * Signs data using HMAC with SHA-512.
     * @param {string|Buffer} data - The data to sign.
     * @param {string|Buffer} key - The secret key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static HS512(data, key) {
        return crypto.createHmac("sha512", key).update(data).digest("base64url");
    }

    /**
     * Signs data using RSA with SHA-256.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static RS256(data, key) {
        return crypto.sign("sha256", data, key).toString("base64url");
    }

    /**
     * Signs data using RSA with SHA-384.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static RS384(data, key) {
        return crypto.sign("sha384", data, key).toString("base64url");
    }

    /**
     * Signs data using RSA with SHA-512.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static RS512(data, key) {
        return crypto.sign("sha512", data, key).toString("base64url");
    }

    /**
     * Signs data using ECDSA with SHA-256.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The EC private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static ES256(data, key) {
        return crypto
            .sign("sha256", data, {
                key,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }

    /**
     * Signs data using ECDSA with SHA-384.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The EC private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static ES384(data, key) {
        return crypto
            .sign("sha384", data, {
                key,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }

    /**
     * Signs data using ECDSA with SHA-512.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The EC private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static ES512(data, key) {
        return crypto
            .sign("sha512", data, {
                key,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }

    /**
     * Signs data using RSA-PSS with SHA-256.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static PS256(data, key) {
        return crypto
            .sign("sha256", data, {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 32,
            })
            .toString("base64url");
    }

    /**
     * Signs data using RSA-PSS with SHA-384.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static PS384(data, key) {
        return crypto
            .sign("sha384", data, {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 48,
            })
            .toString("base64url");
    }

    /**
     * Signs data using RSA-PSS with SHA-512.
     * @param {string|Buffer} data - The data to sign.
     * @param {crypto.KeyObject|string|Buffer} key - The private key.
     * @returns {string} The Base64URL-encoded signature.
     */
    static PS512(data, key) {
        return crypto
            .sign("sha512", data, {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 64,
            })
            .toString("base64url");
    }
}

/**
 * Verifier class provides cryptographic verification functions for various algorithms.
 */
class Verifier {
    /**
     * Verifies a signature using HMAC with SHA-256.
     * @param {string|Buffer} data - The original data.
     * @param {string|Buffer} key - The secret key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static HS256(data, key, signature) {
        const expected = crypto.createHmac("sha256", key).update(data).digest();
        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }

    /**
     * Verifies a signature using HMAC with SHA-384.
     * @param {string|Buffer} data - The original data.
     * @param {string|Buffer} key - The secret key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static HS384(data, key, signature) {
        const expected = crypto.createHmac("sha384", key).update(data).digest();
        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }

    /**
     * Verifies a signature using HMAC with SHA-512.
     * @param {string|Buffer} data - The original data.
     * @param {string|Buffer} key - The secret key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static HS512(data, key, signature) {
        const expected = crypto.createHmac("sha512", key).update(data).digest();
        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }

    /**
     * Verifies a signature using RSA with SHA-256.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static RS256(data, key, signature) {
        return crypto.verify("sha256", data, key, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using RSA with SHA-384.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static RS384(data, key, signature) {
        return crypto.verify("sha384", data, key, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using RSA with SHA-512.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static RS512(data, key, signature) {
        return crypto.verify("sha512", data, key, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using ECDSA with SHA-256.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The EC public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static ES256(data, key, signature) {
        return crypto.verify("sha256", data, { key, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using ECDSA with SHA-384.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The EC public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static ES384(data, key, signature) {
        return crypto.verify("sha384", data, { key, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using ECDSA with SHA-512.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The EC public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static ES512(data, key, signature) {
        return crypto.verify("sha512", data, { key, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using RSA-PSS with SHA-256.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static PS256(data, key, signature) {
        return crypto.verify("sha256", data, { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: 32 }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using RSA-PSS with SHA-384.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static PS384(data, key, signature) {
        return crypto.verify("sha384", data, { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: 48 }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies a signature using RSA-PSS with SHA-512.
     * @param {string|Buffer} data - The original data.
     * @param {crypto.KeyObject|string|Buffer} key - The public key.
     * @param {string} signature - The Base64URL-encoded signature to verify.
     * @returns {boolean} True if verification is successful, otherwise false.
     */
    static PS512(data, key, signature) {
        return crypto.verify("sha512", data, { key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: 64 }, Buffer.from(signature, "base64url"));
    }
}

/**
 * JWT class responsible for encoding, decoding, signing, and verifying JSON Web Tokens (JWT).
 */
class JWT {
    /**
     * Signs a payload into a JSON Web Token (JWT) using the specified algorithm and secret.
     * @param {Object} [header={}] - The JWT header containing metadata like algorithm.
     * @param {Object} [payload={}] - The payload containing claims.
     * @param {string} [secret=""] - The secret key used to sign the token.
     * @returns {string} The signed JWT.
     * @throws {Error} If the algorithm is missing or invalid.
     */
    static sign(header = {}, payload = {}, secret = "") {
        const alg = header.alg;

        header = JSON.stringify(header);
        payload = JSON.stringify(payload);

        header = Buffer.from(header).toString("base64url");
        payload = Buffer.from(payload).toString("base64url");

        const data = [header, payload].join(".");
        const signature = Signer[alg](data, secret);

        const token = [data, signature].join(".");

        return token;
    }

    /**
     * Verifies a JSON Web Token (JWT) and checks its validity.
     * @param {string} [token=""] - The JWT to verify.
     * @param {string} [secret=""] - The secret key used for verification.
     * @returns {Object} The decoded payload if the token is valid.
     * @throws {Error} If the token is missing, malformed, expired, or signature verification fails.
     */
    static verify(token = "", secret = "") {
        if (!token) {
            throw new JWTError("invalid_request", "The request is missing a required parameter");
        }

        let array = token.split(".");

        if (array.length !== 3) {
            throw new JWTError("invalid_request", "The access token provided is malformed");
        }

        let [header, payload, signature] = array;

        let data = [header, payload].join(".");

        header = Buffer.from(header, "base64url");
        payload = Buffer.from(payload, "base64url");

        header = JSON.parse(header);
        payload = JSON.parse(payload);

        if (!Verifier[header.alg](data, secret, signature)) {
            throw new JWTError("invalid_token", "The access token provided is malformed");
        }

        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && now > payload.exp) {
            throw new JWTError("invalid_token", "The access token provided is expired");
        }

        if (payload.nbf && now < payload.nbf) {
            throw new JWTError("invalid_token", "The access token provided is invalid for other reasons");
        }

        if (payload.iat && now < payload.iat) {
            throw new JWTError("invalid_token", "The access token provided is invalid for other reasons");
        }

        return payload;
    }

    /**
     * Decodes the header and payload of a JSON Web Token (JWT) without verifying the signature.
     * @param {string} [token=""] - The JWT to decode.
     * @returns {Object} An object containing the decoded header and payload.
     */
    static decode(token = "") {
        let [header, payload] = token.split(".");

        header = Buffer.from(header, "base64url");
        payload = Buffer.from(payload, "base64url");

        header = JSON.parse(header);
        payload = JSON.parse(payload);

        return { header, payload };
    }
}

class JWTError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

JWT.Signer = Signer;
JWT.Verifier = Verifier;
JWT.JWTError = JWTError;

module.exports = JWT;
