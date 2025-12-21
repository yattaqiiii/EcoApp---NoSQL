# 🚀 Getting Started - EcoScan

Panduan lengkap untuk menjalankan EcoScan dari awal sampai selesai.

## 📋 Prerequisites

Pastikan sudah terinstall:
- **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
- **npm** (otomatis terinstall dengan Node.js)
- **Git** (optional, untuk clone repository)
- **Text Editor** (VS Code recommended)

Cek versi:
```bash
node --version
npm --version
```

---

## 🔧 Step 1: Download / Clone Project

### Opsi A: Clone dengan Git
```bash
git clone https://github.com/Rasendriya-A/EcoScanFPMIPA.git
cd EcoScanFPMIPA
```

### Opsi B: Download ZIP
1. Download ZIP dari GitHub
2. Extract file
3. Buka folder di terminal/command prompt

---

## 📦 Step 2: Install Dependencies

```bash
cd Project
npm install
```

Proses ini akan menginstall semua package yang diperlukan:
- React 19
- Vite
- React Router DOM
- TensorFlow.js
- dll.

**Tunggu sampai selesai** (biasanya 1-3 menit).

---

## 🤖 Step 3: Setup Model AI

**PENTING**: File `model_unquant.tflite` yang ada di project **TIDAK BISA** digunakan di browser web. Anda perlu export model dalam format **TensorFlow.js**.

### Metode 1: Cloud URL (PALING MUDAH ⭐ RECOMMENDED)

1. **Buka Teachable Machine Project**
   - Pergi ke https://teachablemachine.withgoogle.com/
   - Buka project model yang sudah di-train

2. **Export Model**
   - Klik tombol **"Export Model"**
   - Pilih tab **"Upload (Shareable Link)"**
   - Klik **"Upload my model"**
   - Tunggu upload selesai
   - **Copy URL** yang muncul (contoh: `https://teachablemachine.withgoogle.com/models/abc123xyz/`)

3. **Update Kode**
   
   Buka file `Project/src/utils/modelUtils.js` dan cari baris ini (sekitar baris 18):
   
   ```javascript
   const MODEL_URL = 'YOUR_MODEL_URL_HERE';
   ```
   
   Ganti dengan URL yang tadi di-copy:
   
   ```javascript
   const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/abc123xyz/';
   ```
   
   **Save file**.

4. **Done!** Model akan otomatis di-load dari cloud saat aplikasi berjalan.

---

### Metode 2: Download Model Lokal (Untuk Production)

1. **Export Model**
   - Di Teachable Machine, klik **"Export Model"**
   - Pilih tab **"TensorFlow.js"**
   - Klik **"Download my model"**
   - Extract file .zip hasil download

2. **Copy File Model**
   
   Dari hasil extract, Anda akan mendapat:
   - `model.json`
   - `weights.bin` (atau `group1-shard1of1.bin`)
   - `metadata.json`
   
   Copy **SEMUA file** tersebut ke folder:
   ```
   Project/public/model/
   ```
   
   Buat folder `model` jika belum ada:
   ```bash
   mkdir Project/public/model
   ```

3. **Update Kode**
   
   Buka `Project/src/utils/modelUtils.js` dan ubah:
   
   ```javascript
   const MODEL_URL = '/model/';
   ```

4. **Done!** Model akan di-load dari local files.

---

## ▶️ Step 4: Jalankan Development Server

Dari folder `Project`, jalankan:

```bash
npm run dev
```

Anda akan melihat output seperti:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Buka browser** dan pergi ke http://localhost:5173

---

## ✅ Step 5: Test Aplikasi

1. **Welcome Page**
   - Halaman pertama akan muncul
   - Klik "Mulai Sekarang"

2. **Home Page**
   - Lihat informasi tentang EcoScan
   - Navigate menggunakan navbar

3. **Scan Page** (Testing AI)
   - Klik menu "Scan" di navbar
   - Upload foto sampah atau ambil foto dengan camera
   - Klik **"Scan Sekarang"**
   - Tunggu AI memproses gambar
   
4. **Result Page**
   - Lihat kategori sampah yang terdeteksi
   - Lihat confidence score
   - Baca panduan pembuangan
   - Lihat detail semua prediksi

5. **About Page**
   - Informasi tentang tim dan project

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@tensorflow/tfjs'"

**Solusi:**
```bash
cd Project
npm install @tensorflow/tfjs
```

### Error: "Model failed to load"

**Penyebab & Solusi:**

1. **URL salah**
   - Pastikan URL di `modelUtils.js` benar
   - URL harus diakhiri dengan `/` (slash)
   - Contoh: `https://teachablemachine.withgoogle.com/models/abc123/`

2. **File model tidak ada**
   - Jika pakai metode lokal, pastikan file ada di `Project/public/model/`
   - Cek file: `model.json`, `weights.bin`, `metadata.json`

3. **CORS Issue**
   - Jika pakai cloud URL, pastikan model sudah di-upload (shareable link)
   - Model harus public, tidak bisa private

### Error: Port 5173 sudah digunakan

**Solusi:**
1. Tutup aplikasi lain yang menggunakan port 5173
2. Atau, edit `vite.config.js` untuk ganti port:
   ```javascript
   export default defineConfig({
     server: {
       port: 3000  // ganti ke port lain
     }
   })
   ```

### npm install gagal

**Solusi:**
```bash
# Hapus folder node_modules dan file lock
rm -rf node_modules package-lock.json

# Install ulang
npm install

# Atau gunakan npm cache clean
npm cache clean --force
npm install
```

---

## 📝 Catatan Penting

### Model Requirements

Model Teachable Machine harus memiliki **5 classes** dengan nama:
1. `Organik`
2. `Non Organik Daur Ulang`
3. `Botol Plastik`
4. `Kertas`
5. `Residu`

Jika nama class berbeda, edit mapping di `Project/src/utils/modelUtils.js` fungsi `getWasteInfo()`.

### Development vs Production

**Development** (npm run dev):
- Hot reload otomatis
- Debug mode aktif
- Lebih lambat

**Production** (build):
```bash
npm run build
npm run preview
```
- Optimized & minified
- Lebih cepat
- Siap deploy

---

## 🌐 Deploy ke Production

### Build Project
```bash
cd Project
npm run build
```

Hasil build ada di folder `Project/dist/`

### Deploy Options

1. **Vercel** (Recommended - Gratis)
   - Push code ke GitHub
   - Connect Vercel ke repository
   - Auto-deploy setiap push

2. **Netlify**
   - Drag & drop folder `dist/`
   - Atau connect ke GitHub

3. **GitHub Pages**
   ```bash
   npm install gh-pages --save-dev
   npm run build
   npx gh-pages -d dist
   ```

---

## 📚 Next Steps

Setelah aplikasi berjalan, Anda bisa:

1. **Improve Model**
   - Train dengan lebih banyak data
   - Improve accuracy
   - Tambah kategori baru

2. **Add Features**
   - User authentication
   - Scan history
   - Statistics dashboard
   - Share results

3. **Styling**
   - Customize colors
   - Add animations
   - Improve UX

---

## 🆘 Butuh Bantuan?

Jika masih ada masalah:
1. Baca error message dengan teliti
2. Cek console browser (F12)
3. Pastikan semua steps sudah diikuti
4. Contact team EcoScan

---

**Happy Coding! 🎉**

Developed with ❤️ by EcoScan Team
