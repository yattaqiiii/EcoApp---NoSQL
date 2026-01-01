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


# 📊 Referensi Skema Data (MongoDB)

Dokumen ini berisi patokan field data yang digunakan dalam database MongoDB Atlas untuk proyek EcoScan. Seluruh anggota tim diharapkan mengikuti struktur ini agar integrasi antar komponen lancar.

---

## 1. Collection: `waste_logs`
Menyimpan riwayat setiap kali user melakukan pemindaian sampah.

| Field | Tipe Data | Deskripsi | Sumber |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | ID unik dokumen (otomatis dari MongoDB) | System |
|`user_id`| ObjectId | Referensi ke ID pengguna di collections | Collection `users`|
| `waste_type` | String | Jenis sampah (contoh: "Plastik", "Organik") | Hasil Klasifikasi AI |
| `confidence` | Number | Skor akurasi model (0.0 - 1.0) | Hasil Klasifikasi AI |
| `fakultas` | String | Kode fakultas (contoh: "FPTI", "FIP") | `locationConfig.js` |
| `lokasi_id` | String | ID area spesifik (contoh: "FPTI_COE") | `locationConfig.js` |
| `timestamp` | Date | Waktu data disimpan | System (Default: Now) |

**Contoh Dokumen JSON:**
```json
{
  "waste_type": "Plastik",
  "confidence": 0.98,
  "fakultas": "FPTI",
  "lokasi_id": "FPTI_COE",
  "timestamp": "2024-12-29T10:00:00Z"
}
```
## 2. Collection: `users`
Menyimpan profil pengguna dan progres XP mereka

| Field     | Tipe Data | Deskripsi         |
|`username` | String    | Nama Unik Pengguna|
|`total_xp` | Number    | Akumulasi XP dari aktivitas scan|
|`badges`   | array     | daftar lencana yang didapat|

## Struktur output statistics (Aggregation)
{
  "categories": [
    { "_id": "Plastik", "count": 15 },
    { "_id": "Organik", "count": 8 }
  ],
  "trends": [
    { "_id": "2024-12-28", "total": 5 },
    { "_id": "2024-12-29", "total": 12 }
  ]
}