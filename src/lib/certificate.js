const forge = require("node-forge");
const fs = require("fs");
const Util = {
    isIpDomain: function (domain = "") {
        const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;

        return ipReg.test(domain);
    },
};

let defaultAttrs = [
    { name: "countryName", value: "ID" },
    { name: "organizationName", value: "Ndiing" },
    { shortName: "ST", value: "JT" },
    { shortName: "OU", value: "Ndiing" },
];

function getExtensionSAN(domain = "") {
    const isIpDomain = Util.isIpDomain(domain);
    if (isIpDomain) {
        return {
            name: "subjectAltName",
            altNames: [{ type: 7, ip: domain }],
        };
    } else {
        return {
            name: "subjectAltName",
            altNames: [{ type: 2, value: domain }],
        };
    }
}

function getKeysAndCert(serialNumber) {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = serialNumber || Math.floor(Math.random() * 100000) + "";
    var now = Date.now();

    cert.validity.notBefore = new Date(now - 24 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(now + 824 * 24 * 60 * 60 * 1000);
    return {
        keys,
        cert,
    };
}

function generateRootCA(commonName) {
    const keysAndCert = getKeysAndCert();
    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;

    commonName = commonName || "CertManager";

    const attrs = defaultAttrs.concat([
        {
            name: "commonName",
            value: commonName,
        },
    ]);
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{ name: "basicConstraints", cA: true }]);

    cert.sign(keys.privateKey, forge.md.sha256.create());

    return {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert),
    };
}

function generateCertsForHostname(domain, rootCAConfig) {
    const md = forge.md.md5.create();
    md.update(domain);

    const keysAndCert = getKeysAndCert(md.digest().toHex());
    const keys = keysAndCert.keys;
    const cert = keysAndCert.cert;

    const caCert = forge.pki.certificateFromPem(rootCAConfig.cert);
    const caKey = forge.pki.privateKeyFromPem(rootCAConfig.key);

    cert.setIssuer(caCert.subject.attributes);

    const attrs = defaultAttrs.concat([
        {
            name: "commonName",
            value: domain,
        },
    ]);

    const extensions = [{ name: "basicConstraints", cA: false }, getExtensionSAN(domain)];

    cert.setSubject(attrs);
    cert.setExtensions(extensions);

    cert.sign(caKey, forge.md.sha256.create());

    return {
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        certificate: forge.pki.certificateToPem(cert),
    };
}

function setDefaultAttrs(attrs) {
    defaultAttrs = attrs;
}

function getCerts() {
    if (!fs.existsSync("./certs/host.key")) {
        const { privateKey, certificate } = generateRootCA();

        const hostCert = generateCertsForHostname("localhost", {
            key: privateKey,
            cert: certificate,
        });
        fs.writeFileSync("./certs/root.key", privateKey);
        fs.writeFileSync("./certs/root.crt", certificate);
        fs.writeFileSync("./certs/host.key", hostCert.privateKey);
        fs.writeFileSync("./certs/host.crt", hostCert.certificate);
    }
    return {
        key: fs.readFileSync("./certs/host.key"),
        cert: fs.readFileSync("./certs/host.crt"),
    };
}

module.exports = {
    getExtensionSAN,
    getKeysAndCert,
    generateRootCA,
    generateCertsForHostname,
    setDefaultAttrs,
    getCerts,
};
