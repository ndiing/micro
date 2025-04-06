const Base32 = require("../src/lib/base32");
const OTP = require("../src/lib/otp");

{
    const encoded = Base32.encode("foo");
    console.log(encoded);
    const decoded = Base32.decode(encoded);
    console.log(decoded);
}

{
    console.log(Buffer.from("foo").toString("base32"));
    console.log(Buffer.from("MZXW6===", "base32").toString());
}

{
    console.log(OTP.otpauth());
    console.log(OTP.totp({ key: "IRUR545Y5QTEWR6Q", algorithm: "sha1", encoding: "base32" }));
}

{
    console.log(OTP.randomKey({ algorithm: "sha1" }));
    console.log(OTP.randomKey({ algorithm: "sha256" }));
    console.log(OTP.randomKey({ algorithm: "sha512" }));
}

{
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 0 }) === "755224");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 1 }) === "287082");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 2 }) === "359152");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 3 }) === "969429");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 4 }) === "338314");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 5 }) === "254676");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 6 }) === "287922");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 7 }) === "162583");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 8 }) === "399871");
    console.log(OTP.hotp({ key: "12345678901234567890", counter: 9 }) === "520489");
}

{
    console.log(OTP.totp({ key: "12345678901234567890", T: 59, algorithm: "sha1" }) === "287082");
    console.log(OTP.totp({ key: "12345678901234567890", T: 1111111109, algorithm: "sha1" }) === "081804");
    console.log(OTP.totp({ key: "12345678901234567890", T: 1111111111, algorithm: "sha1" }) === "050471");
    console.log(OTP.totp({ key: "12345678901234567890", T: 1234567890, algorithm: "sha1" }) === "005924");
    console.log(OTP.totp({ key: "12345678901234567890", T: 2000000000, algorithm: "sha1" }) === "279037");
    console.log(OTP.totp({ key: "12345678901234567890", T: 20000000000, algorithm: "sha1" }) === "353130");

    console.log(OTP.totp({ key: "12345678901234567890123456789012", T: 59, algorithm: "sha256" }) === "119246");
    console.log(OTP.totp({ key: "12345678901234567890123456789012", T: 1111111109, algorithm: "sha256" }) === "084774");
    console.log(OTP.totp({ key: "12345678901234567890123456789012", T: 1111111111, algorithm: "sha256" }) === "062674");
    console.log(OTP.totp({ key: "12345678901234567890123456789012", T: 1234567890, algorithm: "sha256" }) === "819424");
    console.log(OTP.totp({ key: "12345678901234567890123456789012", T: 2000000000, algorithm: "sha256" }) === "698825");
    console.log(OTP.totp({ key: "12345678901234567890123456789012", T: 20000000000, algorithm: "sha256" }) === "737706");

    console.log(OTP.totp({ key: "1234567890123456789012345678901234567890123456789012345678901234", T: 59, algorithm: "sha512" }) === "693936");
    console.log(OTP.totp({ key: "1234567890123456789012345678901234567890123456789012345678901234", T: 1111111109, algorithm: "sha512" }) === "091201");
    console.log(OTP.totp({ key: "1234567890123456789012345678901234567890123456789012345678901234", T: 1111111111, algorithm: "sha512" }) === "943326");
    console.log(OTP.totp({ key: "1234567890123456789012345678901234567890123456789012345678901234", T: 1234567890, algorithm: "sha512" }) === "441116");
    console.log(OTP.totp({ key: "1234567890123456789012345678901234567890123456789012345678901234", T: 2000000000, algorithm: "sha512" }) === "618901");
    console.log(OTP.totp({ key: "1234567890123456789012345678901234567890123456789012345678901234", T: 20000000000, algorithm: "sha512" }) === "863826");
}
