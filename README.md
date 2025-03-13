## Classes

<dl>
<dt><a href="#Certificate">Certificate</a></dt>
<dd><p>Certificate class responsible for generating and managing certificates.</p>
</dd>
<dt><a href="#I18n">I18n</a></dt>
<dd><p>I18n class responsible for handling internationalization tasks such as message templating and data extraction.</p>
</dd>
<dt><a href="#Signer">Signer</a></dt>
<dd><p>Signer class responsible for creating cryptographic signatures.</p>
</dd>
<dt><a href="#Verifier">Verifier</a></dt>
<dd><p>Verifier class responsible for verifying cryptographic signatures.</p>
</dd>
<dt><a href="#JWT">JWT</a></dt>
<dd><p>JWT class responsible for encoding and decoding JSON Web Tokens (JWT).</p>
</dd>
<dt><a href="#OTP">OTP</a></dt>
<dd><p>OTP class responsible for generating and verifying one-time passwords.</p>
</dd>
<dt><a href="#Router">Router</a></dt>
<dd><p>Router class responsible for handling HTTP routes and requests.</p>
</dd>
<dt><a href="#Validator">Validator</a></dt>
<dd><p>Validator class responsible for validating and converting data based on a schema.</p>
</dd>
<dt><a href="#WebSocket">WebSocket</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>WebSocket class responsible for handling WebSocket connections.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#required">required(expected, [message])</a> ⇒ <code>function</code></dt>
<dd><p>Validates if a value is required.</p>
</dd>
<dt><a href="#minLength">minLength(expected, [message])</a> ⇒ <code>function</code></dt>
<dd><p>Validates the minimum length of a string.</p>
</dd>
<dt><a href="#maxLength">maxLength(expected, [message])</a> ⇒ <code>function</code></dt>
<dd><p>Validates the maximum length of a string.</p>
</dd>
<dt><a href="#pattern">pattern(expected, [message])</a> ⇒ <code>function</code></dt>
<dd><p>Validates if a value matches a regular expression pattern.</p>
</dd>
<dt><a href="#min">min(expected, [message])</a> ⇒ <code>function</code></dt>
<dd><p>Validates if a number is greater than or equal to a minimum value.</p>
</dd>
<dt><a href="#max">max(expected, [message])</a> ⇒ <code>function</code></dt>
<dd><p>Validates if a number is less than or equal to a maximum value.</p>
</dd>
<dt><a href="#type">type(expected, value)</a> ⇒ <code>*</code></dt>
<dd><p>Converts a value to the expected type.</p>
</dd>
</dl>

<a name="Certificate"></a>

## Certificate

Certificate class responsible for generating and managing certificates.

**Kind**: global class

