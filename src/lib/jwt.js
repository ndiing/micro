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
        return crypto.sign("sha256", data, { key: secret, dsaEncoding: "ieee-p1363" }).toString("base64url");
    }

    /**
     * Creates an ECDSA-SHA384 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static ES384(data, secret) {
        return crypto.sign("sha384", data, { key: secret, dsaEncoding: "ieee-p1363" }).toString("base64url");
    }

    /**
     * Creates an ECDSA-SHA512 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static ES512(data, secret) {
        return crypto.sign("sha512", data, { key: secret, dsaEncoding: "ieee-p1363" }).toString("base64url");
    }

    /**
     * Creates an RSA-PSS-SHA256 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static PS256(data, secret) {
        return crypto.sign("sha256", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString("base64url");
    }

    /**
     * Creates an RSA-PSS-SHA384 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static PS384(data, secret) {
        return crypto.sign("sha384", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString("base64url");
    }

    /**
     * Creates an RSA-PSS-SHA512 signature.
     * @param {string} data - The data to sign.
     * @param {string|Object} secret - The private key used for signing.
     * @returns {string} The generated signature in base64url format.
     */
    static PS512(data, secret) {
        return crypto.sign("sha512", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }).toString("base64url");
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
        return crypto.verify("sha256", data, { key: secret, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an ECDSA-SHA384 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static ES384(signature, data, secret) {
        return crypto.verify("sha384", data, { key: secret, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an ECDSA-SHA512 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static ES512(signature, data, secret) {
        return crypto.verify("sha512", data, { key: secret, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an RSA-PSS-SHA256 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static PS256(signature, data, secret) {
        return crypto.verify("sha256", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an RSA-PSS-SHA384 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static PS384(signature, data, secret) {
        return crypto.verify("sha384", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, "base64url"));
    }

    /**
     * Verifies an RSA-PSS-SHA512 signature.
     * @param {string} signature - The signature to verify.
     * @param {string} data - The data to verify.
     * @param {string|Object} secret - The public key used for verifying.
     * @returns {boolean} True if the signature is valid, otherwise false.
     */
    static PS512(signature, data, secret) {
        return crypto.verify("sha512", data, { key: secret, padding: crypto.constants.RSA_PKCS1_PSS_PADDING }, Buffer.from(signature, "base64url"));
    }
}

/**
 * JWT class responsible for encoding and decoding JSON Web Tokens (JWT).
 */
class JWT {
    /**
     * Encodes a payload into a JSON Web Token (JWT) using the specified algorithm and secret.
     * @param {Object} payload - The payload to encode.
     * @param {string} [secret=""] - The secret key used for signing the token.
     * @param {Object} [header] - Additional header values for the token.
     * @returns {string} The encoded JWT.
     * @throws {Error} If the secret is not provided.
     */
    static encode(payload, secret = "", header) {
        if (!secret) {
            throw new Error("required secret");
        }
        payload = {
            iat: Math.floor(Date.now() / 1000), // s
            // nbf: 0, // s
            // exp: 300, // s
            ...payload,
        };
        header = {
            alg: "HS256",
            typ: "JWT",
            ...header,
        };

        if (payload.nbf) {
            payload.nbf = Math.floor(Date.now() / 1000) + payload.nbf;
        }

        if (payload.exp) {
            payload.exp = Math.floor(Date.now() / 1000) + payload.exp;
        }
        const sign = Signer[header.alg];
        header = Buffer.from(JSON.stringify(header)).toString("base64url");
        payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
        const data = [header, payload].join(".");
        const signature = sign(data, secret);
        const token = [data, signature].join(".");

        return token;
    }

    /**
     * Decodes and verifies a JSON Web Token (JWT).
     * @param {string} [token=""] - The JWT to decode.
     * @param {string} [secret=""] - The secret key used for verification.
     * @returns {Object} The decoded payload.
     * @throws {Error} If the token or secret is not provided, if the token is malformed, or if the token is expired.
     */
    static decode(token = "", secret = "") {
        if (!token) {
            throw new Error("required token");
        }

        if (!secret) {
            throw new Error("required secret");
        }
        let [header, payload, signature] = (token || "").split(".");

        if (!header || !payload || !signature) {
            throw new Error("The access token provided is malformed");
        }

        const data = [header, payload].join(".");
        header = JSON.parse(Buffer.from(header, "base64url", { ignoreBOM: true }).toString());

        const verify = Verifier[header.alg];

        if (!verify(signature, data, secret)) {
            throw new Error("The access token provided is malformed");
        }

        payload = JSON.parse(Buffer.from(payload, "base64url", { ignoreBOM: true }).toString());
        if (payload.nbf && Math.floor(Date.now() / 1000) < payload.nbf) {
            throw new Error("The access token is not yet valid");
        }

        if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) {
            throw new Error("The access token provided is expired");
        }

        return payload;
    }
}

module.exports = JWT;
