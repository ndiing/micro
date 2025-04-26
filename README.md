# Micro Framework

Micro Framework adalah framework ringan dan fleksibel untuk pengembangan aplikasi backend menggunakan Node.js.  
Dirancang modular dan minimalis, memanfaatkan `Router` dan `WebSocket` custom dari library internal.

---

## 🚀 Fitur Utama

- **Router & Middleware**: Routing HTTP modern dan dukungan middleware powerful.
- **WebSocket**: Support WebSocket upgrade secara langsung.
- **Validasi**: Validasi dan konversi data input berbasis skema.
- **JWT & OTP**: Pembuatan dan verifikasi JSON Web Token (JWT) dan One-Time Password (OTP).
- **Pengelolaan File**: Membaca dan menulis file JSON, serta kompresi otomatis.
- **Cookie Store**: Otomatisasi penyimpanan dan parsing cookie.
- **Crash Handling**: Penanganan error global untuk aplikasi.
- **Environment Management**: Semua konfigurasi aplikasi dikelola melalui `env.json`.

---

## 📦 Instalasi

### 1. Clone Repository

<pre>
git clone https://github.com/ndiing/micro.git
cd micro
</pre>

### 2. Install Dependensi

<pre>
npm install
</pre>

---

## 📁 Struktur Proyek

<pre>
C:.
│   .gitattributes
│   .gitignore
│   README.md
│   package.json
│   env.json
│
├───data
│       session.json
│       tokopedia.json.gz
│
├───dist
│       index.html
│       index.js
│
├───rest
│       auth.rest
│       user.rest
│
├───src
│   ├───api
│   │   ├───auth
│   │   │       controller.js
│   │   │       handler.js
│   │   │       model.js
│   │   │       service.js
│   │   │       middleware.js
│   │   │       index.js
│   │   ├───user
│   │   │       controller.js
│   │   │       handler.js
│   │   │       model.js
│   │   │       service.js
│   │   │       index.js
│   │   │
│   │   └───index.js (mengumpulkan semua router API)
│   │
│   ├───lib
│   │       base32.js
│   │       cache-map.js
│   │       cookie-store.js
│   │       crash.js
│   │       env.js
│   │       fetch.js
│   │       file.js
│   │       index.js
│   │       jwt.js
│   │       otp.js
│   │       router.js
│   │       store.js
│   │       util.js
│   │       validation.js
│   │       web-socket.js
│
│   └───index.js (server setup utama)
│
└───test
        cache-map.js
        jwt.js
        router.js
</pre>

---

## ⚙️ Penggunaan Dasar

### Membuat Server HTTP & WebSocket

<pre>
require("./lib/crash.js");
require("./lib/env.js");

const http = require("http");
const https = require("https");
const path = require("path");
const Router = require("./lib/router.js");
const WebSocket = require("./lib/web-socket.js");
const { authorization } = require("./api/auth/middleware.js");

if (process.env.NODE_ENV === "development") {
    require("./lib/index.js");
}

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
app.use("/api", require("./src/api/index.js"));
app.use(Router.missing());
app.use(Router.catchAll());

const httpServer = http.createServer();
const httpsServer = https.createServer({});

const socket = new WebSocket();

socket.on("connection", (client) => {
    client.on("open", () => {
        client.send(JSON.stringify({ message: "from server" }));
    });
    client.on("message", console.log);
    client.on("close", console.log);
    client.on("error", console.log);
});

httpServer.on("request", app.request);
httpsServer.on("request", app.request);

httpServer.on("upgrade", socket.upgrade);
httpsServer.on("upgrade", socket.upgrade);

httpServer.listen(process.env.HTTP_PORT, "0.0.0.0", () => {
    console.log(httpServer.address());
});
httpsServer.listen(process.env.HTTPS_PORT, "0.0.0.0", () => {
    console.log(httpsServer.address());
});
</pre>

---

## 📜 Konfigurasi Environment

Semua pengaturan ada di file `env.json` di root project:

Contoh isi:

<pre>
{
    "NODE_ENV": "development",
    "HTTP_PORT": 3000,
    "HTTPS_PORT": 3001,
    "JWT_SECRET": "rahasia-super-aman",
    "DB_HOST": "localhost",
    "DB_PORT": 3306
}
</pre>

---

## 🧪 Testing API

Gunakan file `.rest` untuk development API:  
Tulis file di path:

<pre>
./rest/{module}.rest
</pre>

Contoh isi `auth.rest`:

<pre>
### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "example@example.com",
    "password": "password123"
}
</pre>

---

## 🧑‍💻 Dokumentasi Lainnya

- **Coding Style**: Lihat panduan penulisan kode di [CODING.md](./CODING.md)
- **API Library**: Lihat dokumentasi API library di [API.md](./API.md)

---

## 🤝 Kontribusi

Kami sangat menghargai kontribusi Anda!  
Silahkan buat issue atau pull request di repository ini jika ingin berkontribusi.

---

## 📝 Lisensi

Micro Framework dirilis di bawah lisensi MIT.  
Silahkan lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.
