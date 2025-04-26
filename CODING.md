# 📚 Coding Style Guide - Micro Framework

Dokumen ini mendefinisikan aturan dan standar penulisan kode untuk pengembangan di dalam framework **Micro**.  
Standar ini mengacu pada: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).

> 🎯 **Tujuan:** Membuat kode lebih konsisten, mudah dibaca, dan mudah untuk dikembangkan bersama.

---

## 1. Dasar Umum

- Mengacu pada [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).
- Penyesuaian tambahan akan dijelaskan di dokumen ini.

## 2. Format Penulisan

- **Indentasi:** 2 spasi (bukan tab).
- **Maksimal panjang baris:** 80 karakter.
- **Line ending:** Unix (`\n`).

## 3. Struktur Penulisan Kode

- **Variabel dan Fungsi:** `camelCase`
- **Class dan Komponen:** `PascalCase`
- **Konstanta Global:** `UPPER_SNAKE_CASE`

## 4. Penulisan Import

- **Import eksternal** diletakkan di atas.
- **Import internal** diletakkan di bawah dengan satu baris kosong sebagai pemisah.

Contoh:
<pre>
import { useState } from 'react';

import { MyComponent } from './components/MyComponent.js';
</pre>

## 5. Penulisan Komentar

- Gunakan format **JSDoc** untuk dokumentasi fungsi, method, dan class.
- Komentar harus **informatif**, bukan mengulangi isi kode.

Contoh:
<pre>
/**
 * Menghitung jumlah total harga.
 * @param {number[]} prices - Daftar harga.
 * @return {number} Total harga.
 */
function calculateTotal(prices) {
  return prices.reduce((sum, price) => sum + price, 0);
}
</pre>

## 6. Struktur Proyek (HMVC Pattern)

Struktur direktori proyek menggunakan pola **HMVC (Hierarchical Model View Controller)**.

Contoh struktur direktori:
<pre>
/src/api/{module}
  ├── index.js        // Router: mendefinisikan endpoint HTTP
  ├── model.js        // Model: berinteraksi dengan database
  ├── controller.js   // Controller: mengatur request dan response
  ├── service.js      // Service: komunikasi ke pihak ketiga
  └── handler.js      // Handler: business logic utama
</pre>

### Penjelasan File

| File            | Deskripsi                                                                 |
|-----------------|----------------------------------------------------------------------------|
| `index.js`       | Menyusun routing dan mengarahkan request ke `controller`.                  |
| `model.js`       | Mendefinisikan skema database, query, atau operasi CRUD ke database.       |
| `controller.js`  | Menerima request, memanggil `handler`, dan mengembalikan response.         |
| `service.js`     | Berfungsi sebagai penghubung ke layanan eksternal (API, third-party, dsb). |
| `handler.js`     | Menampung business logic utama untuk modul tersebut.                      |

---

## 7. Pengaturan (Configuration)

- Semua pengaturan, konfigurasi, atau variabel lingkungan wajib disimpan di file `env.json` yang berada di **root project**.
- Tidak diperbolehkan hardcode konfigurasi di dalam source code.

Contoh struktur `env.json`:
<pre>
{
  "APP_NAME": "MicroFramework",
  "APP_PORT": 3000,
  "DB_HOST": "localhost",
  "DB_USER": "root",
  "DB_PASSWORD": "password",
  "THIRD_PARTY_API_KEY": "your-api-key-here"
}
</pre>

### Catatan:

- Saat memerlukan konfigurasi, **selalu load dari `env.json`**, bukan dari nilai tetap di dalam kode.
- Jika butuh struktur lebih kompleks, boleh menggunakan nested object di `env.json`.

---

## 8. Dokumentasi API (File REST)

- Setiap modul API wajib memiliki file contoh request REST.
- File diletakkan di folder `./rest/{module}.rest`.
- Format file menggunakan standar request yang dikenali oleh REST Client (contoh: extension di VSCode seperti "REST Client").

Contoh file `./rest/user.rest`:
<pre>
### Get List Users
GET http://localhost:3000/api/user

### Get Detail User
GET http://localhost:3000/api/user/1

### Create New User
POST http://localhost:3000/api/user
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

### Update User
PUT http://localhost:3000/api/user/1
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}

### Delete User
DELETE http://localhost:3000/api/user/1
</pre>

### Catatan:

- Satu file `.rest` per modul.
- File ini digunakan untuk testing manual API menggunakan tools seperti **REST Client** (VSCode) atau **Insomnia**/**Postman**.

---

## 9. Library Bawaan

Terdapat library built-in di folder `./lib/` yang dapat digunakan di seluruh project.

Struktur `./lib/`:
<pre>
/lib/base32.js        // Encode/decode base32
/lib/cache-map.js     // Utility untuk caching berbasis Map
/lib/cookie-store.js  // Manajemen cookie
/lib/crash.js         // Penanganan crash/error
/lib/env.js           // Load konfigurasi dari env.json
/lib/fetch.js         // HTTP fetch wrapper
/lib/file.js          // Utility untuk file system
/lib/index.js         // Entry point semua utilitas lib
/lib/jwt.js           // JSON Web Token handler
/lib/otp.js           // OTP (One Time Password) generator dan verifier
/lib/router.js        // Routing HTTP
/lib/store.js         // Simple storage layer
/lib/util.js          // Utility functions umum
/lib/validation.js    // Validator data/form
/lib/web-socket.js    // WebSocket handler
</pre>

### Catatan:

- Gunakan library bawaan sebelum menambah library eksternal.
- Jika ada kebutuhan tambahan, pastikan library eksternal **disetujui bersama** sebelum integrasi.

---

# 📌 Catatan

- Setiap modul harus **independen** dan **mudah untuk dikembangkan atau diubah**.
- Dokumentasi ini **akan terus diperbarui** sesuai kebutuhan dan perkembangan framework **Micro**.

---