- [Certificate](#Certificate)
    - _instance_
        - [.defaultAttrs](#Certificate+defaultAttrs) : <code>Array.&lt;Object&gt;</code>
    - _static_
        - [.getExtensionSAN([domain])](#Certificate.getExtensionSAN) ⇒ <code>Object</code>
        - [.getKeysAndCert([serialNumber])](#Certificate.getKeysAndCert) ⇒ <code>Object</code>
        - [.generateRootCA([commonName])](#Certificate.generateRootCA) ⇒ <code>Object</code>
        - [.generateCertsForHostname(domain, rootCAConfig)](#Certificate.generateCertsForHostname) ⇒ <code>Object</code>
        - [.setDefaultAttrs(attrs)](#Certificate.setDefaultAttrs)
        - [.getCertsForHostname()](#Certificate.getCertsForHostname) ⇒ <code>Object</code>

<a name="Certificate+defaultAttrs"></a>

### certificate.defaultAttrs : <code>Array.&lt;Object&gt;</code>

Default attributes for certificates.

**Kind**: instance property of [<code>Certificate</code>](#Certificate)  
<a name="Certificate.getExtensionSAN"></a>

### Certificate.getExtensionSAN([domain]) ⇒ <code>Object</code>

Returns the subject alternative name extension based on the given domain.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The subject alternative name extension.

| Param    | Type                | Default                                 | Description                                  |
| -------- | ------------------- | --------------------------------------- | -------------------------------------------- |
| [domain] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The domain for the subject alternative name. |

<a name="Certificate.getKeysAndCert"></a>

### Certificate.getKeysAndCert([serialNumber]) ⇒ <code>Object</code>

Generates a key pair and certificate with the given serial number.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The generated keys and certificate.

| Param          | Type                | Description                            |
| -------------- | ------------------- | -------------------------------------- |
| [serialNumber] | <code>string</code> | The serial number for the certificate. |

<a name="Certificate.generateRootCA"></a>

### Certificate.generateRootCA([commonName]) ⇒ <code>Object</code>

Generates a root certificate authority (CA).

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The generated root CA keys and certificate.

| Param        | Type                | Default                                            | Description                      |
| ------------ | ------------------- | -------------------------------------------------- | -------------------------------- |
| [commonName] | <code>string</code> | <code>&quot;\&quot;CertManager\&quot;&quot;</code> | The common name for the root CA. |

<a name="Certificate.generateCertsForHostname"></a>

### Certificate.generateCertsForHostname(domain, rootCAConfig) ⇒ <code>Object</code>

Generates certificates for the given hostname using the provided root CA configuration.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The generated keys and certificate for the hostname.

| Param             | Type                | Description                                |
| ----------------- | ------------------- | ------------------------------------------ |
| domain            | <code>string</code> | The hostname to generate certificates for. |
| rootCAConfig      | <code>Object</code> | The root CA configuration.                 |
| rootCAConfig.key  | <code>string</code> | The root CA private key in PEM format.     |
| rootCAConfig.cert | <code>string</code> | The root CA certificate in PEM format.     |

<a name="Certificate.setDefaultAttrs"></a>

### Certificate.setDefaultAttrs(attrs)

Sets the default attributes for certificate generation.

**Kind**: static method of [<code>Certificate</code>](#Certificate)

| Param | Type                              | Description                    |
| ----- | --------------------------------- | ------------------------------ |
| attrs | <code>Array.&lt;Object&gt;</code> | The default attributes to set. |

<a name="Certificate.getCertsForHostname"></a>

### Certificate.getCertsForHostname() ⇒ <code>Object</code>

Generates and returns certificates for the hostname, creating them if they do not exist.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The certificates for the hostname.  
<a name="I18n"></a>

## I18n

I18n class responsible for handling internationalization tasks such as message templating and data extraction.

**Kind**: global class

- [I18n](#I18n)
    - [.escapeRegex(str)](#I18n.escapeRegex) ⇒ <code>string</code>
    - [.unescapeRegex(str)](#I18n.unescapeRegex) ⇒ <code>string</code>
    - [.getMessage(template, data)](#I18n.getMessage) ⇒ <code>string</code>
    - [.getData(template, text)](#I18n.getData) ⇒ <code>Object</code>

<a name="I18n.escapeRegex"></a>

### I18n.escapeRegex(str) ⇒ <code>string</code>

Escapes special characters for regex.

**Kind**: static method of [<code>I18n</code>](#I18n)  
**Returns**: <code>string</code> - The escaped string.

| Param | Type                | Description           |
| ----- | ------------------- | --------------------- |
| str   | <code>string</code> | The string to escape. |

<a name="I18n.unescapeRegex"></a>

### I18n.unescapeRegex(str) ⇒ <code>string</code>

Unescapes previously escaped regex characters.

**Kind**: static method of [<code>I18n</code>](#I18n)  
**Returns**: <code>string</code> - The unescaped string.

| Param | Type                | Description             |
| ----- | ------------------- | ----------------------- |
| str   | <code>string</code> | The string to unescape. |

<a name="I18n.getMessage"></a>

### I18n.getMessage(template, data) ⇒ <code>string</code>

Replaces placeholders in a template string with values from a data object.

**Kind**: static method of [<code>I18n</code>](#I18n)  
**Returns**: <code>string</code> - The template string with placeholders replaced by values from the data object.

| Param    | Type                | Description                                                    |
| -------- | ------------------- | -------------------------------------------------------------- |
| template | <code>string</code> | The template string containing placeholders.                   |
| data     | <code>Object</code> | The data object containing values to replace the placeholders. |

<a name="I18n.getData"></a>

### I18n.getData(template, text) ⇒ <code>Object</code>

Extracts data from a text string based on a template string with placeholders.

**Kind**: static method of [<code>I18n</code>](#I18n)  
**Returns**: <code>Object</code> - An object containing the extracted data.

| Param    | Type                | Description                                  |
| -------- | ------------------- | -------------------------------------------- |
| template | <code>string</code> | The template string containing placeholders. |
| text     | <code>string</code> | The text string to extract data from.        |

<a name="Signer"></a>

## Signer

Signer class responsible for creating cryptographic signatures.

**Kind**: global class

- [Signer](#Signer)
    - [.HS256(data, secret)](#Signer.HS256) ⇒ <code>string</code>
    - [.HS384(data, secret)](#Signer.HS384) ⇒ <code>string</code>
    - [.HS512(data, secret)](#Signer.HS512) ⇒ <code>string</code>
    - [.RS256(data, secret)](#Signer.RS256) ⇒ <code>string</code>
    - [.RS384(data, secret)](#Signer.RS384) ⇒ <code>string</code>
    - [.RS512(data, secret)](#Signer.RS512) ⇒ <code>string</code>
    - [.ES256(data, secret)](#Signer.ES256) ⇒ <code>string</code>
    - [.ES384(data, secret)](#Signer.ES384) ⇒ <code>string</code>
    - [.ES512(data, secret)](#Signer.ES512) ⇒ <code>string</code>
    - [.PS256(data, secret)](#Signer.PS256) ⇒ <code>string</code>
    - [.PS384(data, secret)](#Signer.PS384) ⇒ <code>string</code>
    - [.PS512(data, secret)](#Signer.PS512) ⇒ <code>string</code>

<a name="Signer.HS256"></a>

### Signer.HS256(data, secret) ⇒ <code>string</code>

Creates an HMAC-SHA256 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                | Description                      |
| ------ | ------------------- | -------------------------------- |
| data   | <code>string</code> | The data to sign.                |
| secret | <code>string</code> | The secret key used for signing. |

<a name="Signer.HS384"></a>

### Signer.HS384(data, secret) ⇒ <code>string</code>

Creates an HMAC-SHA384 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                | Description                      |
| ------ | ------------------- | -------------------------------- |
| data   | <code>string</code> | The data to sign.                |
| secret | <code>string</code> | The secret key used for signing. |

<a name="Signer.HS512"></a>

### Signer.HS512(data, secret) ⇒ <code>string</code>

Creates an HMAC-SHA512 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                | Description                      |
| ------ | ------------------- | -------------------------------- |
| data   | <code>string</code> | The data to sign.                |
| secret | <code>string</code> | The secret key used for signing. |

<a name="Signer.RS256"></a>

### Signer.RS256(data, secret) ⇒ <code>string</code>

Creates an RSA-SHA256 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.RS384"></a>

### Signer.RS384(data, secret) ⇒ <code>string</code>

Creates an RSA-SHA384 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.RS512"></a>

### Signer.RS512(data, secret) ⇒ <code>string</code>

Creates an RSA-SHA512 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.ES256"></a>

### Signer.ES256(data, secret) ⇒ <code>string</code>

Creates an ECDSA-SHA256 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.ES384"></a>

### Signer.ES384(data, secret) ⇒ <code>string</code>

Creates an ECDSA-SHA384 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.ES512"></a>

### Signer.ES512(data, secret) ⇒ <code>string</code>

Creates an ECDSA-SHA512 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.PS256"></a>

### Signer.PS256(data, secret) ⇒ <code>string</code>

Creates an RSA-PSS-SHA256 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.PS384"></a>

### Signer.PS384(data, secret) ⇒ <code>string</code>

Creates an RSA-PSS-SHA384 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Signer.PS512"></a>

### Signer.PS512(data, secret) ⇒ <code>string</code>

Creates an RSA-PSS-SHA512 signature.

**Kind**: static method of [<code>Signer</code>](#Signer)  
**Returns**: <code>string</code> - The generated signature in base64url format.

| Param  | Type                                       | Description                       |
| ------ | ------------------------------------------ | --------------------------------- |
| data   | <code>string</code>                        | The data to sign.                 |
| secret | <code>string</code> \| <code>Object</code> | The private key used for signing. |

<a name="Verifier"></a>

## Verifier

Verifier class responsible for verifying cryptographic signatures.

**Kind**: global class

- [Verifier](#Verifier)
    - [.HS256(signature, data, secret)](#Verifier.HS256) ⇒ <code>boolean</code>
    - [.HS384(signature, data, secret)](#Verifier.HS384) ⇒ <code>boolean</code>
    - [.HS512(signature, data, secret)](#Verifier.HS512) ⇒ <code>boolean</code>
    - [.RS256(signature, data, secret)](#Verifier.RS256) ⇒ <code>boolean</code>
    - [.RS384(signature, data, secret)](#Verifier.RS384) ⇒ <code>boolean</code>
    - [.RS512(signature, data, secret)](#Verifier.RS512) ⇒ <code>boolean</code>
    - [.ES256(signature, data, secret)](#Verifier.ES256) ⇒ <code>boolean</code>
    - [.ES384(signature, data, secret)](#Verifier.ES384) ⇒ <code>boolean</code>
    - [.ES512(signature, data, secret)](#Verifier.ES512) ⇒ <code>boolean</code>
    - [.PS256(signature, data, secret)](#Verifier.PS256) ⇒ <code>boolean</code>
    - [.PS384(signature, data, secret)](#Verifier.PS384) ⇒ <code>boolean</code>
    - [.PS512(signature, data, secret)](#Verifier.PS512) ⇒ <code>boolean</code>

<a name="Verifier.HS256"></a>

### Verifier.HS256(signature, data, secret) ⇒ <code>boolean</code>

Verifies an HMAC-SHA256 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                | Description                        |
| --------- | ------------------- | ---------------------------------- |
| signature | <code>string</code> | The signature to verify.           |
| data      | <code>string</code> | The data to verify.                |
| secret    | <code>string</code> | The secret key used for verifying. |

<a name="Verifier.HS384"></a>

### Verifier.HS384(signature, data, secret) ⇒ <code>boolean</code>

Verifies an HMAC-SHA384 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                | Description                        |
| --------- | ------------------- | ---------------------------------- |
| signature | <code>string</code> | The signature to verify.           |
| data      | <code>string</code> | The data to verify.                |
| secret    | <code>string</code> | The secret key used for verifying. |

<a name="Verifier.HS512"></a>

### Verifier.HS512(signature, data, secret) ⇒ <code>boolean</code>

Verifies an HMAC-SHA512 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                | Description                        |
| --------- | ------------------- | ---------------------------------- |
| signature | <code>string</code> | The signature to verify.           |
| data      | <code>string</code> | The data to verify.                |
| secret    | <code>string</code> | The secret key used for verifying. |

<a name="Verifier.RS256"></a>

### Verifier.RS256(signature, data, secret) ⇒ <code>boolean</code>

Verifies an RSA-SHA256 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.RS384"></a>

### Verifier.RS384(signature, data, secret) ⇒ <code>boolean</code>

Verifies an RSA-SHA384 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.RS512"></a>

### Verifier.RS512(signature, data, secret) ⇒ <code>boolean</code>

Verifies an RSA-SHA512 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.ES256"></a>

### Verifier.ES256(signature, data, secret) ⇒ <code>boolean</code>

Verifies an ECDSA-SHA256 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.ES384"></a>

### Verifier.ES384(signature, data, secret) ⇒ <code>boolean</code>

Verifies an ECDSA-SHA384 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.ES512"></a>

### Verifier.ES512(signature, data, secret) ⇒ <code>boolean</code>

Verifies an ECDSA-SHA512 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.PS256"></a>

### Verifier.PS256(signature, data, secret) ⇒ <code>boolean</code>

Verifies an RSA-PSS-SHA256 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.PS384"></a>

### Verifier.PS384(signature, data, secret) ⇒ <code>boolean</code>

Verifies an RSA-PSS-SHA384 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="Verifier.PS512"></a>

### Verifier.PS512(signature, data, secret) ⇒ <code>boolean</code>

Verifies an RSA-PSS-SHA512 signature.

**Kind**: static method of [<code>Verifier</code>](#Verifier)  
**Returns**: <code>boolean</code> - True if the signature is valid, otherwise false.

| Param     | Type                                       | Description                        |
| --------- | ------------------------------------------ | ---------------------------------- |
| signature | <code>string</code>                        | The signature to verify.           |
| data      | <code>string</code>                        | The data to verify.                |
| secret    | <code>string</code> \| <code>Object</code> | The public key used for verifying. |

<a name="JWT"></a>

## JWT

JWT class responsible for encoding and decoding JSON Web Tokens (JWT).

**Kind**: global class

- [JWT](#JWT)
    - [.encode(payload, [secret], [header])](#JWT.encode) ⇒ <code>string</code>
    - [.decode([token], [secret])](#JWT.decode) ⇒ <code>Object</code>

<a name="JWT.encode"></a>

### JWT.encode(payload, [secret], [header]) ⇒ <code>string</code>

Encodes a payload into a JSON Web Token (JWT) using the specified algorithm and secret.

**Kind**: static method of [<code>JWT</code>](#JWT)  
**Returns**: <code>string</code> - The encoded JWT.  
**Throws**:

- <code>Error</code> If the secret is not provided.

| Param    | Type                | Default                                 | Description                                |
| -------- | ------------------- | --------------------------------------- | ------------------------------------------ |
| payload  | <code>Object</code> |                                         | The payload to encode.                     |
| [secret] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The secret key used for signing the token. |
| [header] | <code>Object</code> |                                         | Additional header values for the token.    |

<a name="JWT.decode"></a>

### JWT.decode([token], [secret]) ⇒ <code>Object</code>

Decodes and verifies a JSON Web Token (JWT).

**Kind**: static method of [<code>JWT</code>](#JWT)  
**Returns**: <code>Object</code> - The decoded payload.  
**Throws**:

- <code>Error</code> If the token or secret is not provided, if the token is malformed, or if the token is expired.

| Param    | Type                | Default                                 | Description                           |
| -------- | ------------------- | --------------------------------------- | ------------------------------------- |
| [token]  | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The JWT to decode.                    |
| [secret] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The secret key used for verification. |

<a name="OTP"></a>

## OTP

OTP class responsible for generating and verifying one-time passwords.

**Kind**: global class

- [OTP](#OTP)
    - [.base32Encode(buffer)](#OTP.base32Encode) ⇒ <code>string</code>
    - [.base32Decode(string)](#OTP.base32Decode) ⇒ <code>Buffer</code>
    - [.hotp(options)](#OTP.hotp) ⇒ <code>string</code>
    - [.totp(options)](#OTP.totp) ⇒ <code>string</code>
    - [.generateSecret([algorithm])](#OTP.generateSecret) ⇒ <code>string</code>
    - [.otpauth(options)](#OTP.otpauth) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="OTP.base32Encode"></a>

### OTP.base32Encode(buffer) ⇒ <code>string</code>

Encodes a buffer into a Base32 string.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The Base32 encoded string.

| Param  | Type                | Description           |
| ------ | ------------------- | --------------------- |
| buffer | <code>Buffer</code> | The buffer to encode. |

<a name="OTP.base32Decode"></a>

### OTP.base32Decode(string) ⇒ <code>Buffer</code>

Decodes a Base32 string into a buffer.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>Buffer</code> - The decoded buffer.  
**Throws**:

- <code>Error</code> If the string contains invalid Base32 characters.

| Param  | Type                | Description                  |
| ------ | ------------------- | ---------------------------- |
| string | <code>string</code> | The Base32 string to decode. |

<a name="OTP.hotp"></a>

### OTP.hotp(options) ⇒ <code>string</code>

Generates a HMAC-based One-Time Password (HOTP).

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated HOTP.

| Param               | Type                | Default                                      | Description                                                   |
| ------------------- | ------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| options             | <code>Object</code> |                                              | The options for generating the HOTP.                          |
| options.key         | <code>string</code> |                                              | The secret key used for generating the HOTP.                  |
| options.counter     | <code>number</code> |                                              | The counter value.                                            |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code>  | The hash algorithm to use (e.g., "sha1", "sha256", "sha512"). |
| [options.digits]    | <code>number</code> | <code>6</code>                               | The number of digits for the HOTP.                            |
| [options.encoding]  | <code>string</code> | <code>&quot;\&quot;ascii\&quot;&quot;</code> | The encoding of the secret key.                               |

<a name="OTP.totp"></a>

### OTP.totp(options) ⇒ <code>string</code>

Generates a Time-based One-Time Password (TOTP).

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated TOTP.

| Param               | Type                | Default                                      | Description                                                   |
| ------------------- | ------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| options             | <code>Object</code> |                                              | The options for generating the TOTP.                          |
| options.key         | <code>string</code> |                                              | The secret key used for generating the TOTP.                  |
| [options.T]         | <code>number</code> | <code>Math.floor(Date.now() / 1000)</code>   | The current time in seconds.                                  |
| [options.T0]        | <code>number</code> | <code>0</code>                               | The start time in seconds.                                    |
| [options.X]         | <code>number</code> | <code>30</code>                              | The time step in seconds.                                     |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code>  | The hash algorithm to use (e.g., "sha1", "sha256", "sha512"). |
| [options.digits]    | <code>number</code> | <code>6</code>                               | The number of digits for the TOTP.                            |
| [options.encoding]  | <code>string</code> | <code>&quot;\&quot;ascii\&quot;&quot;</code> | The encoding of the secret key.                               |

<a name="OTP.generateSecret"></a>

### OTP.generateSecret([algorithm]) ⇒ <code>string</code>

Generates a secret key for OTP generation.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated secret key in Base32 format.

| Param       | Type                | Default                                     | Description                                                   |
| ----------- | ------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| [algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | The hash algorithm to use (e.g., "sha1", "sha256", "sha512"). |

<a name="OTP.otpauth"></a>

### OTP.otpauth(options) ⇒ <code>Promise.&lt;Object&gt;</code>

Generates an otpauth URL and corresponding QR code for OTP configuration.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves with the OTP configuration and QR code.

| Param               | Type                | Default                                      | Description                                                   |
| ------------------- | ------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| options             | <code>Object</code> |                                              | The options for generating the otpauth URL.                   |
| [options.type]      | <code>string</code> | <code>&quot;\&quot;totp\&quot;&quot;</code>  | The type of OTP (e.g., "hotp", "totp").                       |
| [options.label]     | <code>string</code> | <code>&quot;\&quot;label\&quot;&quot;</code> | The label for the OTP.                                        |
| [options.secret]    | <code>string</code> |                                              | The secret key for the OTP.                                   |
| [options.issuer]    | <code>string</code> |                                              | The issuer of the OTP.                                        |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code>  | The hash algorithm to use (e.g., "sha1", "sha256", "sha512"). |
| [options.digits]    | <code>number</code> | <code>6</code>                               | The number of digits for the OTP.                             |
| [options.counter]   | <code>number</code> | <code>0</code>                               | The counter value for HOTP.                                   |
| [options.period]    | <code>number</code> | <code>30</code>                              | The time period in seconds for TOTP.                          |

<a name="Router"></a>

## Router

Router class responsible for handling HTTP routes and requests.

**Kind**: global class

- [Router](#Router)
    - [new Router()](#new_Router_new)
    - [.add(method, path, ...middlewares)](#Router+add)
    - [.use(...args)](#Router+use)
    - [.post(path, ...middlewares)](#Router+post)
    - [.get(path, ...middlewares)](#Router+get)
    - [.patch(path, ...middlewares)](#Router+patch)
    - [.delete(path, ...middlewares)](#Router+delete)
    - [.request(req, res)](#Router+request)
    - [.listen(...args)](#Router+listen) ⇒ <code>http.Server</code>

<a name="new_Router_new"></a>

### new Router()

Creates an instance of the Router class.

<a name="Router+add"></a>

### router.add(method, path, ...middlewares)

Adds a route with the specified method, path, and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)

| Param          | Type                                         | Description                                               |
| -------------- | -------------------------------------------- | --------------------------------------------------------- |
| method         | <code>string</code>                          | The HTTP method (e.g., "GET", "POST", "PATCH", "DELETE"). |
| path           | <code>string</code> \| <code>function</code> | The path for the route or a middleware function.          |
| ...middlewares | <code>function</code>                        | The middleware functions for the route.                   |

<a name="Router+use"></a>

### router.use(...args)

Adds a middleware function to be used for all routes.

**Kind**: instance method of [<code>Router</code>](#Router)

| Param   | Type                  | Description               |
| ------- | --------------------- | ------------------------- |
| ...args | <code>function</code> | The middleware functions. |

<a name="Router+post"></a>

### router.post(path, ...middlewares)

Adds a POST route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)

| Param          | Type                  | Description                             |
| -------------- | --------------------- | --------------------------------------- |
| path           | <code>string</code>   | The path for the route.                 |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+get"></a>

### router.get(path, ...middlewares)

Adds a GET route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)

| Param          | Type                  | Description                             |
| -------------- | --------------------- | --------------------------------------- |
| path           | <code>string</code>   | The path for the route.                 |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+patch"></a>

### router.patch(path, ...middlewares)

Adds a PATCH route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)

| Param          | Type                  | Description                             |
| -------------- | --------------------- | --------------------------------------- |
| path           | <code>string</code>   | The path for the route.                 |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+delete"></a>

### router.delete(path, ...middlewares)

Adds a DELETE route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)

| Param          | Type                  | Description                             |
| -------------- | --------------------- | --------------------------------------- |
| path           | <code>string</code>   | The path for the route.                 |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+request"></a>

### router.request(req, res)

Handles incoming HTTP requests and executes the appropriate middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)

| Param | Type                              | Description               |
| ----- | --------------------------------- | ------------------------- |
| req   | <code>http.IncomingMessage</code> | The HTTP request object.  |
| res   | <code>http.ServerResponse</code>  | The HTTP response object. |

<a name="Router+listen"></a>

### router.listen(...args) ⇒ <code>http.Server</code>

Starts an HTTP server and listens for incoming requests.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>http.Server</code> - The HTTP server instance.

| Param   | Type             | Description                                            |
| ------- | ---------------- | ------------------------------------------------------ |
| ...args | <code>any</code> | The arguments to pass to http.createServer().listen(). |

<a name="Validator"></a>

## Validator

Validator class responsible for validating and converting data based on a schema.

**Kind**: global class

- [Validator](#Validator)
    - _instance_
        - [.validator](#Validator+validator) : <code>Object</code>
        - [.converter](#Validator+converter) : <code>Object</code>
    - _static_
        - [.validate(schema, data)](#Validator.validate) ⇒ <code>Object</code>

<a name="Validator+validator"></a>

### validator.validator : <code>Object</code>

An object containing validation functions.

**Kind**: instance property of [<code>Validator</code>](#Validator)  
<a name="Validator+converter"></a>

### validator.converter : <code>Object</code>

An object containing conversion functions.

**Kind**: instance property of [<code>Validator</code>](#Validator)  
<a name="Validator.validate"></a>

### Validator.validate(schema, data) ⇒ <code>Object</code>

Validates and converts data based on a schema.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>Object</code> - The result object containing the converted values and any validation errors.

| Param  | Type                | Description                                              |
| ------ | ------------------- | -------------------------------------------------------- |
| schema | <code>Object</code> | The schema defining the validation and conversion rules. |
| data   | <code>Object</code> | The data to validate and convert.                        |

<a name="WebSocket"></a>

## WebSocket ⇐ <code>EventEmitter</code>

WebSocket class responsible for handling WebSocket connections.

**Kind**: global class  
**Extends**: <code>EventEmitter</code>

- [WebSocket](#WebSocket) ⇐ <code>EventEmitter</code>
    - [new WebSocket([server])](#new_WebSocket_new)
    - [.upgrade(req, socket, head)](#WebSocket+upgrade)
    - [.encode(data)](#WebSocket+encode) ⇒ <code>Buffer</code>
    - [.decode(frame)](#WebSocket+decode) ⇒ <code>string</code> \| <code>Buffer</code> \| <code>null</code>

<a name="new_WebSocket_new"></a>

### new WebSocket([server])

Creates an instance of the WebSocket class.

| Param    | Type                     | Description                                                 |
| -------- | ------------------------ | ----------------------------------------------------------- |
| [server] | <code>http.Server</code> | The HTTP server to attach the WebSocket upgrade handler to. |

<a name="WebSocket+upgrade"></a>

### webSocket.upgrade(req, socket, head)

Handles the WebSocket upgrade request.

**Kind**: instance method of [<code>WebSocket</code>](#WebSocket)

| Param  | Type                              | Description                                       |
| ------ | --------------------------------- | ------------------------------------------------- |
| req    | <code>http.IncomingMessage</code> | The HTTP request object.                          |
| socket | <code>net.Socket</code>           | The network socket between the server and client. |
| head   | <code>Buffer</code>               | The first packet of the upgraded stream.          |

<a name="WebSocket+encode"></a>

### webSocket.encode(data) ⇒ <code>Buffer</code>

Encodes data into a WebSocket frame.

**Kind**: instance method of [<code>WebSocket</code>](#WebSocket)  
**Returns**: <code>Buffer</code> - The encoded WebSocket frame.

| Param | Type                                       | Description         |
| ----- | ------------------------------------------ | ------------------- |
| data  | <code>string</code> \| <code>Buffer</code> | The data to encode. |

<a name="WebSocket+decode"></a>

### webSocket.decode(frame) ⇒ <code>string</code> \| <code>Buffer</code> \| <code>null</code>

Decodes a WebSocket frame into data.

**Kind**: instance method of [<code>WebSocket</code>](#WebSocket)  
**Returns**: <code>string</code> \| <code>Buffer</code> \| <code>null</code> - The decoded data or null if the frame is a close frame.

| Param | Type                | Description                    |
| ----- | ------------------- | ------------------------------ |
| frame | <code>Buffer</code> | The WebSocket frame to decode. |

<a name="required"></a>

## required(expected, [message]) ⇒ <code>function</code>

Validates if a value is required.

**Kind**: global function  
**Returns**: <code>function</code> - The validation function.

| Param     | Type                 | Default                                                  | Description                                             |
| --------- | -------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| expected  | <code>boolean</code> |                                                          | The expected presence of the value (true for required). |
| [message] | <code>string</code>  | <code>&quot;\&quot;Value is required\&quot;&quot;</code> | The error message to return if validation fails.        |

<a name="minLength"></a>

## minLength(expected, [message]) ⇒ <code>function</code>

Validates the minimum length of a string.

**Kind**: global function  
**Returns**: <code>function</code> - The validation function.

| Param     | Type                | Default                                                                       | Description                                      |
| --------- | ------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| expected  | <code>number</code> |                                                                               | The expected minimum length.                     |
| [message] | <code>string</code> | <code>&quot;&#x60;Minimum length is ${expected} characters&#x60;&quot;</code> | The error message to return if validation fails. |

<a name="maxLength"></a>

## maxLength(expected, [message]) ⇒ <code>function</code>

Validates the maximum length of a string.

**Kind**: global function  
**Returns**: <code>function</code> - The validation function.

| Param     | Type                | Default                                                                       | Description                                      |
| --------- | ------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| expected  | <code>number</code> |                                                                               | The expected maximum length.                     |
| [message] | <code>string</code> | <code>&quot;&#x60;Maximum length is ${expected} characters&#x60;&quot;</code> | The error message to return if validation fails. |

<a name="pattern"></a>

## pattern(expected, [message]) ⇒ <code>function</code>

Validates if a value matches a regular expression pattern.

**Kind**: global function  
**Returns**: <code>function</code> - The validation function.

| Param     | Type                | Default                                                                          | Description                                      |
| --------- | ------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ |
| expected  | <code>RegExp</code> |                                                                                  | The regular expression pattern.                  |
| [message] | <code>string</code> | <code>&quot;\&quot;Value does not match the required pattern\&quot;&quot;</code> | The error message to return if validation fails. |

<a name="min"></a>

## min(expected, [message]) ⇒ <code>function</code>

Validates if a number is greater than or equal to a minimum value.

**Kind**: global function  
**Returns**: <code>function</code> - The validation function.

| Param     | Type                | Default                                                                 | Description                                      |
| --------- | ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| expected  | <code>number</code> |                                                                         | The expected minimum value.                      |
| [message] | <code>string</code> | <code>&quot;&#x60;Value must be at least ${expected}&#x60;&quot;</code> | The error message to return if validation fails. |

<a name="max"></a>

## max(expected, [message]) ⇒ <code>function</code>

Validates if a number is less than or equal to a maximum value.

**Kind**: global function  
**Returns**: <code>function</code> - The validation function.

| Param     | Type                | Default                                                                | Description                                      |
| --------- | ------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| expected  | <code>number</code> |                                                                        | The expected maximum value.                      |
| [message] | <code>string</code> | <code>&quot;&#x60;Value must be at most ${expected}&#x60;&quot;</code> | The error message to return if validation fails. |

<a name="type"></a>

## type(expected, value) ⇒ <code>\*</code>

Converts a value to the expected type.

**Kind**: global function  
**Returns**: <code>\*</code> - The converted value.

| Param    | Type                | Description                                              |
| -------- | ------------------- | -------------------------------------------------------- |
| expected | <code>string</code> | The expected type (e.g., "string", "number", "boolean"). |
| value    | <code>\*</code>     | The value to convert.                                    |
