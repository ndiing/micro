const crypto = require("crypto");

class Signer {
    static HS256(data, key) {
        return crypto.createHmac("sha256", key).update(data).digest("base64url");
    }
    static HS384(data, key) {
        return crypto.createHmac("sha384", key).update(data).digest("base64url");
    }
    static HS512(data, key) {
        return crypto.createHmac("sha512", key).update(data).digest("base64url");
    }
    static RS256(data, key) {
        return crypto.sign("sha256", data, key).toString("base64url");
    }
    static RS384(data, key) {
        return crypto.sign("sha384", data, key).toString("base64url");
    }
    static RS512(data, key) {
        return crypto.sign("sha512", data, key).toString("base64url");
    }
    static ES256(data, key) {
        return crypto
            .sign("sha256", data, {
                key,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }
    static ES384(data, key) {
        return crypto
            .sign("sha384", data, {
                key,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }
    static ES512(data, key) {
        return crypto
            .sign("sha512", data, {
                key,
                dsaEncoding: "ieee-p1363",
            })
            .toString("base64url");
    }
    static PS256(data, key) {
        return crypto
            .sign("sha256", data, {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 32,
            })
            .toString("base64url");
    }
    static PS384(data, key) {
        return crypto
            .sign("sha384", data, {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 48,
            })
            .toString("base64url");
    }
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

class Verifier {
    static HS256(data, key, signature) {
        const expected = crypto.createHmac("sha256", key).update(data).digest();

        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }
    static HS384(data, key, signature) {
        const expected = crypto.createHmac("sha384", key).update(data).digest();

        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }
    static HS512(data, key, signature) {
        const expected = crypto.createHmac("sha512", key).update(data).digest();

        return crypto.timingSafeEqual(Buffer.from(signature, "base64url"), expected);
    }
    static RS256(data, key, signature) {
        return crypto.verify("sha256", data, key, Buffer.from(signature, "base64url"));
    }
    static RS384(data, key, signature) {
        return crypto.verify("sha384", data, key, Buffer.from(signature, "base64url"));
    }
    static RS512(data, key, signature) {
        return crypto.verify("sha512", data, key, Buffer.from(signature, "base64url"));
    }
    static ES256(data, key, signature) {
        return crypto.verify(
            "sha256",
            data,
            {
                key,
                dsaEncoding: "ieee-p1363",
            },
            Buffer.from(signature, "base64url"),
        );
    }
    static ES384(data, key, signature) {
        return crypto.verify(
            "sha384",
            data,
            {
                key,
                dsaEncoding: "ieee-p1363",
            },
            Buffer.from(signature, "base64url"),
        );
    }
    static ES512(data, key, signature) {
        return crypto.verify(
            "sha512",
            data,
            {
                key,
                dsaEncoding: "ieee-p1363",
            },
            Buffer.from(signature, "base64url"),
        );
    }
    static PS256(data, key, signature) {
        return crypto.verify(
            "sha256",
            data,
            {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 32,
            },
            Buffer.from(signature, "base64url"),
        );
    }
    static PS384(data, key, signature) {
        return crypto.verify(
            "sha384",
            data,
            {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 48,
            },
            Buffer.from(signature, "base64url"),
        );
    }
    static PS512(data, key, signature) {
        return crypto.verify(
            "sha512",
            data,
            {
                key,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 64,
            },
            Buffer.from(signature, "base64url"),
        );
    }
}

class JWT {
    static sign(header={}, payload={}, secret='') {
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

    static verify(token='', secret='') {
        if (!token) {
            throw new Error("Token is required");
        }
    
        let array = token.split(".");
    
        if (array.length !== 3) {
            throw new Error("Malformed token: expected 3 parts (header, payload, signature)");
        }
    
        let [header, payload, signature] = array;
    
        let data = [header, payload].join(".");
    
        header = Buffer.from(header, "base64url");
        payload = Buffer.from(payload, "base64url");
    
        header = JSON.parse(header);
        payload = JSON.parse(payload);
    
        if (!Verifier[header.alg](data, secret, signature)) {
            throw new Error("Signature verification failed: token may be tampered or secret is incorrect");
        }
    
        const now = Math.floor(Date.now() / 1000);
    
        if (payload.exp && now > payload.exp) {
            throw new Error("Token has expired (exp claim has passed)");
        }
    
        if (payload.nbf && now < payload.nbf) {
            throw new Error("Token is not active yet (nbf claim is in the future)");
        }
    
        if (payload.iat && now < payload.iat) {
            throw new Error("Invalid token: issued-at time (iat) is in the future");
        }
    
        return payload;
    }
    

    static decode(token='') {
        let [header, payload] = token.split(".");

        header = Buffer.from(header, "base64url");
        payload = Buffer.from(payload, "base64url");

        header = JSON.parse(header);
        payload = JSON.parse(payload);

        return { header, payload };
    }
}

JWT.Signer = Signer;
JWT.Verifier = Verifier;

module.exports = JWT;
