const crypto = require("crypto");

function encode(payload, secret = "", header) {
    if (!secret) {
        throw new Error("required secret");
    }

    payload = {
        // exp: 300, // s
        ...payload,
    };

    header = {
        alg: "HS256",
        typ: "JWT",
        ...header,
    };

    if (payload.exp) {
        payload.exp = Math.floor(Date.now() / 1000) + payload.exp;
    }

    header = Buffer.from(JSON.stringify(header)).toString("base64url");
    payload = Buffer.from(JSON.stringify(payload)).toString("base64url");

    const data = [header, payload].join(".");

    const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");

    const token = [data, signature].join(".");

    return token;
}

function decode(token = "", secret = "") {
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

    signature = Buffer.from(signature, "base64url");

    const expected = crypto.createHmac("sha256", secret).update(data).digest();

    if (!crypto.timingSafeEqual(signature, expected)) {
        throw new Error("The access token provided is malformed");
    }

    header = JSON.parse(Buffer.from(header, "base64url", { ignoreBOM: true }).toString());
    payload = JSON.parse(Buffer.from(payload, "base64url", { ignoreBOM: true }).toString());

    if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) {
        throw new Error("The access token provided is expired");
    }

    return payload;
}

// // usage
// let header = {
//     alg: "HS256",
//     typ: "JWT",
// };
// let payload = {
//     exp: 300,
// };
// let secret = "your-256-bit-secret";

// const token = encode(payload, secret, header);
// console.log(decode(token, secret));

module.exports = {
    encode,
    decode,
};
