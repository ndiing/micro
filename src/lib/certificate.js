const forge = require("node-forge");
const fs = require("fs");

const Util = {
    /**
     * Checks if the given domain is an IP address.
     * @param {string} [domain=""] - The domain to check.
     * @returns {boolean} True if the domain is an IP address, otherwise false.
     */
    isIpDomain: function (domain = "") {
        const ipReg = /^\d+?\.\d+?\.\d+?\.\d+?$/;
        return ipReg.test(domain);
    },
};

/**
 * Certificate class responsible for generating and managing certificates.
 */
class Certificate {
    /**
     * Default attributes for certificates.
     * @type {Array<Object>}
     */
    static defaultAttrs = [
        { name: "countryName", value: "ID" },
        { name: "organizationName", value: "Ndiing" },
        { shortName: "ST", value: "JT" },
        { shortName: "OU", value: "Ndiing" },
    ];

    /**
     * Returns the subject alternative name extension based on the given domain.
     * @param {string} [domain=""] - The domain for the subject alternative name.
     * @returns {Object} The subject alternative name extension.
     */
    static getExtensionSAN(domain = "") {
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

    /**
     * Generates a key pair and certificate with the given serial number.
     * @param {string} [serialNumber] - The serial number for the certificate.
     * @returns {Object} The generated keys and certificate.
     */
    static getKeysAndCert(serialNumber) {
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

    /**
     * Generates a root certificate authority (CA).
     * @param {string} [commonName="CertManager"] - The common name for the root CA.
     * @returns {Object} The generated root CA keys and certificate.
     */
    static generateRootCA(commonName) {
        const keysAndCert = this.getKeysAndCert();
        const keys = keysAndCert.keys;
        const cert = keysAndCert.cert;
        commonName = commonName || "CertManager";
        const attrs = this.defaultAttrs.concat([
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

    /**
     * Generates certificates for the given hostname using the provided root CA configuration.
     * @param {string} domain - The hostname to generate certificates for.
     * @param {Object} rootCAConfig - The root CA configuration.
     * @param {string} rootCAConfig.key - The root CA private key in PEM format.
     * @param {string} rootCAConfig.cert - The root CA certificate in PEM format.
     * @returns {Object} The generated keys and certificate for the hostname.
     */
    static generateCertsForHostname(domain, rootCAConfig) {
        const md = forge.md.md5.create();
        md.update(domain);
        const keysAndCert = this.getKeysAndCert(md.digest().toHex());
        const keys = keysAndCert.keys;
        const cert = keysAndCert.cert;
        const caCert = forge.pki.certificateFromPem(rootCAConfig.cert);
        const caKey = forge.pki.privateKeyFromPem(rootCAConfig.key);
        cert.setIssuer(caCert.subject.attributes);
        const attrs = this.defaultAttrs.concat([
            {
                name: "commonName",
                value: domain,
            },
        ]);
        const extensions = [{ name: "basicConstraints", cA: false }, this.getExtensionSAN(domain)];
        cert.setSubject(attrs);
        cert.setExtensions(extensions);
        cert.sign(caKey, forge.md.sha256.create());

        return {
            privateKey: forge.pki.privateKeyToPem(keys.privateKey),
            publicKey: forge.pki.publicKeyToPem(keys.publicKey),
            certificate: forge.pki.certificateToPem(cert),
        };
    }

    /**
     * Sets the default attributes for certificate generation.
     * @param {Array<Object>} attrs - The default attributes to set.
     */
    static setDefaultAttrs(attrs) {
        this.defaultAttrs = attrs;
    }

    /**
     * Generates and returns certificates for the hostname, creating them if they do not exist.
     * @returns {Object} The certificates for the hostname.
     */
    static getCertsForHostname() {
        if (!fs.existsSync("./certs/host.key")) {
            const { privateKey, certificate } = this.generateRootCA();
            const hostCert = this.generateCertsForHostname("localhost", {
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
}

module.exports = Certificate;
