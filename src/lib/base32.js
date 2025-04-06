class Base32 {
    static alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    static encode(buffer) {
        let bits = "",
            encoded = "";

        for (const byte of buffer) {
            bits += byte.toString(2).padStart(8, "0");
        }

        bits = bits.padEnd(Math.ceil(bits.length / 5) * 5, "0");
        for (let i = 0; i < bits.length; i += 5) {
            encoded += Base32.alphabet[parseInt(bits.slice(i, i + 5), 2)];
        }

        return encoded;
    }

    static decode(string) {
        let bits = "",
            decoded = [];

        for (const char of string.toUpperCase()) {
            let index = Base32.alphabet.indexOf(char);
            if (index === -1) throw new Error("Invalid Base32 character");
            bits += index.toString(2).padStart(5, "0");
        }

        bits = bits.slice(0, bits.length - (bits.length % 8));
        for (let i = 0; i < bits.length; i += 8) {
            decoded.push(parseInt(bits.slice(i, i + 8), 2));
        }

        return Buffer.from(decoded);
    }
}

const originalToString = Buffer.prototype.toString;
const originalFrom = Buffer.from;

Buffer.prototype.toString = function (encoding, ...args) {
    if (encoding === "base32") {
        return Base32.encode(this);
    }

    return originalToString.call(this, encoding, ...args);
};

Buffer.from = function (input, encoding, ...args) {
    if (encoding === "base32") {
        const decoded = Base32.decode(input, { asBuffer: true });
        return decoded;
    }

    return originalFrom.call(Buffer, input, encoding, ...args);
};

module.exports = Base32;
