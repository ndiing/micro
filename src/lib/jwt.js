const crypto = require("crypto");

/**
 * Signer class responsible for creating cryptographic signatures.
 */
class Signer {
    /**
     * Creates an HMAC-SHA256 signature.
     * @param {string} data - The data to sign.
     * @param {string} secret - The secret key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static HS256(data, secret) {
        return crypto.createHmac("sha256", secret).update(data).digest("base64url");
    }

    /**
     * Creates an HMAC-SHA384 signature.
     * @param {string} data - The data to sign.
     * @param {string} secret - The secret key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static HS384(data, secret) {
        return crypto.createHmac("sha384", secret).update(data).digest("base64url");
    }

    /**
     * Creates an HMAC-SHA512 signature.
     * @param {string} data - The data to sign.
     * @param {string} secret - The secret key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static HS512(data, secret) {
        return crypto.createHmac("sha512", secret).update(data).digest("base64url");
    }

    /**
     * Creates an RSA-SHA256 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static RS256(data, secret) {
        return crypto.sign("sha256", data, secret).toString("base64url");
    }

    /**
     * Creates an RSA-SHA384 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static RS384(data, secret) {
        return crypto.sign("sha384", data, secret).toString("base64url");
    }

    /**
     * Creates an RSA-SHA512 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static RS512(data, secret) {
        return crypto.sign("sha512", data, secret).toString("base64url");
    }

    /**
     * Creates an ECDSA-SHA256 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static ES256(data, secret) {
        return crypto
            .sign("sha256", data, {
                key: secret,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }

    /**
     * Creates an ECDSA-SHA384 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static ES384(data, secret) {
        return crypto
            .sign("sha384", data, {
                key: secret,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }

    /**
     * Creates an ECDSA-SHA512 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static ES512(data, secret) {
        return crypto
            .sign("sha512", data, {
                key: secret,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }

    /**
     * Creates an RSA-PSS-SHA256 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static PS256(data, secret) {
        return crypto
            .sign("sha256", data, {
                key: secret,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            })
            .toString("base64url");
    }

    /**
     * Creates an RSA-PSS-SHA384 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static PS384(data, secret) {
        return crypto
            .sign("sha384", data, {
                key: secret,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            })
            .toString("base64url");
    }

    /**
     * Creates an RSA-PSS-SHA512 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static PS512(data, secret) {
        return crypto
            .sign("sha512", data, {
                key: secret,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            })
            .toString("base64url");
    }
}

/**
 * Verifier class responsible for verifying cryptographic signatures.
 */
class Verifier {
    /**
     * Verifies an HMAC-SHA256 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string} secret - The secret key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static HS256(signature, data, secret) {
        const expected = crypto.createHmac("sha256", secret).update(data).digest();

        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }

    /**
     * Verifies an HMAC-SHA384 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string} secret - The secret key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static HS384(signature, data, secret) {
        const expected = crypto.createHmac("sha384", secret).update(data).digest();

        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }

    /**
     * Verifies an HMAC-SHA512 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string} secret - The secret key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static HS512(signature, data, secret) {
        const expected = crypto.createHmac("sha512", secret).update(data).digest();

        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }

    /**
     * Verifies an RSA-SHA256 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static RS256(signature, data, secret) {
        return crypto.verify("sha256", data, secret, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an RSA-SHA384 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static RS384(signature, data, secret) {
        return crypto.verify("sha384", data, secret, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an RSA-SHA512 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static RS512(signature, data, secret) {
        return crypto.verify("sha512", data, secret, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an ECDSA-SHA256 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static ES256(signature, data, secret) {
        return crypto.verify(
            "sha256",
            data,
            {
                key: secret,
                dsaEncoding: "ieee-p1363",
            },
            Buffer.from(signature, "base64url"),
        );
    }

    /**
     * Verifies an ECDSA-SHA384 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static ES384(signature, data, secret) {
        return crypto.verify(
            "sha384",
            data,
            {
                key: secret,
                dsaEncoding: "ieee-p1363",
            },
            Buffer.from(signature, "base64url"),
        );
    }

    /**
     * Verifies an ECDSA-SHA512 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static ES512(signature, data, secret) {
        return crypto.verify(
            "sha512",
            data,
            {
                key: secret,
                dsaEncoding: "ieee-p1363",
            },
            Buffer.from(signature, "base64url"),
        );
    }

    /**
     * Verifies an RSA-PSS-SHA256 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static PS256(signature, data, secret) {
        return crypto.verify(
            "sha256",
            data,
            {
                key: secret,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            Buffer.from(signature, "base64url"),
        );
    }

    /**
     * Verifies an RSA-PSS-SHA384 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static PS384(signature, data, secret) {
        return crypto.verify(
            "sha384",
            data,
            {
                key: secret,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            Buffer.from(signature, "base64url"),
        );
    }

    /**
     * Verifies an RSA-PSS-SHA512 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static PS512(signature, data, secret) {
        return crypto.verify(
            "sha512",
            data,
            {
                key: secret,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            Buffer.from(signature, "base64url"),
        );
    }
}

/* prettier-ignore */
const ALGORITHMS = [
    'HS256', 'HS384',
    'HS512', 'RS256',
    'RS384', 'RS512',
    'ES256', 'ES384',
    'ES512', 'PS256',
    'PS384', 'PS512'
  ]

class JWTError extends Error {
    constructor({ message, code, status }) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

/**
 * JWT class responsible for handling JSON Web Tokens (JWT), including encoding, decoding, signing, and verifying.
 */
class JWT {
    /**
     * Encodes a payload and header into a JSON Web Token (JWT).
     * @param {Object} [payload={}] - The payload to encode.
     * @param {string} [secret=""] - The secret key used to sign the token.
     * @param {Object} [header={}] - Additional header fields for the token.
     * @returns {Object} An object containing the encoded data and signature.
     * @throws {JWTError} If the secret is missing, or payload/header are invalid.
     */
    static encode(payload = {}, secret = "", header = {}) {
        if (!secret) {
            throw new JWTError({ message: "The request is missing a required parameter", code: "invalid_request", status: 400 });
        }

        if (typeof payload !== "object") {
            throw new JWTError({ message: "The request is missing a required parameter", code: "invalid_request", status: 400 });
        }

        if (typeof header !== "object") {
            throw new JWTError({ message: "The request is missing a required parameter", code: "invalid_request", status: 400 });
        }

        header = {
            alg: "HS256",
            typ: "JWT",
            ...header,
        };

        if (!header.alg || !ALGORITHMS.includes(header.alg)) {
            throw new JWTError({ message: `The request is missing a required parameter`, code: "invalid_request", status: 400 });
        }

        const sign = Signer[header.alg];
        header = Buffer.from(JSON.stringify(header)).toString("base64url");
        payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
        const data = [header, payload].join(".");

        const signature = sign(data, secret);

        return {
            data,
            signature,
        };
    }

