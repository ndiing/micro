## Classes

<dl>
<dt><a href="#Base32">Base32</a></dt>
<dd><p>Base32 class responsible for encoding and decoding data using Base32 encoding.</p>
</dd>
<dt><a href="#CacheMap">CacheMap</a> ⇐ <code>Map</code></dt>
<dd><p>CacheMap class extends the native Map with additional memory management capabilities.
Automatically clears least recently used entries when memory usage exceeds the defined threshold.</p>
</dd>
<dt><a href="#CookieStore">CookieStore</a></dt>
<dd><p>CookieStore class responsible for managing cookies in an object-like format.</p>
</dd>
<dt><a href="#File">File</a></dt>
<dd><p>File class provides methods for reading and writing files,
including support for JSON and compressed (.gz) files.</p>
</dd>
<dt><a href="#JWT">JWT</a></dt>
<dd><p>JWT class responsible for encoding, decoding, signing, and verifying JSON Web Tokens (JWT).</p>
</dd>
<dt><a href="#OTP">OTP</a></dt>
<dd><p>OTP class provides methods for generating and managing One-Time Passwords (OTP),
including HOTP, TOTP, random key generation, and OTP authentication URL creation.</p>
</dd>
<dt><a href="#Router">Router</a></dt>
<dd><p>Router class provides an Express-like routing system for handling HTTP requests.</p>
</dd>
<dt><a href="#Store">Store</a></dt>
<dd><p>Store class provides a proxy-based mechanism for handling data storage,
supporting automatic persistence and caching.</p>
</dd>
<dt><a href="#Converter">Converter</a></dt>
<dd><p>Converter class provides utility methods for type conversion.</p>
</dd>
<dt><a href="#Validator">Validator</a></dt>
<dd><p>Validator class provides utility methods for validating different data constraints.</p>
</dd>
<dt><a href="#Validation">Validation</a></dt>
<dd><p>Validation class manages schema-based validation and type conversion.</p>
</dd>
<dt><a href="#WebSocket">WebSocket</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>WebSocket class responsible for managing WebSocket connections, including sending and receiving messages.
Extends EventEmitter to handle connection events.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#originalToString">originalToString</a> ⇒ <code>string</code></dt>
<dd><p>Overrides the Buffer.toString method to support Base32 encoding.</p>
</dd>
<dt><a href="#originalFrom">originalFrom</a> ⇒ <code>Buffer</code></dt>
<dd><p>Overrides the Buffer.from method to support Base32 decoding.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#fetch">fetch([input], [init])</a> ⇒ <code>Promise.&lt;Response&gt;</code></dt>
<dd><p>Custom fetch function that supports proxies and cookie management.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#StatusFunction">StatusFunction</a> ⇒ <code><a href="#CustomResponse">CustomResponse</a></code></dt>
<dd></dd>
<dt><a href="#SendFunction">SendFunction</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#JsonFunction">JsonFunction</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#SendFileFunction">SendFileFunction</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#CustomRequest">CustomRequest</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CustomResponse">CustomResponse</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Base32"></a>

## Base32
Base32 class responsible for encoding and decoding data using Base32 encoding.

**Kind**: global class  

