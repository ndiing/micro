const crypto = require("crypto");
const qrcode = require("qrcode");
const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer) {
    let bits = "",
        encoded = "";

    for (const byte of buffer) {
        bits += byte.toString(2).padStart(8, "0");
    }

    bits = bits.padEnd(Math.ceil(bits.length / 5) * 5, "0"); // Padding

    for (let i = 0; i < bits.length; i += 5) {
        encoded += base32Chars[parseInt(bits.slice(i, i + 5), 2)];
    }

    return encoded;
}

function base32Decode(string) {
    let bits = "",
        decoded = [];

    for (const char of string.toUpperCase()) {
        let index = base32Chars.indexOf(char);
        if (index === -1) throw new Error("Invalid Base32 character");
        bits += index.toString(2).padStart(5, "0");
    }

    bits = bits.slice(0, bits.length - (bits.length % 8)); // Remove padding bits

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

function hotp({ key, counter, algorithm = "sha1", digits = 6, encoding = "ascii" }) {
    const keyBytes = Buffer.from(key, encoding);
    const counterBytes = Buffer.alloc(8);
    counterBytes.writeBigUInt64BE(BigInt(counter));

    const hash = crypto.createHmac(algorithm, keyBytes).update(counterBytes).digest();
    const offset = hash[hash.length - 1] & 0xf;

    let result = ((hash[offset] & 0x7f) << 24) | ((hash[offset + 1] & 0xff) << 16) | ((hash[offset + 2] & 0xff) << 8) | (hash[offset + 3] & 0xff);

    return String(result).padStart(digits, "0").slice(-digits);
}

function totp({ key, T, T0 = 0, X = 30, algorithm = "sha1", digits = 6, encoding = "ascii" }) {
    const counter = Math.floor(((!T ? Math.floor(Date.now() / 1000) : T) - T0) / X);
    return hotp({ key, counter, algorithm, digits, encoding });
}

// type='hotp'
// type='totp'
// algorithm='sha1'
// algorithm='sha256'
// algorithm='sha512'
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
    if (issuer) url.searchParams.set("issuer", issuer);
    url.searchParams.set("algorithm", algorithm);
    url.searchParams.set("digits", digits);
    if (type === "hotp") url.searchParams.set("counter", counter);
    if (type === "totp") url.searchParams.set("period", period);
    return new Promise((resolve, reject) => {
        qrcode.toDataURL(url.toString(), (err, qrImage) => {
            if (err) return reject(err);
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
                qr: qrImage, // QR Code dalam format base64
            });
        });
    });
}

module.exports = { hotp, totp };

// otpauth().then(console.log)
// const generated = {
//     type: 'totp',
//     label: 'label',
//     secret: 'YDWBB5TOYVO3ZLQC',
//     issuer: undefined,
//     algorithm: 'sha1',
//     digits: 6,
//     counter: 0,
//     period: 30,
//     url: 'otpauth://totp/label?secret=YDWBB5TOYVO3ZLQC&algorithm=sha1&digits=6&period=30',
//     qr: 'https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=otpauth://totp/label?secret=YDWBB5TOYVO3ZLQC&algorithm=sha1&digits=6&period=30'
//   }
// console.log(totp({key:generated.secret,encoding:'base32'}))

// const encoded = Buffer.from("Hello World").toString("base32");
// const decoded = Buffer.from(encoded, "base32").toString();

// console.log(encoded);
// console.log(decoded);

// const encoded = base32Encode(Buffer.from("Hello World!"));
// console.log("Encoded:", encoded);

// const decoded = base32Decode(encoded);
// console.log("Decoded:", decoded.toString());

// console.log(hotp({key:'12345678901234567890',counter:0})==='755224')
// console.log(hotp({key:'12345678901234567890',counter:1})==='287082')
// console.log(hotp({key:'12345678901234567890',counter:2})==='359152')
// console.log(hotp({key:'12345678901234567890',counter:3})==='969429')
// console.log(hotp({key:'12345678901234567890',counter:4})==='338314')
// console.log(hotp({key:'12345678901234567890',counter:5})==='254676')
// console.log(hotp({key:'12345678901234567890',counter:6})==='287922')
// console.log(hotp({key:'12345678901234567890',counter:7})==='162583')
// console.log(hotp({key:'12345678901234567890',counter:8})==='399871')
// console.log(hotp({key:'12345678901234567890',counter:9})==='520489')

// console.log(totp({key:'12345678901234567890',T:59})==='287082')
// console.log(totp({key:'12345678901234567890',T:1111111109})==='081804')
// console.log(totp({key:'12345678901234567890',T:1111111111})==='050471')
// console.log(totp({key:'12345678901234567890',T:1234567890})==='005924')
// console.log(totp({key:'12345678901234567890',T:2000000000})==='279037')
// console.log(totp({key:'12345678901234567890',T:20000000000})==='353130')

// console.log(totp({key:'12345678901234567890123456789012',T:59,algorithm:'sha256'})==='119246')
// console.log(totp({key:'12345678901234567890123456789012',T:1111111109,algorithm:'sha256'})==='084774')
// console.log(totp({key:'12345678901234567890123456789012',T:1111111111,algorithm:'sha256'})==='062674')
// console.log(totp({key:'12345678901234567890123456789012',T:1234567890,algorithm:'sha256'})==='819424')
// console.log(totp({key:'12345678901234567890123456789012',T:2000000000,algorithm:'sha256'})==='698825')
// console.log(totp({key:'12345678901234567890123456789012',T:20000000000,algorithm:'sha256'})==='737706')

// console.log(totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:59,algorithm:'sha512'})==='693936')
// console.log(totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:1111111109,algorithm:'sha512'})==='091201')
// console.log(totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:1111111111,algorithm:'sha512'})==='943326')
// console.log(totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:1234567890,algorithm:'sha512'})==='441116')
// console.log(totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:2000000000,algorithm:'sha512'})==='618901')
// console.log(totp({key:'1234567890123456789012345678901234567890123456789012345678901234',T:20000000000,algorithm:'sha512'})==='863826')
