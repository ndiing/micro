# Micro Framework

Micro Framework adalah framework HTTP berbasis Node.js yang ringan, modular, dan fleksibel. Dirancang khusus untuk kebutuhan API modern seperti fintech dan ERP, framework ini mendukung arsitektur HMVC dan dapat dikembangkan untuk pendekatan Microservice.

## Fitur Utama

- **Router Modular**: Mendukung nested router, dynamic params (`:param`), wildcard route (`*`), dan semua HTTP method.
- **Middleware**: Mendukung chaining async/await, dengan middleware seperti JSON parser, cookie handler, CORS, security headers, compression, rate limiter, error handler, dll.
- **Autentikasi**: Mendukung JWT dan OTP (HOTP/TOTP) dengan validasi dan otorisasi berbasis role.
- **Validasi**: Skema validasi fleksibel berbasis class `Validation`, dengan konversi dan pemeriksaan tipe otomatis.
- **Fetch API Custom**: Wrapper untuk `undici.fetch` dengan dukungan proxy, cookie, dan penyimpanan data sementara.
- **WebSocket Custom**: Implementasi WebSocket dari nol dengan manajemen client dan event dasar.
- **Static File Handler**: Middleware untuk melayani file statis dari direktori tertentu.
- **Struktur Modular**: Menggunakan pola seperti HMVC dengan pembagian `controller`, `model`, `middleware`, dan `schema` (opsional).

## Struktur Folder

```
C:.
├── data                  # Data lokal seperti session/token
├── dist                  # Build output (jika diperlukan)
├── rest                  # File REST client untuk testing API
├── src
│   ├── api
│   │   ├── auth          # Modul otentikasi
│   │   │   ├── controller.js
│   │   │   ├── index.js
│   │   │   ├── middleware.js
│   │   │   └── model.js
│   │   └── main          # Modul utama API
│   │       └── index.js
│   └── lib               # Pustaka internal (core engine dan helper)
│       ├── base32.js
│       ├── cache-map.js
│       ├── cookie-store.js
│       ├── crash.js
│       ├── env.js
│       ├── fetch.js
│       ├── file.js
│       ├── jwt.js
│       ├── otp.js
│       ├── router.js
│       ├── store.js
│       ├── util.js
│       ├── validation.js
│       └── web-socket.js
├── test                  # Unit test untuk tiap modul
├── .gitattributes
├── .gitignore
├── .prettierrc
├── DOCS.md
├── env.json
├── LICENSE
├── nodemon.json
├── package-lock.json
├── package.json
└── README.md             # Dokumentasi proyek ini
```

## Contoh Rute Modular

```js
// src/api/auth/index.js
const { router } = require("../../lib/router");
const controller = require("./controller");
const middleware = require("./middleware");

router.post("/login", controller.login);
router.get("/me", middleware.authorization("user"), controller.me);

module.exports = router;
```

## Validasi Skema

```js
const schema = {
  email: {
    type: "string",
    required: true,
    pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  },
  password: {
    type: "string",
    required: true,
    minLength: 6,
  },
};

const validator = new Validation(schema);
const { result, errors } = validator.validate(req.body);
```

## Rencana Pengembangan

- [ ] Integrasi database native (ORM ringan)
- [ ] Dokumentasi Swagger otomatis
- [ ] Command Line Interface (CLI) untuk generate modul
- [ ] Middleware request timeout dan retry
- [ ] Modul business logic terpisah dari controller (opsional)
- [ ] Integrasi testing otomatis (Jest, Supertest, dll)

## Lisensi

MIT License

---

> Dibangun dengan semangat by Ndiing ⚡