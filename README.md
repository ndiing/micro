# Custom HTTP Framework for Node.js

A lightweight, fully-custom HTTP framework for Node.js, built from scratch without Express or Fastify. Designed specifically for **Fintech** and **ERP** API backends, prioritizing modularity, performance, and security.

---

## 🚀 Features

### ⚙️ Core
- Native HTTP server (no Express)
- Full support for all HTTP methods
- Dynamic route params (`/user/:id`) and wildcard route (`/api/*`)
- Nested router support
- Middleware chaining with `async/await`
- Built-in error handling and 404 fallback

### 🧱 Modular Architecture
- `router.js`: Route and nested route definition
- `controller.js`: Handler functions and middleware usage
- `model.js`: Permission definitions per role/type/method

### 🧰 Built-in Middleware
- `json` – JSON body parser
- `cookie` – Cookie parser and setter
- `cors` – CORS headers
- `security` – Security headers (CSP, XSS, etc.)
- `compression` – `gzip`, `deflate`, and `brotli` encoding
- `rateLimit` – Rate limiter using custom `CacheMap`
- `authorization` – Role/type/method checker
- `static` – Static file server
- `missing` – 404 handler
- `catchAll` – Global error handler

### 🔒 Auth System

#### ✅ JWT (JSON Web Token)
- Native implementation (no external libraries)
- Support for: `HS256`, `HS384`, `HS512`, `RS256`, `RS384`, `RS512`, `ES256`, `ES384`, `ES512`, `PS256`, `PS384`, `PS512`
- Base64url support with correct padding and saltLength

#### ✅ OTP (One-Time Password)
- HOTP and TOTP support
- Custom Base32 encoder/decoder
- OTP URI + QR Code generator

#### 🔄 Passwordless Login (Planned)
- OTP-based login flow
- Temporary storage via `CacheMap` or Redis

### 🧠 Custom Utilities

#### 🧩 CacheMap
- `Map` extension with TTL and memory limit
- Auto garbage collection
- LRU-like eviction strategy

#### 🌐 Custom Fetch Wrapper
- Uses `undici.fetch`
- Proxy support via `HTTP_PROXY` + `ProxyAgent`
- Built-in cookieStore for persistent request cookies

#### 🔌 WebSocket Library
- Manual HTTP to WS upgrade
- RFC-compliant framing
- Event-based client handling (`open`, `message`, `close`, `error`)
- No external dependencies (`ws` not used)

---

## 🎯 Focus and Design Philosophy

This framework is tailored for:
- Fintech and ERP APIs
- High security and performance
- Microservices or monolith architecture
- Fully customizable and modular core

---

## 🛠️ Roadmap

| Feature                        | Status       | Notes                                                   |
|-------------------------------|--------------|---------------------------------------------------------|
| Middleware timeout handler    | Planned      | Guard against uncalled `next()` in async middleware     |
| Request validator             | Planned      | JSON Schema or custom validation rules                  |
| Built-in logger               | Planned      | Middleware logger / audit logger                        |
| CLI tools                     | Planned      | Module scaffolder, route generator                      |
| Test suite                    | Planned      | Unit/integration testing (uvu/tap/vitest)               |
| Granular rate limiter config | In Progress  | Per method+path, based on permission-style structure    |
| Auto documentation generator | Planned      | Generate docs from route/controller metadata            |

---

## 📂 License

MIT License

---

## 👤 Author

Built with ❤️ by Ridho Prasetya (Ndiing)