    /**
     * Decodes and validates a JSON Web Token (JWT).
     * @param {string} [token=""] - The JWT to decode and validate.
     * @param {string} [secret=""] - The secret key used for validation.
     * @returns {Object} An object containing the decoded payload and validation status (e.g., invalid signature, expiration).
     * @throws {JWTError} If the token format is invalid or the secret is missing.
     */
    static decode(token = "", secret = "") {
        if (!token) {
            throw new JWTError({ message: "The request is missing a required parameter", code: "invalid_request", status: 400 });
        }

        if (!secret) {
            throw new JWTError({ message: "The request is missing a required parameter", code: "invalid_request", status: 400 });
        }
        const parts = token.split(".");

        if (parts.length !== 3) {
            throw new JWTError({ message: "The request is missing a required parameter", code: "invalid_request", status: 400 });
        }
        let [header, payload, signature] = parts;

        const data = [header, payload].join(".");

        header = JSON.parse(
            Buffer.from(header, "base64url", {
                ignoreBOM: true,
            }).toString(),
        );

        payload = JSON.parse(
            Buffer.from(payload, "base64url", {
                ignoreBOM: true,
            }).toString(),
        );

        const verify = Verifier[header.alg];

        const invalid_signature = !verify(signature, data, secret);

        const now = Math.floor(Date.now() / 1000);
        const invalid_nbf = !!(payload.nbf && now < payload.nbf);
        const invalid_exp = !!(payload.exp && now >= payload.exp);

        return {
            payload,
            invalid_signature,
            invalid_nbf,
            invalid_exp,
        };
    }

    /**
     * Generates a complete JSON Web Token (JWT) by encoding and signing the payload.
     * @param {Object} [payload={}] - The payload to encode.
     * @param {string} [secret=""] - The secret key used to sign the token.
     * @param {Object} [header={}] - Additional header fields for the token.
     * @returns {string} The complete signed JWT.
     * @throws {JWTError} If the secret is missing, or payload/header are invalid.
     */
    static sign(payload = {}, secret = "", header = {}) {
        const { data, signature } = JWT.encode(payload, secret, header);
        const token = [data, signature].join(".");
        return token;
    }

    /**
     * Verifies a JSON Web Token (JWT) and checks its validity.
     * @param {string} [token=""] - The JWT to verify.
     * @param {string} [secret=""] - The secret key used for verification.
     * @returns {Object} The decoded payload if the token is valid.
     * @throws {JWTError} If the token is invalid, expired, or signature verification fails.
     */
    static verify(token = "", secret = "") {
        let payload = null,
            invalid_signature = true,
            invalid_nbf = true,
            invalid_exp = true;
        try {
            ({ payload, invalid_signature, invalid_nbf, invalid_exp } = JWT.decode(token, secret));
        } catch (error) {
            throw new JWTError({ message: "The access token provided is malformed", code: "invalid_token", status: 401 });
        }

        if (invalid_signature) {
            throw new JWTError({ message: "The access token provided is malformed", code: "invalid_token", status: 401 });
        }

        if (invalid_nbf) {
            throw new JWTError({ message: `The access token provided is invalid for other reasons`, code: "invalid_token", status: 401 });
        }

        if (invalid_exp) {
            throw new JWTError({ message: `The access token provided is expired`, code: "invalid_token", status: 401 });
        }

        return payload;
    }
}

module.exports = JWT;
