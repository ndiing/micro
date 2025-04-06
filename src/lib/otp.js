const crypto = require("crypto");
require("./base32.js");

class OTP {
    /**@see https://www.ietf.org/rfc/rfc4226.txt*/
    static hotp({ key, counter, algorithm = "sha1", digits = 6, encoding = "ascci" } = {}) {
        const keyBytes = Buffer.from(key, encoding);
        const counterBytes = Buffer.alloc(8);
        counterBytes.writeUInt32BE(counter, 4);
        const hash = crypto.createHmac(algorithm, keyBytes).update(counterBytes).digest("hex");
        const offset = parseInt(hash.charAt(hash.length - 1), 16);
        const result = parseInt(hash.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;
        return String(result).padStart(digits, "0").slice(-6);
    }

    /**@see https://datatracker.ietf.org/doc/html/rfc6238*/
    static totp({ key, T = Math.floor(Date.now() / 1000), T0 = 0, X = 30, algorithm = "sha1", digits = 6, encoding = "ascci" } = {}) {
        const counter = Math.floor((T - T0) / X);
        return OTP.hotp({ key, counter, algorithm, digits, encoding });
    }

    static randomKey({ algorithm, encoding = "ascci" } = {}) {
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

// // Usage
// {
//     const encoded = Base32.encode("foo");
//     console.log(encoded); // MZXW6===
//     // // MZXW6===
//     const decoded = Base32.decode(encoded);
//     console.log(decoded); // foo
//     // // foo
// }
// {
//     console.log(Buffer.from('foo').toString('base32'))
//     console.log(Buffer.from('MZXW6===','base32').toString())
// }
// {
//     console.log(OTP.otpauth());
//     console.log(OTP.totp({key:'IRUR545Y5QTEWR6Q',algorithm:'sha1',encoding:'base32'}));
// }
// {
//     console.log(OTP.randomKey({algorithm:'sha1'}))
//     console.log(OTP.randomKey({algorithm:'sha256'}))
//     console.log(OTP.randomKey({algorithm:'sha512'}))
// }
// {
//     console.log(OTP.hotp({key:'12345678901234567890',counter:0})==="755224")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:1})==="287082")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:2})==="359152")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:3})==="969429")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:4})==="338314")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:5})==="254676")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:6})==="287922")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:7})==="162583")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:8})==="399871")
//     console.log(OTP.hotp({key:'12345678901234567890',counter:9})==="520489")
// }
// {
//     console.log(OTP.totp({key:'12345678901234567890',T:59,algorithm:'sha1'})==='287082')
//     console.log(OTP.totp({key:'12345678901234567890',T:1111111109,algorithm:'sha1'})==='081804')
//     console.log(OTP.totp({key:'12345678901234567890',T:1111111111,algorithm:'sha1'})==='050471')
//     console.log(OTP.totp({key:'12345678901234567890',T:1234567890,algorithm:'sha1'})==='005924')
//     console.log(OTP.totp({key:'12345678901234567890',T:2000000000,algorithm:'sha1'})==='279037')
//     console.log(OTP.totp({key:'12345678901234567890',T:20000000000,algorithm:'sha1'})==='353130')

//     console.log(OTP.totp({key:'12345678901234567890123456789012',T:59,algorithm:'sha256'})==='119246')
//     console.log(OTP.totp({key:'12345678901234567890123456789012',T:1111111109,algorithm:'sha256'})==='084774')
//     console.log(OTP.totp({key:'12345678901234567890123456789012',T:1111111111,algorithm:'sha256'})==='062674')
//     console.log(OTP.totp({key:'12345678901234567890123456789012',T:1234567890,algorithm:'sha256'})==='819424')
//     console.log(OTP.totp({key:'12345678901234567890123456789012',T:2000000000,algorithm:'sha256'})==='698825')
//     console.log(OTP.totp({key:'12345678901234567890123456789012',T:20000000000,algorithm:'sha256'})==='737706')

//     console.log(OTP.totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:59,algorithm:'sha512'})==='693936')
//     console.log(OTP.totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:1111111109,algorithm:'sha512'})==='091201')
//     console.log(OTP.totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:1111111111,algorithm:'sha512'})==='943326')
//     console.log(OTP.totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:1234567890,algorithm:'sha512'})==='441116')
//     console.log(OTP.totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:2000000000,algorithm:'sha512'})==='618901')
//     console.log(OTP.totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:20000000000,algorithm:'sha512'})==='863826')
// }
