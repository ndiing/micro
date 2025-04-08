# Custom HTTP Framework for Fintech

A modular, lightweight, and flexible HTTP framework built from scratch in Node.js. Designed specifically for fintech and enterprise-grade API development, it includes essential features like routing, middleware, security, authentication, rate limiting, and validation.

---

## 📦 Features Overview

### 🧩 Core
- **Custom HTTP Router**
  - Supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`
  - Dynamic params (`/user/:id`)
  - Wildcard routes (`/static/*`)
  - Nested routing and modular router structure
  - Middleware chaining (with `async/await` and error handling)

### 🛠 Built-in Middleware
- `json` – JSON body parser
- `cookie` – Cookie parser and setter
- `cors` – CORS headers
- `security` – Secure HTTP headers (XSS, CSP, etc.)
- `compression` – `gzip`, `deflate`, and `br` support
- `static` – Serve static files from a directory
- `missing` – 404 handler
- `catchAll` – General error handler
- `rateLimit` – Rule-based rate limiter
- `validation` – Schema-based input validator

### 🔐 Auth & Security
- **OTP Module** (passwordless auth)
  - Supports TOTP and HOTP (RFC 6238 & RFC 4226)
  - Base32 encoder/decoder, QR code generation, OTP URI
- **JWT Class**
  - Support for HS256, RS256, ES256, PS256, and more
  - Manual `crypto` + `base64url` implementation
- **Authorization Middleware**
  - Role/type/method-based permission system
  - Integrated into modular router (`controller.js`, `model.js`)

### ⚡ Rate Limiter
- Configurable rules using array of `{ method, path, timeWindow, requestQuota }`
- Path matching via `path-to-regexp`
- Wildcard support: `method: "*"`, `path: "*"`
- Works seamlessly with auth endpoints (e.g., OTP, refresh, revoke)

### 🌐 Networking
- **Custom Fetch Module**
  - Wrapper for `undici.fetch`
  - Auto-proxy support using `HTTP_PROXY`
  - Cookie store per session/request
  - Plan for optional caching layer

### 📡 WebSocket
- Manual upgrade handling (`http`, `crypto`, no external deps)
- Event-based: `connection`, `message`, `close`, `error`
- Support for binary/text frames
- Manages connected clients and message broadcast

### 🧠 Utilities
- **CacheMap Class**
  - Extends native `Map`
  - Memory-limited in-memory store (planned)
  - Used by rate limiter and temporary caching

### ✅ Validation Module
- Schema-based validation for request data
- Supports body, query, and params
- Custom rules, nested objects/arrays, optional fields
- Middleware-compatible for route-specific validation

---

## 📁 Project Structure
```
data/session.json

dist/index.html
dist/index.js
dist/index.css

src/index.js

src/lib/**/*.js
src/test/**/*.js

src/api/index.js

src/api/main/index.js
src/api/main/controller.js
src/api/main/model.js

src/api/auth/index.js
src/api/auth/controller.js
src/api/auth/model.js

src/api/other/index.js
src/api/other/controller.js
src/api/other/model.js
```

---

## 🚀 Usage Example
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
    ]),
);
app.use(
    authorization([
        { role: "admin", type: "refresh_token", method: "POST", path: "/api/auth/refresh", scope: "own" },
        { role: "admin", type: "access_token", method: "POST", path: "/api/auth/revoke", scope: "own" },
        { role: "user", type: "refresh_token", method: "POST", path: "/api/auth/refresh", scope: "own" },
        { role: "user", type: "access_token", method: "POST", path: "/api/auth/revoke", scope: "own" },
    ]),
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

## 💡 Future Plans
- Redis-like backend for CacheMap
- Built-in testing utilities
- CLI scaffolding
- Swagger/OpenAPI generation
- Full E2E auth flow (login → JWT → refresh → revoke)

---

Framework ini dibuat khusus untuk kebutuhan internal fintech dan ERP. Ringan, modular, dan disusun dengan prinsip fleksibilitas dan maintainability tinggi.

---

Created with ❤️ by Ridho Prasetya (Ndiing)

