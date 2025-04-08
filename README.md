# Custom HTTP Framework for Fintech

A modular, lightweight, and flexible HTTP framework built from scratch in Node.js. Designed specifically for fintech and enterprise-grade API development, this framework includes essential features such as routing, middleware, security, authentication, rate limiting, validation, and WebSocket support.

---

## Feature Overview

### Core
- Custom-built HTTP router
  - Supports all HTTP methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
  - Dynamic route parameters (e.g., `/user/:id`)
  - Wildcard routing (e.g., `/static/*`)
  - Nested routing and modular structure
  - Middleware chaining with async/await and error handling
  - Timeout detection for middleware that doesn't call `next()`

### Built-in Middleware
- `json`: Parses JSON request bodies
- `cookie`: Parses and sets HTTP cookies
- `cors`: Adds CORS headers
- `security`: Adds secure HTTP headers (e.g., XSS protection, CSP)
- `compression`: Supports gzip, deflate, and brotli
- `static`: Serves static files
- `missing`: Handles 404 errors
- `catchAll`: General error handler
- `timeout`: Detects stuck middleware with timeout and force error handling

### Authentication and Security
- OTP Module (Passwordless Authentication)
  - Supports TOTP and HOTP (based on RFC 6238 and RFC 4226)
  - Includes Base32 encoder/decoder
  - Supports OTP URI and QR code generation
- JWT Module
  - Supports HS256, RS256, ES256, PS256, and more
  - Uses built-in crypto and base64url encoding
- Authorization Middleware
  - Permission system based on role, token type, method, and path
  - Integrated in modular router structure (controller.js, model.js)

### Rate Limiting
- Basic Mode
  - Limits based on IP, method, and path using in-memory cache
- Advanced Mode
  - Accepts array of configuration rules: `{ method, path, timeWindow, requestQuota }`
  - Uses path-to-regexp for pattern matching
  - Supports wildcard: `*` for method and path

### HTTP Client
- Custom Fetch Wrapper
  - Based on `undici.fetch`
  - Supports HTTP proxy via `HTTP_PROXY` environment variable
  - Includes session-based cookie store
  - Prepared for optional caching layer

### WebSocket Support
- Manual upgrade handling without external dependencies
- Event-based interface for connection, message, close, and error
- Supports both text and binary frames
- Includes client management and broadcasting support

### Utility Libraries (`src/lib/*.js`)
- `base32.js`: Encoding and decoding in Base32 (used in OTP)
- `cache-map.js`: Map with optional memory limit, used for caching
- `cookie-store.js`: Cookie store class used by fetch wrapper
- `crash.js`: Global crash handler for process errors
- `env.js`: Loads `.env` files into `process.env`
- `fetch.js`: Custom fetch wrapper using `undici`
- `file.js`: Utility functions for file operations
- `jwt.js`: Implementation of JSON Web Tokens
- `otp.js`: One-time password generation and validation
- `router.js`: HTTP routing system with middleware support
- `store.js`: In-memory key-value store abstraction
- `timeout.js`: Middleware to detect and handle stalled requests
- `util.js`: Common utility functions
- `validation.js`: Schema-based validation engine
- `web-socket.js`: WebSocket server and client handler

---

## Project Structure

```
project-root
│
├── data
│   └── session.json
│
├── dist
│   ├── index.html
│   ├── index.js
│   └── index.css
│
├── src
│   ├── index.js
│   ├── lib
│   │   ├── base32.js
│   │   ├── cache-map.js
│   │   ├── cookie-store.js
│   │   ├── crash.js
│   │   ├── env.js
│   │   ├── fetch.js
│   │   ├── file.js
│   │   ├── jwt.js
│   │   ├── otp.js
│   │   ├── router.js
│   │   ├── store.js
│   │   ├── timeout.js
│   │   ├── util.js
│   │   ├── validation.js
│   │   └── web-socket.js
│   │
│   ├── api
│   │   ├── index.js
│   │   ├── main
│   │   │   ├── controller.js
│   │   │   ├── index.js
│   │   │   └── model.js
│   │   ├── auth
│   │   │   ├── controller.js
│   │   │   ├── index.js
│   │   │   └── model.js
│   │   └── other
│   │       ├── controller.js
│   │       ├── index.js
│   │       └── model.js
│
└── test
    └── *.js
```

---

## Example Usage

```js
require("./lib/crash.js");
require("./lib/env.js");

const http = require("http");
const https = require("https");
const path = require("path");
const Router = require("./lib/router.js");
const { authorization } = require("./api/auth/middleware.js");
const WebSocket = require("./lib/web-socket.js");

const app = new Router();

app.use(Router.timeout(10000));
app.use(Router.compression());
app.use(Router.cookie());
app.use(Router.json());
app.use(Router.cors());
app.use(Router.security());
app.use(
    Router.rateLimit([
        { method: "POST", path: "/api/auth/request", timeWindow: 60, requestQuota: 3 },
        { method: "POST", path: "/api/auth/verify", timeWindow: 60, requestQuota: 3 },
        { method: "POST", path: "/api/auth/refresh", timeWindow: 60, requestQuota: 100 },
        { method: "POST", path: "/api/auth/revoke", timeWindow: 60, requestQuota: 100 },
    ])
);
app.use(
    authorization([
        { role: "admin", type: "refresh_token", method: "POST", path: "/api/auth/refresh", scope: "own" },
        { role: "admin", type: "access_token", method: "POST", path: "/api/auth/revoke", scope: "own" },
        { role: "user", type: "refresh_token", method: "POST", path: "/api/auth/refresh", scope: "own" },
        { role: "user", type: "access_token", method: "POST", path: "/api/auth/revoke", scope: "own" },
    ])
);
app.use(Router.static(path.join(process.cwd(), "dist")));
app.use("/api", require("./api/index.js"));
app.use(Router.missing());
app.use(Router.catchAll());

const httpServer = http.createServer();
const httpsServer = https.createServer({});

httpServer.on("request", app.request);
httpsServer.on("request", app.request);

const socket = new WebSocket();

socket.on("connection", (client) => {
    client.on("open", () => {
        client.send(JSON.stringify({ message: "from server" }));
    });
    client.on("message", console.log);
    client.on("close", console.log);
    client.on("error", console.log);
});

httpServer.on("upgrade", socket.upgrade);
httpsServer.on("upgrade", socket.upgrade);

httpServer.listen(process.env.HTTP_PORT, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(process.env.HTTPS_PORT, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
```

---

## Development Roadmap
- Redis-like backend for `CacheMap`
- Built-in unit testing utilities
- CLI for scaffolding project modules
- OpenAPI/Swagger generation
- Full authentication flow (login, token, refresh, revoke)

---

This framework is created specifically for internal fintech and ERP systems. It is built with a strong emphasis on flexibility, maintainability, and performance.

Developed and maintained by Ridho Prasetya (Ndiing).