* [Base32](#Base32)
    * _instance_
        * [.alphabet](#Base32+alphabet) : <code>string</code>
    * _static_
        * [.encode(buffer)](#Base32.encode) ⇒ <code>string</code>
        * [.decode(string)](#Base32.decode) ⇒ <code>Buffer</code>

<a name="Base32+alphabet"></a>

### base32.alphabet : <code>string</code>
Alphabet used for Base32 encoding.

**Kind**: instance property of [<code>Base32</code>](#Base32)  
<a name="Base32.encode"></a>

### Base32.encode(buffer) ⇒ <code>string</code>
Encodes a given buffer into a Base32 string.

**Kind**: static method of [<code>Base32</code>](#Base32)  
**Returns**: <code>string</code> - The Base32 encoded string.  
**Throws**:

- <code>Error</code> If an invalid buffer is provided.


| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>Buffer</code> \| <code>string</code> | The data to encode. If a string is provided, it will be converted into a Buffer. |

<a name="Base32.decode"></a>

### Base32.decode(string) ⇒ <code>Buffer</code>
Decodes a Base32 encoded string into a Buffer.

**Kind**: static method of [<code>Base32</code>](#Base32)  
**Returns**: <code>Buffer</code> - The decoded data as a Buffer.  
**Throws**:

- <code>Error</code> If the string contains invalid Base32 characters.


| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | The Base32 encoded string to decode. |

<a name="CacheMap"></a>

## CacheMap ⇐ <code>Map</code>
CacheMap class extends the native Map with additional memory management capabilities.
Automatically clears least recently used entries when memory usage exceeds the defined threshold.

**Kind**: global class  
**Extends**: <code>Map</code>  

* [CacheMap](#CacheMap) ⇐ <code>Map</code>
    * [new CacheMap([entries], [options])](#new_CacheMap_new)
    * [.has(key)](#CacheMap+has) ⇒ <code>boolean</code>
    * [.get(key)](#CacheMap+get) ⇒ <code>\*</code>
    * [.set(key, value)](#CacheMap+set)
    * [.usageMem()](#CacheMap+usageMem) ⇒ <code>number</code>
    * [.clearMem()](#CacheMap+clearMem)

<a name="new_CacheMap_new"></a>

### new CacheMap([entries], [options])
Creates an instance of the CacheMap class.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [entries] | <code>Iterable</code> |  | Initial key-value pairs for the map. |
| [options] | <code>Object</code> | <code>{}</code> | Configuration options for cache behavior. |
| [options.maxMem] | <code>number</code> | <code>0.9</code> | The maximum memory usage threshold before clearing cache. |

<a name="CacheMap+has"></a>

### cacheMap.has(key) ⇒ <code>boolean</code>
Checks if a key exists in the map, moving it to the most recently accessed position if found.

**Kind**: instance method of [<code>CacheMap</code>](#CacheMap)  
**Returns**: <code>boolean</code> - True if the key exists, otherwise false.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>\*</code> | The key to check. |

<a name="CacheMap+get"></a>

### cacheMap.get(key) ⇒ <code>\*</code>
Retrieves a value from the map, moving it to the most recently accessed position.

**Kind**: instance method of [<code>CacheMap</code>](#CacheMap)  
**Returns**: <code>\*</code> - The value associated with the key, or undefined if not found.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>\*</code> | The key to retrieve. |

<a name="CacheMap+set"></a>

### cacheMap.set(key, value)
Sets a key-value pair in the map, ensuring that existing keys are repositioned.

**Kind**: instance method of [<code>CacheMap</code>](#CacheMap)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>\*</code> | The key to store. |
| value | <code>\*</code> | The value associated with the key. |

<a name="CacheMap+usageMem"></a>

### cacheMap.usageMem() ⇒ <code>number</code>
Calculates the current memory usage.

**Kind**: instance method of [<code>CacheMap</code>](#CacheMap)  
**Returns**: <code>number</code> - The percentage of used memory (0 to 1).  
<a name="CacheMap+clearMem"></a>

### cacheMap.clearMem()
Clears the least recently used entries when memory usage exceeds the defined threshold.

**Kind**: instance method of [<code>CacheMap</code>](#CacheMap)  
<a name="CookieStore"></a>

## CookieStore
CookieStore class responsible for managing cookies in an object-like format.

**Kind**: global class  

* [CookieStore](#CookieStore)
    * [new CookieStore([init])](#new_CookieStore_new)
    * [.cookie](#CookieStore+cookie) ⇒ <code>string</code>
    * [.cookie](#CookieStore+cookie)
    * [.delete(name)](#CookieStore+delete)
    * [.get(name)](#CookieStore+get) ⇒ <code>\*</code>
    * [.getAll(name)](#CookieStore+getAll) ⇒ <code>Array</code>
    * [.set(name, [value])](#CookieStore+set)

<a name="new_CookieStore_new"></a>

### new CookieStore([init])
Creates an instance of CookieStore.


| Param | Type | Description |
| --- | --- | --- |
| [init] | <code>Object</code> | An optional object containing initial cookie values. |

<a name="CookieStore+cookie"></a>

### cookieStore.cookie ⇒ <code>string</code>
Retrieves the cookie string representing all stored cookies.

**Kind**: instance property of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>string</code> - A string representation of cookies in the format "key=value; key2=value2".  
<a name="CookieStore+cookie"></a>

### cookieStore.cookie
Parses and sets cookies from a cookie string or an array of cookie strings.

**Kind**: instance property of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>Array.&lt;string&gt;</code> | The cookie string or array of cookie strings to parse. |

<a name="CookieStore+delete"></a>

### cookieStore.delete(name)
Deletes a cookie by its name.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the cookie to delete. |

<a name="CookieStore+get"></a>

### cookieStore.get(name) ⇒ <code>\*</code>
Retrieves a cookie value by its name.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>\*</code> - The value of the cookie, or undefined if not found.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the cookie to retrieve. |

<a name="CookieStore+getAll"></a>

### cookieStore.getAll(name) ⇒ <code>Array</code>
Retrieves all cookies stored under a specific name.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  
**Returns**: <code>Array</code> - An array of cookie values matching the specified name.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the cookies to retrieve. |

<a name="CookieStore+set"></a>

### cookieStore.set(name, [value])
Sets a cookie with the given name and value.

**Kind**: instance method of [<code>CookieStore</code>](#CookieStore)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>Object</code> | The name of the cookie, or an object with { name, value }. |
| [value] | <code>\*</code> | The value of the cookie (if `name` is a string). |

<a name="File"></a>

## File
File class provides methods for reading and writing files,
including support for JSON and compressed (.gz) files.

**Kind**: global class  

* [File](#File)
    * [.read(filename)](#File.read) ⇒ <code>Buffer</code> \| <code>Object</code> \| <code>string</code>
    * [.write(filename, data)](#File.write)

<a name="File.read"></a>

### File.read(filename) ⇒ <code>Buffer</code> \| <code>Object</code> \| <code>string</code>
Reads a file synchronously. If the file is compressed (.gz), it decompresses it.
If the file is a JSON file, it parses the contents.

**Kind**: static method of [<code>File</code>](#File)  
**Returns**: <code>Buffer</code> \| <code>Object</code> \| <code>string</code> - The file content, parsed if JSON, decompressed if .gz.  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The file path to read. |

<a name="File.write"></a>

### File.write(filename, data)
Writes data to a file synchronously. Supports JSON serialization and gzip compression.
Creates the necessary directories if they do not exist.

**Kind**: static method of [<code>File</code>](#File)  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The file path to write. |
| data | <code>Buffer</code> \| <code>Object</code> \| <code>string</code> | The data to write, automatically serialized if JSON. |

<a name="JWT"></a>

## JWT
JWT class responsible for encoding, decoding, signing, and verifying JSON Web Tokens (JWT).

**Kind**: global class  

* [JWT](#JWT)
    * [.sign([header], [payload], [secret])](#JWT.sign) ⇒ <code>string</code>
    * [.verify([token], [secret])](#JWT.verify) ⇒ <code>Object</code>
    * [.decode([token])](#JWT.decode) ⇒ <code>Object</code>

<a name="JWT.sign"></a>

### JWT.sign([header], [payload], [secret]) ⇒ <code>string</code>
Signs a payload into a JSON Web Token (JWT) using the specified algorithm and secret.

**Kind**: static method of [<code>JWT</code>](#JWT)  
**Returns**: <code>string</code> - The signed JWT.  
**Throws**:

- <code>Error</code> If the algorithm is missing or invalid.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [header] | <code>Object</code> | <code>{}</code> | The JWT header containing metadata like algorithm. |
| [payload] | <code>Object</code> | <code>{}</code> | The payload containing claims. |
| [secret] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The secret key used to sign the token. |

<a name="JWT.verify"></a>

### JWT.verify([token], [secret]) ⇒ <code>Object</code>
Verifies a JSON Web Token (JWT) and checks its validity.

**Kind**: static method of [<code>JWT</code>](#JWT)  
**Returns**: <code>Object</code> - The decoded payload if the token is valid.  
**Throws**:

- <code>Error</code> If the token is missing, malformed, expired, or signature verification fails.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [token] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The JWT to verify. |
| [secret] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The secret key used for verification. |

<a name="JWT.decode"></a>

### JWT.decode([token]) ⇒ <code>Object</code>
Decodes the header and payload of a JSON Web Token (JWT) without verifying the signature.

**Kind**: static method of [<code>JWT</code>](#JWT)  
**Returns**: <code>Object</code> - An object containing the decoded header and payload.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [token] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The JWT to decode. |

<a name="OTP"></a>

## OTP
OTP class provides methods for generating and managing One-Time Passwords (OTP),
including HOTP, TOTP, random key generation, and OTP authentication URL creation.

**Kind**: global class  

* [OTP](#OTP)
    * [.hotp(options)](#OTP.hotp) ⇒ <code>string</code>
    * [.totp(options)](#OTP.totp) ⇒ <code>string</code>
    * [.randomKey(options)](#OTP.randomKey) ⇒ <code>string</code>
    * [.otpauth(options)](#OTP.otpauth) ⇒ <code>Object</code>

<a name="OTP.hotp"></a>

### OTP.hotp(options) ⇒ <code>string</code>
Generates a HMAC-based One-Time Password (HOTP).

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated HOTP.  
**See**: https://www.ietf.org/rfc/rfc4226.txt  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The parameters for generating HOTP. |
| options.key | <code>string</code> |  | The secret key used for HOTP generation. |
| options.counter | <code>number</code> |  | The counter value. |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | The hash algorithm (sha1, sha256, sha512). |
| [options.digits] | <code>number</code> | <code>6</code> | The number of digits in the OTP. |
| [options.encoding] | <code>string</code> | <code>&quot;\&quot;ascii\&quot;&quot;</code> | The encoding of the secret key. |

<a name="OTP.totp"></a>

### OTP.totp(options) ⇒ <code>string</code>
Generates a Time-based One-Time Password (TOTP).

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated TOTP.  
**See**: https://datatracker.ietf.org/doc/html/rfc6238  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The parameters for generating TOTP. |
| options.key | <code>string</code> |  | The secret key used for TOTP generation. |
| [options.T] | <code>number</code> | <code>Math.floor(Date.now() / 1000)</code> | The current time in seconds. |
| [options.T0] | <code>number</code> | <code>0</code> | The Unix timestamp that defines the initial counter value. |
| [options.X] | <code>number</code> | <code>30</code> | The time step in seconds. |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | The hash algorithm (sha1, sha256, sha512). |
| [options.digits] | <code>number</code> | <code>6</code> | The number of digits in the OTP. |
| [options.encoding] | <code>string</code> | <code>&quot;\&quot;ascii\&quot;&quot;</code> | The encoding of the secret key. |

<a name="OTP.randomKey"></a>

### OTP.randomKey(options) ⇒ <code>string</code>
Generates a random secret key.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>string</code> - The generated secret key.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The parameters for key generation. |
| options.algorithm | <code>string</code> |  | The hash algorithm (sha1, sha256, sha512). |
| [options.encoding] | <code>string</code> | <code>&quot;\&quot;base32\&quot;&quot;</code> | The encoding of the generated key. |

<a name="OTP.otpauth"></a>

### OTP.otpauth(options) ⇒ <code>Object</code>
Generates an OTP Authentication URL and corresponding QR code.

**Kind**: static method of [<code>OTP</code>](#OTP)  
**Returns**: <code>Object</code> - An object containing the OTP URL and a QR code link.  
**See**: https://github.com/google/google-authenticator/wiki/Key-Uri-Format  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The parameters for OTP authentication. |
| [options.type] | <code>string</code> | <code>&quot;\&quot;totp\&quot;&quot;</code> | The OTP type (totp or hotp). |
| [options.label] | <code>string</code> | <code>&quot;\&quot;label\&quot;&quot;</code> | The label associated with the OTP. |
| [options.secret] | <code>string</code> |  | The secret key for OTP generation. |
| [options.issuer] | <code>string</code> | <code>&quot;\&quot;issuer\&quot;&quot;</code> | The issuer name. |
| [options.algorithm] | <code>string</code> | <code>&quot;\&quot;sha1\&quot;&quot;</code> | The hash algorithm (sha1, sha256, sha512). |
| [options.digits] | <code>number</code> | <code>6</code> | The number of digits in the OTP. |
| [options.counter] | <code>number</code> |  | The counter value for HOTP. |
| [options.period] | <code>number</code> |  | The time period for TOTP. |

<a name="Router"></a>

## Router
Router class provides an Express-like routing system for handling HTTP requests.

**Kind**: global class  

* [Router](#Router)
    * [new Router([config])](#new_Router_new)
    * _instance_
        * [.routes](#Router+routes) : <code>Array.&lt;Object&gt;</code>
        * [.add(method, path, ...middlewares)](#Router+add)
        * [.use(...args)](#Router+use) ⇒ [<code>Router</code>](#Router)
        * [.get(...args)](#Router+get) ⇒ [<code>Router</code>](#Router)
        * [.head(...args)](#Router+head) ⇒ [<code>Router</code>](#Router)
        * [.options(...args)](#Router+options) ⇒ [<code>Router</code>](#Router)
        * [.trace(...args)](#Router+trace) ⇒ [<code>Router</code>](#Router)
        * [.put(...args)](#Router+put) ⇒ [<code>Router</code>](#Router)
        * [.delete(...args)](#Router+delete) ⇒ [<code>Router</code>](#Router)
        * [.post(...args)](#Router+post) ⇒ [<code>Router</code>](#Router)
        * [.patch(...args)](#Router+patch) ⇒ [<code>Router</code>](#Router)
        * [.connect(...args)](#Router+connect) ⇒ [<code>Router</code>](#Router)
        * [.request(req, res)](#Router+request) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.listen(...args)](#Router+listen) ⇒ <code>http.Server</code>
    * _static_
        * [.compression()](#Router.compression) ⇒ <code>function</code>
        * [.cookie()](#Router.cookie) ⇒ <code>function</code>
        * [.json()](#Router.json) ⇒ <code>function</code>
        * [.cors([headers])](#Router.cors) ⇒ <code>function</code>
        * [.security([headers])](#Router.security) ⇒ <code>function</code>
        * [.rateLimit([rules])](#Router.rateLimit) ⇒ <code>function</code>
        * [.static(dirname)](#Router.static) ⇒ <code>function</code>
        * [.missing()](#Router.missing) ⇒ <code>function</code>
        * [.catchAll()](#Router.catchAll) ⇒ <code>function</code>

<a name="new_Router_new"></a>

### new Router([config])
Creates an instance of Router.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> | Configuration options. |
| [config.requestTimeout] | <code>number</code> | <code>60000</code> | Request timeout in milliseconds. |

<a name="Router+routes"></a>

### router.routes : <code>Array.&lt;Object&gt;</code>
Stores registered routes.

**Kind**: instance property of [<code>Router</code>](#Router)  
<a name="Router+add"></a>

### router.add(method, path, ...middlewares)
Adds a new route to the router.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | HTTP method (e.g., "GET", "POST"). |
| path | <code>string</code> \| <code>function</code> | The route path or middleware function. |
| ...middlewares | <code>function</code> | Middleware functions for handling the request. |

<a name="Router+use"></a>

### router.use(...args) ⇒ [<code>Router</code>](#Router)
Registers middleware for all HTTP methods.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>function</code> | Middleware functions. |

<a name="Router+get"></a>

### router.get(...args) ⇒ [<code>Router</code>](#Router)
Registers a GET route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+head"></a>

### router.head(...args) ⇒ [<code>Router</code>](#Router)
Registers a HEAD route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+options"></a>

### router.options(...args) ⇒ [<code>Router</code>](#Router)
Registers a OPTIONS route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+trace"></a>

### router.trace(...args) ⇒ [<code>Router</code>](#Router)
Registers a TRACE route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+put"></a>

### router.put(...args) ⇒ [<code>Router</code>](#Router)
Registers a PUT route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+delete"></a>

### router.delete(...args) ⇒ [<code>Router</code>](#Router)
Registers a DELETE route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+post"></a>

### router.post(...args) ⇒ [<code>Router</code>](#Router)
Registers a POST route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+patch"></a>

### router.patch(...args) ⇒ [<code>Router</code>](#Router)
Registers a PATCH route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+connect"></a>

### router.connect(...args) ⇒ [<code>Router</code>](#Router)
Registers a CONNECT route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - The router instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Path and middleware functions. |

<a name="Router+request"></a>

### router.request(req, res) ⇒ <code>Promise.&lt;void&gt;</code>
Handles incoming HTTP requests and executes relevant middleware.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| req | [<code>CustomRequest</code>](#CustomRequest) | Custom wrapped request. |
| res | [<code>CustomResponse</code>](#CustomResponse) | Custom wrapped response. |

<a name="Router+listen"></a>

### router.listen(...args) ⇒ <code>http.Server</code>
Starts an HTTP server and listens for incoming requests.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>http.Server</code> - The HTTP server instance.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Arguments passed to `http.createServer().listen()`. |

<a name="Router.compression"></a>

### Router.compression() ⇒ <code>function</code>
Middleware to enable compression (gzip, deflate, brotli) for response bodies.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function.  
<a name="Router.cookie"></a>

### Router.cookie() ⇒ <code>function</code>
Middleware to parse cookies from incoming requests and set cookies in responses.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function.  
<a name="Router.json"></a>

### Router.json() ⇒ <code>function</code>
Middleware to parse incoming JSON request bodies.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function.  
<a name="Router.cors"></a>

### Router.cors([headers]) ⇒ <code>function</code>
Middleware to enable CORS (Cross-Origin Resource Sharing).

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [headers] | <code>Object</code> | <code>{}</code> | Custom headers for CORS. |

<a name="Router.security"></a>

### Router.security([headers]) ⇒ <code>function</code>
Middleware to apply security headers to responses.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [headers] | <code>Object</code> | <code>{}</code> | Additional security headers. |

<a name="Router.rateLimit"></a>

### Router.rateLimit([rules]) ⇒ <code>function</code>
Middleware to implement configurable rate limiting rules for incoming requests.
Multiple rules can be defined based on request method and path.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function for enforcing rate limits.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [rules] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | Array of rate limiting rules. |
| [rules[].method] | <code>string</code> | <code>&quot;\&quot;*\&quot;&quot;</code> | HTTP method to apply rate limiting ("*" applies to all methods). |
| [rules[].path] | <code>string</code> | <code>&quot;\&quot;*\&quot;&quot;</code> | URL path pattern for applying rate limiting. |
| [rules[].timeWindow] | <code>number</code> | <code>60</code> | Time window in seconds for limiting requests. |
| [rules[].requestQuota] | <code>number</code> | <code>100</code> | Maximum number of requests allowed within the time window. |

<a name="Router.static"></a>

### Router.static(dirname) ⇒ <code>function</code>
Middleware to serve static files from a specified directory.
Automatically serves `index.html` if the request targets `/`.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function.  

| Param | Type | Description |
| --- | --- | --- |
| dirname | <code>string</code> | The directory containing static files. |

<a name="Router.missing"></a>

### Router.missing() ⇒ <code>function</code>
Middleware to handle 404 errors.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style middleware function.  
<a name="Router.catchAll"></a>

### Router.catchAll() ⇒ <code>function</code>
Middleware to handle all uncaught errors.

**Kind**: static method of [<code>Router</code>](#Router)  
**Returns**: <code>function</code> - Express-style error handler middleware.  
<a name="Store"></a>

## Store
Store class provides a proxy-based mechanism for handling data storage,
supporting automatic persistence and caching.

**Kind**: global class  

* [Store](#Store)
    * [new Store(target, callback)](#new_Store_new)
    * _instance_
        * [.pools](#Store+pools) : [<code>CacheMap</code>](#CacheMap)
        * [.get(target, property)](#Store+get) ⇒ <code>\*</code>
        * [.set(target, property, value)](#Store+set) ⇒ <code>boolean</code>
        * [.deleteProperty(target, property)](#Store+deleteProperty) ⇒ <code>boolean</code>
    * _static_
        * [.get(filename)](#Store.get) ⇒ [<code>Store</code>](#Store)

<a name="new_Store_new"></a>

### new Store(target, callback)
Creates an instance of the Store class.

**Returns**: <code>Proxy</code> - A proxy wrapping the target object.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target object to be proxied and stored. |
| callback | <code>function</code> | A callback function triggered on property changes. |

<a name="Store+pools"></a>

### store.pools : [<code>CacheMap</code>](#CacheMap)
Cache pool for storing active Store instances.

**Kind**: instance property of [<code>Store</code>](#Store)  
<a name="Store+get"></a>

### store.get(target, property) ⇒ <code>\*</code>
Retrieves a property from the target object.
If the property is an object or array, it returns a proxied version.

**Kind**: instance method of [<code>Store</code>](#Store)  
**Returns**: <code>\*</code> - The retrieved property value.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target object. |
| property | <code>string</code> | The property name to retrieve. |

<a name="Store+set"></a>

### store.set(target, property, value) ⇒ <code>boolean</code>
Sets a property in the target object, triggering the callback.
Ensures changes are persisted.

**Kind**: instance method of [<code>Store</code>](#Store)  
**Returns**: <code>boolean</code> - True if the operation is successful.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target object. |
| property | <code>string</code> | The property name to set. |
| value | <code>\*</code> | The new value to assign. |

<a name="Store+deleteProperty"></a>

### store.deleteProperty(target, property) ⇒ <code>boolean</code>
Deletes a property from the target object, triggering the callback.
Ensures changes are persisted.

**Kind**: instance method of [<code>Store</code>](#Store)  
**Returns**: <code>boolean</code> - True if the operation is successful.  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target object. |
| property | <code>string</code> | The property name to delete. |

<a name="Store.get"></a>

### Store.get(filename) ⇒ [<code>Store</code>](#Store)
Retrieves a stored instance of the target object linked to the specified filename.
Automatically reads the file and initializes storage with automatic persistence.

**Kind**: static method of [<code>Store</code>](#Store)  
**Returns**: [<code>Store</code>](#Store) - The proxied Store instance.  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | The filename where the store data is stored. |

<a name="Converter"></a>

## Converter
Converter class provides utility methods for type conversion.

**Kind**: global class  
<a name="Converter.type"></a>

### Converter.type(expected, value) ⇒ <code>\*</code>
Converts a value into the expected data type.

**Kind**: static method of [<code>Converter</code>](#Converter)  
**Returns**: <code>\*</code> - The converted value.  

| Param | Type | Description |
| --- | --- | --- |
| expected | <code>string</code> | The expected data type ("string", "number", "boolean", "date"). |
| value | <code>\*</code> | The value to convert. |

<a name="Validator"></a>

## Validator
Validator class provides utility methods for validating different data constraints.

**Kind**: global class  

* [Validator](#Validator)
    * [.required(_expected, [message])](#Validator.required) ⇒ <code>function</code>
    * [.minLength(expected, [message])](#Validator.minLength) ⇒ <code>function</code>
    * [.maxLength(expected, [message])](#Validator.maxLength) ⇒ <code>function</code>
    * [.min(expected, [message])](#Validator.min) ⇒ <code>function</code>
    * [.max(expected, [message])](#Validator.max) ⇒ <code>function</code>
    * [.pattern(expected, [message])](#Validator.pattern) ⇒ <code>function</code>

<a name="Validator.required"></a>

### Validator.required(_expected, [message]) ⇒ <code>function</code>
Ensures a value is present and not empty.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>function</code> - A validation function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| _expected | <code>boolean</code> |  | Ignored, kept for compatibility. |
| [message] | <code>string</code> | <code>&quot;\&quot;This field is required.\&quot;&quot;</code> | Custom error message. |

<a name="Validator.minLength"></a>

### Validator.minLength(expected, [message]) ⇒ <code>function</code>
Ensures a string or array has at least the specified minimum length.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>function</code> - A validation function.  

| Param | Type | Description |
| --- | --- | --- |
| expected | <code>number</code> | Minimum length required. |
| [message] | <code>string</code> | Custom error message. |

<a name="Validator.maxLength"></a>

### Validator.maxLength(expected, [message]) ⇒ <code>function</code>
Ensures a string or array does not exceed the specified maximum length.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>function</code> - A validation function.  

| Param | Type | Description |
| --- | --- | --- |
| expected | <code>number</code> | Maximum length allowed. |
| [message] | <code>string</code> | Custom error message. |

<a name="Validator.min"></a>

### Validator.min(expected, [message]) ⇒ <code>function</code>
Ensures a number or date is at least the specified value.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>function</code> - A validation function.  

| Param | Type | Description |
| --- | --- | --- |
| expected | <code>number</code> \| <code>Date</code> | Minimum value required. |
| [message] | <code>string</code> | Custom error message. |

<a name="Validator.max"></a>

### Validator.max(expected, [message]) ⇒ <code>function</code>
Ensures a number or date does not exceed the specified value.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>function</code> - A validation function.  

| Param | Type | Description |
| --- | --- | --- |
| expected | <code>number</code> \| <code>Date</code> | Maximum value allowed. |
| [message] | <code>string</code> | Custom error message. |

<a name="Validator.pattern"></a>

### Validator.pattern(expected, [message]) ⇒ <code>function</code>
Ensures a string matches a specified regular expression pattern.

**Kind**: static method of [<code>Validator</code>](#Validator)  
**Returns**: <code>function</code> - A validation function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| expected | <code>RegExp</code> |  | Regular expression pattern. |
| [message] | <code>string</code> | <code>&quot;\&quot;Please match the requested format.\&quot;&quot;</code> | Custom error message. |

<a name="Validation"></a>

## Validation
Validation class manages schema-based validation and type conversion.

**Kind**: global class  

* [Validation](#Validation)
    * [new Validation(schema)](#new_Validation_new)
    * [.validate(data)](#Validation+validate) ⇒ <code>Object</code>
    * [.validateSchema(schema, [data], [path])](#Validation+validateSchema) ⇒ <code>Object</code>

<a name="new_Validation_new"></a>

### new Validation(schema)
Creates an instance of the Validation class.


| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Object</code> | Schema defining validation rules. |

<a name="Validation+validate"></a>

### validation.validate(data) ⇒ <code>Object</code>
Validates input data against the schema.

**Kind**: instance method of [<code>Validation</code>](#Validation)  
**Returns**: <code>Object</code> - The validated result and any validation errors.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to validate. |

<a name="Validation+validateSchema"></a>

### validation.validateSchema(schema, [data], [path]) ⇒ <code>Object</code>
Recursively validates schema properties.

**Kind**: instance method of [<code>Validation</code>](#Validation)  
**Returns**: <code>Object</code> - The validated result and validation errors.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| schema | <code>Object</code> |  | Schema defining validation rules. |
| [data] | <code>Object</code> | <code>{}</code> | The data to validate. |
| [path] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Path tracking nested validation. |

<a name="WebSocket"></a>

## WebSocket ⇐ <code>EventEmitter</code>
WebSocket class responsible for managing WebSocket connections, including sending and receiving messages.
Extends EventEmitter to handle connection events.

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [WebSocket](#WebSocket) ⇐ <code>EventEmitter</code>
    * [new WebSocket()](#new_WebSocket_new)
    * [.upgrade(req, socket, head)](#WebSocket+upgrade)
    * [.encode(data)](#WebSocket+encode) ⇒ <code>Buffer</code>
    * [.decode(frame)](#WebSocket+decode) ⇒ <code>string</code> \| <code>Buffer</code> \| <code>null</code>

<a name="new_WebSocket_new"></a>

### new WebSocket()
Creates an instance of the WebSocket class.

<a name="WebSocket+upgrade"></a>

### webSocket.upgrade(req, socket, head)
Handles WebSocket upgrade requests and establishes a connection.

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

<a name="originalToString"></a>

## originalToString ⇒ <code>string</code>
Overrides the Buffer.toString method to support Base32 encoding.

**Kind**: global constant  
**Returns**: <code>string</code> - The encoded string if encoding is Base32, otherwise the original behavior.  

| Param | Type | Description |
| --- | --- | --- |
| encoding | <code>string</code> | The encoding type. |
| ...args | <code>any</code> | Additional arguments passed to the original toString method. |

<a name="originalFrom"></a>

## originalFrom ⇒ <code>Buffer</code>
Overrides the Buffer.from method to support Base32 decoding.

**Kind**: global constant  
**Returns**: <code>Buffer</code> - The decoded buffer if encoding is Base32, otherwise the original behavior.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | The Base32 encoded string. |
| encoding | <code>string</code> | The encoding type. |
| ...args | <code>any</code> | Additional arguments passed to the original Buffer.from method. |

<a name="fetch"></a>

## fetch([input], [init]) ⇒ <code>Promise.&lt;Response&gt;</code>
Custom fetch function that supports proxies and cookie management.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Response&gt;</code> - A promise that resolves with the fetch response.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [input] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | The request URL or resource. |
| [init] | <code>Object</code> | <code>{}</code> | Additional fetch configuration options. |
| [init.headers] | <code>Object</code> |  | Request headers. |
| [init.store] | <code>Object</code> |  | An optional cookie store object for managing cookies. |

<a name="StatusFunction"></a>

## StatusFunction ⇒ [<code>CustomResponse</code>](#CustomResponse)
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | HTTP status code. |

<a name="SendFunction"></a>

## SendFunction ⇒ <code>void</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>string</code> \| <code>Buffer</code> | The response body. |

<a name="JsonFunction"></a>

## JsonFunction ⇒ <code>void</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | The JSON data to send. |

<a name="SendFileFunction"></a>

## SendFileFunction ⇒ <code>void</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The file path to send. |

<a name="CustomRequest"></a>

## CustomRequest : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>any</code> | The original request object. |
| _protocol | <code>string</code> | The request protocol (http or https). |
| _host | <code>string</code> | The request host. |
| _base | <code>string</code> | The request base URL. |
| _url | <code>URL</code> | Parsed request URL object. |
| query | <code>Object.&lt;string, string&gt;</code> | Parsed query parameters. |
| params | <code>Object.&lt;string, string&gt;</code> | Route parameters. |

<a name="CustomResponse"></a>

## CustomResponse : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| locals | <code>Object</code> | Object for storing local variables across middlewares. |
| status | [<code>StatusFunction</code>](#StatusFunction) | Set response status. |
| send | [<code>SendFunction</code>](#SendFunction) | Send raw response body. |
| json | [<code>JsonFunction</code>](#JsonFunction) | Send JSON response. |
| sendFile | [<code>SendFileFunction</code>](#SendFileFunction) | Send file response. |

