# Micro Framework

Micro Framework adalah framework ringan dan fleksibel yang dirancang untuk pengembangan aplikasi backend menggunakan Node.js. Framework ini memiliki berbagai fitur untuk membantu Anda dalam menangani routing, middleware, pengelolaan file, validasi, autentikasi, dan banyak lagi.

## Fitur Utama

- **Routing**: Memudahkan pengelolaan rute HTTP seperti GET, POST, PUT, dan DELETE.
- **Middleware**: Dukungan penuh untuk middleware seperti CORS, pengolahan JSON, dan rate limiting.
- **Validasi**: Memudahkan validasi dan konversi data input menggunakan skema berbasis tipe data.
- **Pengelolaan File**: Membaca dan menulis file, termasuk kompresi dan deserialisasi JSON.
- **JWT & OTP**: Mendukung pembuatan dan verifikasi JSON Web Tokens (JWT) serta One-Time Password (OTP).
- **WebSocket**: Menyediakan dukungan penuh untuk komunikasi WebSocket.
- **Cookie Store**: Pengelolaan cookie secara otomatis di dalam aplikasi.

## Instalasi

1. **Clone Repositori**

   Anda dapat mengunduh kode sumber framework ini dengan cara meng-clone repositori:

   <pre>
   git clone https://github.com/username/micro-framework.git
   cd micro-framework
   </pre>

2. **Instalasi Dependensi**

   Setelah meng-clone repositori, instal dependensi menggunakan npm:

   <pre>
   npm install
   </pre>

## Struktur Proyek

<pre>
C:.
│   .gitattributes
│   .gitignore
│   README.md
│   package.json
│   ...
├───data
│       session.json
│       tokopedia.json.gz
│
├───dist
│       index.html
│       index.js
│
├───src
│   ├───api
│   │   ├───auth
│   │   │       controller.js
│   │   │       model.js
│   │   └───main
│   │           index.js
│   └───lib
│       ├───base32.js
│       ├───jwt.js
│       └───router.js
└───test
        cache-map.js
        jwt.js
        router.js
</pre>

### Penjelasan Struktur

- **src/api**: Menyimpan kode untuk API, termasuk controller, model, dan schema.
- **src/lib**: Menyimpan utilitas dan modul tambahan seperti pengelolaan JWT, file, dan routing.
- **test**: Berisi pengujian unit untuk berbagai modul framework.

## Penggunaan Dasar

### Membuat Server HTTP

Untuk memulai, Anda hanya perlu mengimpor framework dan membuat server HTTP:

<pre>
const MicroFramework = require("micro-framework");

const app = new MicroFramework();

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});
</pre>

### Menambahkan Middleware

Middleware dapat digunakan untuk berbagai kebutuhan seperti autentikasi, logging, atau validasi. Berikut adalah contoh middleware untuk menangani JSON:

<pre>
app.use((req, res, next) => {
    if (req.headers["content-type"] === "application/json") {
        req.body = JSON.parse(req.body);
    }
    next();
});
</pre>

### Routing

Menambahkan rute baru untuk menangani permintaan HTTP:

<pre>
app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});
</pre>

## Fitur Lainnya

### Pengelolaan File

Framework ini menyediakan cara mudah untuk membaca dan menulis file, termasuk dukungan untuk file JSON dan kompresi.

#### Membaca File JSON

<pre>
const File = require("micro-framework/lib/file");

File.read("./data/session.json").then(data => {
    console.log(data);
});
</pre>

#### Menulis File JSON

<pre>
const data = { session: "active" };

File.write("./data/session.json", data);
</pre>

### Validasi Data

Framework ini menyediakan kelas `Validation` untuk memvalidasi data berdasarkan skema yang Anda tentukan.

<pre>
const Validation = require("micro-framework/lib/validation");

const schema = {
    username: "string",
    age: "number",
};

const result = Validation.validate({ username: "John", age: 25 }, schema);

if (result.errors.length > 0) {
    console.log("Terjadi kesalahan dalam data:", result.errors);
} else {
    console.log("Data valid!");
}
</pre>

### Autentikasi JWT

Framework ini mendukung pembuatan dan verifikasi JSON Web Tokens (JWT):

#### Membuat JWT

<pre>
const JWT = require("micro-framework/lib/jwt");

const payload = { userId: 123 };
const secret = "mysecretkey";

const token = JWT.sign(payload, secret);
console.log("JWT Token:", token);
</pre>

#### Verifikasi JWT

<pre>
const decoded = JWT.verify(token, secret);
console.log("Decoded Payload:", decoded);
</pre>

## Pengujian

Framework ini dilengkapi dengan pengujian unit menggunakan modul yang terdapat di dalam folder `test`. Anda dapat menjalankan pengujian menggunakan Jest atau framework pengujian lainnya.

Untuk menjalankan pengujian, gunakan perintah berikut:

<pre>
npm test
</pre>

## Kontribusi

Kami sangat menghargai kontribusi dari komunitas. Jika Anda memiliki ide atau perbaikan, harap buka issue atau kirimkan pull request ke repositori ini.

## Lisensi

Micro Framework dirilis di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

Jika Anda memiliki pertanyaan atau ingin mempelajari lebih lanjut, silakan buka dokumentasi atau ajukan pertanyaan melalui issue di repositori ini.
