# API Automatic Fallback

Aplikasi ini sekarang menggunakan sistem **automatic fallback** untuk API backend.

## 🔄 Cara Kerja

1. **Primary URL** (dari `.env.local`): Coba akses dulu URL yang di-forward
2. **Fallback URL**: Jika gagal, otomatis fallback ke `http://localhost:5000`
3. **Auto-switch**: Setelah berhasil, URL aktif akan di-cache untuk request berikutnya

## ⚙️ Konfigurasi

Edit [.env.local](Project/frontend/.env.local):

```env
# URL backend yang di-forward (primary)
NEXT_PUBLIC_API_URL=https://cc03vhsr-5000.asse.devtunnels.ms

# Jika tidak diset atau gagal, akan otomatis pakai localhost:5000
```

## 📖 Penggunaan

### Untuk API Calls:

```javascript
import { apiFetch } from "@/lib/api";

// Otomatis try primary URL, fallback ke localhost
const response = await apiFetch("/api/admin/bins");
```

### Untuk Image URLs:

```javascript
import { getActiveApiUrl } from "@/lib/api";

// Gunakan URL yang sedang aktif
<img src={`${getActiveApiUrl()}${image_path}`} />;
```

## ✅ Keuntungan

- ✅ **Zero downtime**: Kalau forwarded URL mati, langsung pakai localhost
- ✅ **No manual switch**: Otomatis detect URL yang berfungsi
- ✅ **Development friendly**: Bisa develop tanpa perlu setup tunneling
- ✅ **Production ready**: Tinggal set environment variable saja

## 🔍 Monitoring

Cek console browser untuk melihat API yang sedang dipakai:

- `🔄 Trying API: ...` - Sedang mencoba koneksi
- `✅ API connected: ...` - Berhasil connect
- `⚠️ API failed: ...` - Gagal connect, trying fallback
