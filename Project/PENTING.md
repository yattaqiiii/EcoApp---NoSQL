# 🌿 Panduan Pengembangan EcoScan (Frontend & Backend)

Dokumen ini adalah panduan bagi anggota tim untuk menjalankan proyek EcoScan di komputer lokal.

---

## 🛠️ Persiapan Awal
Pastikan Anda sudah menginstal:
* **Node.js** (Versi 18 atau lebih baru)
* **NPM** (Bawaan dari Node.js)
* **MongoDB Atlas** (Pastikan IP sudah di-whitelist)

---

## 🟢 1. Setup Backend (Server & Database)
Bagian ini wajib dijalankan agar data scan sampah bisa disimpan ke MongoDB.

1. **Instalasi Dependensi**:
   Buka terminal di root folder (`/Project`) dan jalankan:
   ```bash
   npm install express mongoose dotenv cors
    ```
2. **Konfigurasi Environment (.env)**: Buat file baru bernama .env di folder root (sejajar dengan package.json). Isi dengan:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/EcoApp?retryWrites=true&w=majority
PORT=5000

```
(Minta kredensial username/password ke Database Specialist)
```

3. **Menjalankan Backend**: Jalankan perintah berikut di terminal:
Bash
```
npm run server
```
Jika berhasil, akan muncul: "Berhasil terhubung ke MongoDB Atlas"