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

// const ALGORITHMS = Object.getOwnPropertyNames(Signer).filter(name=>![
//     'length',
//     'prototype',
//     'name',
// ].includes(name))
// console.log(ALGORITHMS)
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
    constructor(message, code) {
        super(message);
        this.code = code;
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
            throw new JWTError("Encoding failed: Secret key is required.", "INVALID_INPUT");
        }

        if (typeof payload !== "object") {
            throw new JWTError("Encoding failed: Payload must be an object.", "INVALID_INPUT");
        }

        if (typeof header !== "object") {
            throw new JWTError("Encoding failed: Header must be an object.", "INVALID_INPUT");
        }

        header = {
            alg: "HS256",
            typ: "JWT",
            ...header,
        };

        if (!header.alg || !ALGORITHMS.includes(header.alg)) {
            throw new JWTError(`Encoding failed: 'alg' must be one of [${ALGORITHMS.join(", ")}].`, "INVALID_INPUT");
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
            throw new JWTError("Decoding failed: JWT token is required.", "INVALID_INPUT");
        }

        if (!secret) {
            throw new JWTError("Decoding failed: Secret key is required.", "INVALID_INPUT");
        }
        const parts = token.split(".");

        if (parts.length !== 3) {
            throw new JWTError("Decoding failed: Invalid JWT format. Expected 3 parts (header.payload.signature).", "INVALID_INPUT");
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
            now,
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
        const { payload, invalid_signature, now, invalid_nbf, invalid_exp } = JWT.decode(token, secret);

        if (invalid_signature) {
            throw new JWTError("Decoding failed: Signature verification failed.", "INVALID_SIGNATURE");
        }

        if (invalid_nbf) {
            throw new JWTError(`Decoding failed: Token is not yet valid (nbf=${payload.nbf}, now=${now}).`, "INVALID_NBF");
        }

        if (invalid_exp) {
            throw new JWTError(`Decoding failed: Token has expired (exp=${payload.exp}, now=${now}).`, "INVALID_EXP");
        }

        return payload;
    }
}


module.exports = JWT;

// {
//     const token = JWT.sign(
//         {
//             sub: "1234567890",
//             name: "John Doe",
//             iat: 1516239022,
//         },
//         "your-256-bit-secret",
//         {
//             alg: "HS256",
//             typ: "JWT",
//         },
//     );
//     const verified = JWT.verify(token, "your-256-bit-secret");
//     console.log(token);
//     console.log(verified);
//     console.log(
//         JWT.encode(
//             {
//                 sub: "1234567890",
//                 name: "John Doe",
//                 iat: 1516239022,
//             },
//             "your-256-bit-secret",
//             {
//                 alg: "HS256",
//                 typ: "JWT",
//             },
//         ),
//     );
//     console.log(JWT.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", "your-256-bit-secret"));
// }
