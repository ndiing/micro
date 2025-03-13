## Classes

<dl>
<dt><a href="#Router">Router</a></dt>
<dd><p>Router class responsible for handling HTTP routes and requests.</p>
</dd>
<dt><a href="#WebSocket">WebSocket</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>WebSocket class responsible for handling WebSocket connections.</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#Certificate">Certificate</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#JWT">JWT</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#OTP">OTP</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Validator">Validator</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Router"></a>

## Router
Router class responsible for handling HTTP routes and requests.

**Kind**: global class  

* [Router](#Router)
    * [new Router()](#new_Router_new)
    * [.add(method, path, ...middlewares)](#Router+add)
    * [.use(...args)](#Router+use)
    * [.post(path, ...middlewares)](#Router+post)
    * [.get(path, ...middlewares)](#Router+get)
    * [.patch(path, ...middlewares)](#Router+patch)
    * [.delete(path, ...middlewares)](#Router+delete)
    * [.request(req, res)](#Router+request)
    * [.listen(...args)](#Router+listen) ⇒ <code>http.Server</code>

<a name="new_Router_new"></a>

### new Router()
Creates an instance of the Router class.

<a name="Router+add"></a>

### router.add(method, path, ...middlewares)
Adds a route with the specified method, path, and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method (e.g., "GET", "POST", "PATCH", "DELETE"). |
| path | <code>string</code> \| <code>function</code> | The path for the route or a middleware function. |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+use"></a>

### router.use(...args)
Adds a middleware function to be used for all routes.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>function</code> | The middleware functions. |

<a name="Router+post"></a>

### router.post(path, ...middlewares)
Adds a POST route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path for the route. |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+get"></a>

### router.get(path, ...middlewares)
Adds a GET route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path for the route. |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+patch"></a>

### router.patch(path, ...middlewares)
Adds a PATCH route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path for the route. |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+delete"></a>

### router.delete(path, ...middlewares)
Adds a DELETE route with the specified path and middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path for the route. |
| ...middlewares | <code>function</code> | The middleware functions for the route. |

<a name="Router+request"></a>

### router.request(req, res)
Handles incoming HTTP requests and executes the appropriate middlewares.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | The HTTP request object. |
| res | <code>http.ServerResponse</code> | The HTTP response object. |

<a name="Router+listen"></a>

### router.listen(...args) ⇒ <code>http.Server</code>
Starts an HTTP server and listens for incoming requests.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>http.Server</code> - The HTTP server instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | The arguments to pass to http.createServer().listen(). |

<a name="WebSocket"></a>

## WebSocket ⇐ <code>EventEmitter</code>
WebSocket class responsible for handling WebSocket connections.

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [WebSocket](#WebSocket) ⇐ <code>EventEmitter</code>
    * [new WebSocket([server])](#new_WebSocket_new)
    * [.upgrade(req, socket, head)](#WebSocket+upgrade)
    * [.encode(data)](#WebSocket+encode) ⇒ <code>Buffer</code>
    * [.decode(frame)](#WebSocket+decode) ⇒ <code>string</code> \| <code>Buffer</code> \| <code>null</code>

<a name="new_WebSocket_new"></a>

### new WebSocket([server])
Creates an instance of the WebSocket class.


| Param | Type | Description |
| --- | --- | --- |
| [server] | <code>http.Server</code> | The HTTP server to attach the WebSocket upgrade handler to. |

<a name="WebSocket+upgrade"></a>

### webSocket.upgrade(req, socket, head)
Handles the WebSocket upgrade request.

**Kind**: instance method of [<code>WebSocket</code>](#WebSocket)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | The HTTP request object. |
| socket | <code>net.Socket</code> | The network socket between the server and client. |
| head | <code>Buffer</code> | The first packet of the upgraded stream. |

<a name="WebSocket+encode"></a>

### webSocket.encode(data) ⇒ <code>Buffer</code>
Encodes data into a WebSocket frame.

**Kind**: instance method of [<code>WebSocket</code>](#WebSocket)  
**Returns**: <code>Buffer</code> - The encoded WebSocket frame.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> \| <code>Buffer</code> | The data to encode. |

<a name="WebSocket+decode"></a>

### webSocket.decode(frame) ⇒ <code>string</code> \| <code>Buffer</code> \| <code>null</code>
Decodes a WebSocket frame into data.

**Kind**: instance method of [<code>WebSocket</code>](#WebSocket)  
**Returns**: <code>string</code> \| <code>Buffer</code> \| <code>null</code> - The decoded data or null if the frame is a close frame.  

| Param | Type | Description |
| --- | --- | --- |
| frame | <code>Buffer</code> | The WebSocket frame to decode. |

<a name="Certificate"></a>

## Certificate : <code>object</code>
**Kind**: global namespace  

* [Certificate](#Certificate) : <code>object</code>
    * [.isIpDomain([domain])](#Certificate.isIpDomain) ⇒ <code>boolean</code>
    * [.getExtensionSAN([domain])](#Certificate.getExtensionSAN) ⇒ <code>Object</code>
    * [.getKeysAndCert([serialNumber])](#Certificate.getKeysAndCert) ⇒ <code>Object</code>
    * [.generateRootCA([commonName])](#Certificate.generateRootCA) ⇒ <code>Object</code>
    * [.generateCertsForHostname(domain, rootCAConfig)](#Certificate.generateCertsForHostname) ⇒ <code>Object</code>
    * [.setDefaultAttrs(attrs)](#Certificate.setDefaultAttrs)
    * [.getCertsForHostname()](#Certificate.getCertsForHostname) ⇒ <code>Object</code>

<a name="Certificate.isIpDomain"></a>

### Certificate.isIpDomain([domain]) ⇒ <code>boolean</code>
Checks if the given domain is an IP address.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>boolean</code> - True if the domain is an IP address, otherwise false.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [domain] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The domain to check. |

<a name="Certificate.getExtensionSAN"></a>

### Certificate.getExtensionSAN([domain]) ⇒ <code>Object</code>
Returns the subject alternative name extension based on the given domain.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The subject alternative name extension.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [domain] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The domain for the subject alternative name. |

<a name="Certificate.getKeysAndCert"></a>

### Certificate.getKeysAndCert([serialNumber]) ⇒ <code>Object</code>
Generates a key pair and certificate with the given serial number.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The generated keys and certificate.  

| Param | Type | Description |
| --- | --- | --- |
| [serialNumber] | <code>string</code> | The serial number for the certificate. |

<a name="Certificate.generateRootCA"></a>

### Certificate.generateRootCA([commonName]) ⇒ <code>Object</code>
Generates a root certificate authority (CA).

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The generated root CA keys and certificate.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [commonName] | <code>string</code> | <code>&quot;\&quot;CertManager\&quot;&quot;</code> | The common name for the root CA. |

<a name="Certificate.generateCertsForHostname"></a>

### Certificate.generateCertsForHostname(domain, rootCAConfig) ⇒ <code>Object</code>
Generates certificates for the given hostname using the provided root CA configuration.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The generated keys and certificate for the hostname.  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | The hostname to generate certificates for. |
| rootCAConfig | <code>Object</code> | The root CA configuration. |
| rootCAConfig.key | <code>string</code> | The root CA private key in PEM format. |
| rootCAConfig.cert | <code>string</code> | The root CA certificate in PEM format. |

<a name="Certificate.setDefaultAttrs"></a>

### Certificate.setDefaultAttrs(attrs)
Sets the default attributes for certificate generation.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  

| Param | Type | Description |
| --- | --- | --- |
| attrs | <code>Array</code> | The default attributes to set. |

<a name="Certificate.getCertsForHostname"></a>

### Certificate.getCertsForHostname() ⇒ <code>Object</code>
Generates and returns certificates for the hostname, creating them if they do not exist.

**Kind**: static method of [<code>Certificate</code>](#Certificate)  
**Returns**: <code>Object</code> - The certificates for the hostname.  
<a name="JWT"></a>

## JWT : <code>object</code>
**Kind**: global namespace  

* [JWT](#JWT) : <code>object</code>
    * [.encode(payload, secret, [header])](#JWT.encode) ⇒ <code>string</code>
    * [.decode(token, secret)](#JWT.decode) ⇒ <code>Object</code>

<a name="JWT.encode"></a>

### JWT.encode(payload, secret, [header]) ⇒ <code>string</code>
Encodes a payload into a JSON Web Token (JWT) using HMAC with SHA-256.

**Kind**: static method of [<code>JWT</code>](#JWT)  
**Returns**: <code>string</code> - The encoded JWT.  
**Throws**:

- <code>Error</code> If the secret is not provided.


| Param | Type | Description |
| --- | --- | --- |
| payload | <code>Object</code> | The payload to encode. |
| secret | <code>string</code> | The secret key used for signing the token. |
| [header] | <code>Object</code> | Additional header values for the token. |

<a name="JWT.decode"></a>

### JWT.decode(token, secret) ⇒ <code>Object</code>
Decodes and verifies a JSON Web Token (JWT).

**Kind**: static method of [<code>JWT</code>](#JWT)  
**Returns**: <code>Object</code> - The decoded payload.  
**Throws**:

- <code>Error</code> If the token or secret is not provided, if the token is malformed, or if the token is expired.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The JWT to decode. |
| secret | <code>string</code> | The secret key used for verification. |

<a name="OTP"></a>

## OTP : <code>object</code>
**Kind**: global namespace  

* [OTP](#OTP) : <code>object</code>
    * [.base32Encode(buffer)](#OTP.base32Encode) ⇒ <code>string</code>
    * [.base32Decode(string)](#OTP.base32Decode) ⇒ <code>Buffer</code>
    * [.hotp(options)](#OTP.hotp) ⇒ <code>string</code>
    * [.totp(options)](#OTP.totp) ⇒ <code>string</code>
    * [.otpauth(options)](#OTP.otpauth) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="OTP.base32Encode"></a>

### OTP.base32Encode(buffer) ⇒ <code>string</code>
Encodes a buffer into a Base32 string.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The Base32 encoded string.  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>Buffer</code> | The buffer to encode. |

<a name="OTP.base32Decode"></a>

### OTP.base32Decode(string) ⇒ <code>Buffer</code>
Decodes a Base32 string into a buffer.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>Buffer</code> - The decoded buffer.  
**Throws**:

- <code>Error</code> If the string contains invalid Base32 characters.


| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | The Base32 string to decode. |

<a name="OTP.hotp"></a>

### OTP.hotp(options) ⇒ <code>string</code>
Generates a HMAC-based One-Time Password (HOTP).

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated HOTP.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The options for generating the HOTP. |
| options.key | <code>string</code> |  | The secret key used for generating the HOTP. |
| options.counter | <code>number</code> |  | The counter value. |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | The hash algorithm to use (e.g., "sha1", "sha256", "sha512"). |
| [options.digits] | <code>number</code> | <code>6</code> | The number of digits for the HOTP. |
| [options.encoding] | <code>string</code> | <code>&quot;\&quot;ascii\&quot;&quot;</code> | The encoding of the secret key. |

<a name="OTP.totp"></a>

### OTP.totp(options) ⇒ <code>string</code>
Generates a Time-based One-Time Password (TOTP).

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated TOTP.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The options for generating the TOTP. |
| options.key | <code>string</code> |  | The secret key used for generating the TOTP. |
| [options.T] | <code>number</code> |  | The current time in seconds. |
| [options.T0] | <code>number</code> | <code>0</code> | The start time in seconds. |
| [options.X] | <code>number</code> | <code>30</code> | The time step in seconds. |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | The hash algorithm to use (e.g., "sha1", "sha256", "sha512"). |
| [options.digits] | <code>number</code> | <code>6</code> | The number of digits for the TOTP. |
| [options.encoding] | <code>string</code> | <code>&quot;\&quot;ascii\&quot;&quot;</code> | The encoding of the secret key. |

<a name="OTP.otpauth"></a>

### OTP.otpauth(options) ⇒ <code>Promise.&lt;Object&gt;</code>
Generates an otpauth URL and corresponding QR code for OTP configuration.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves with the OTP configuration and QR code.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The options for generating the otpauth URL. |
| [options.type] | <code>string</code> | <code>&quot;\&quot;totp\&quot;&quot;</code> | The type of OTP (e.g., "hotp", "totp"). |
| [options.label] | <code>string</code> | <code>&quot;\&quot;label\&quot;&quot;</code> | The label for the OTP. |
| [options.secret] | <code>string</code> |  | The secret key for the OTP. |
| [options.issuer] | <code>string</code> |  | The issuer of the OTP. |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | The hash algorithm to use (e.g., "sha1", "sha256", "sha512"). |
| [options.digits] | <code>number</code> | <code>6</code> | The number of digits for the OTP. |
| [options.counter] | <code>number</code> | <code>0</code> | The counter value for HOTP. |
| [options.period] | <code>number</code> | <code>30</code> | The time period in seconds for TOTP. |

<a name="Validator"></a>

## Validator : <code>object</code>
**Kind**: global namespace  
<a name="Validator.validate"></a>

### Validator.validate()
**Kind**: static method of [<code>Validator</code>](#Validator)  
