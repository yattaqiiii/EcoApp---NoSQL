# 🌱 EcoScan - AI-Powered Waste Classification

Aplikasi web untuk mengidentifikasi dan mengklasifikasikan jenis sampah menggunakan AI (TensorFlow.js + Teachable Machine).

## 📋 Fitur

- ✅ **Scan Sampah dengan AI**: Upload atau ambil foto sampah untuk identifikasi otomatis
- ✅ **5 Kategori Sampah**: Organik, Non Organik Daur Ulang, Botol Plastik, Kertas, Residu
- ✅ **Panduan Pembuangan**: Informasi lengkap cara membuang sampah dengan benar
- ✅ **Detail Prediksi**: Tampilan confidence score dan breakdown semua kategori
- ✅ **Responsive Design**: Tampilan optimal di desktop dan mobile

## � Struktur Project

```
EcoScanFPMIPA/
├── Project/              # React + Vite Web Application
│   ├── src/
│   │   ├── pages/        # Home, Scan, Result, About, Welcome
│   │   ├── components/   # Navbar
│   │   ├── utils/        # Model AI utilities
│   │   └── assets/       # Images, icons
│   ├── public/           # Static files & AI model
│   └── package.json
├── GETTING_STARTED.md    # 📖 Panduan lengkap setup dari awal
└── README.md             # File ini
```

## 🚀 Quick Start

```bash
cd Project
npm install
npm run dev
```

Buka browser ke http://localhost:5173

> 📖 **Panduan Lengkap**: Lihat [GETTING_STARTED.md](GETTING_STARTED.md) untuk setup detail dari awal sampai selesai

## ⚙️ Setup Model AI

**PENTING**: File `model_unquant.tflite` tidak bisa digunakan di browser. Export model dalam format **TensorFlow.js**.

### Opsi 1: Cloud URL (Recommended)

1. Buka Teachable Machine project
2. Export Model → Upload (Shareable Link)
3. Copy URL
4. Edit `Project/src/utils/modelUtils.js`:
   ```javascript
   const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/YOUR_ID/';
   ```

### Opsi 2: Local Download

1. Export Model → TensorFlow.js → Download
2. Extract dan copy file ke `Project/public/model/`
3. Update `MODEL_URL = '/model/'`

## 🧪 Testing

1. Buka http://localhost:5173
2. Klik "Scan" → Upload foto sampah
3. Klik "Scan Sekarang"
4. Lihat hasil dan panduan pembuangan

## 📊 Kategori Sampah

| Kategori                  | Deskripsi                    | Warna   |
| ------------------------- | ---------------------------- | ------- |
| 🌿 Organik                | Sampah yang dapat terurai    | Hijau   |
| ♻️ Non Organik Daur Ulang | Sampah yang dapat di-recycle | Biru    |
| 🍾 Botol Plastik          | Botol plastik khusus         | Orange  |
| 📄 Kertas                 | Kertas dan karton            | Coklat  |
| 🗑️ Residu                 | Sampah non-recyclable        | Abu-abu |

## 🔧 Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM v7
- **AI/ML**: TensorFlow.js + Teachable Machine
- **Styling**: CSS Modules

## ✅ Status

**Sudah Selesai:**
- ✅ Frontend UI lengkap (5 pages)
- ✅ TensorFlow.js integration
- ✅ Image preprocessing & prediction
- ✅ Error handling

**Yang Perlu Dilakukan:**
- ⚠️ Export model dari Teachable Machine (format TensorFlow.js)
- ⚠️ Update `MODEL_URL` di `modelUtils.js`
- ⚠️ Test dengan real model

## 👥 Team

Developed with ❤️ by EcoScan Team
