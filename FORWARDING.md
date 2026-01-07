# 🚀 Port Forwarding Guide

## Ports yang Harus Di-Forward:

| Service  | Port | Status |
| -------- | ---- | ------ |
| Backend  | 5000 | ✅     |
| Frontend | 3000 | ✅     |

---

## Cara Forward (VS Code):

### 1. Buka Tab PORTS

- Panel bawah VS Code (sebelah Terminal)
- Atau tekan: `Ctrl + Shift + P` → ketik "Ports: Focus on Ports View"

### 2. Forward Port 5000 (Backend)

1. Klik tombol **"+ Forward a Port"**
2. Ketik: `5000` → Enter
3. Klik kanan port 5000 → **Port Visibility** → **Public**
4. Copy URL yang muncul (contoh: `https://xxxxx-5000.asse.devtunnels.ms`)

### 3. Forward Port 3000 (Frontend)

1. Klik tombol **"+ Forward a Port"**
2. Ketik: `3000` → Enter
3. Klik kanan port 3000 → **Port Visibility** → **Public**
4. Copy URL yang muncul (contoh: `https://xxxxx-3000.asse.devtunnels.ms`)

### 4. Update .env.local

```env
NEXT_PUBLIC_API_URL=https://xxxxx-5000.asse.devtunnels.ms
```

(Ganti `xxxxx-5000` dengan URL backend Anda)

### 5. Restart Frontend

```bash
cd Project/frontend
npm run dev
```

---

## Akses Aplikasi:

**Dari Device Lain:**

- Buka: `https://xxxxx-3000.asse.devtunnels.ms`

**Dari Localhost:**

- Buka: `http://localhost:3000`

---

## ✅ Checklist:

- [ ] Backend running di port 5000
- [ ] Frontend running di port 3000
- [ ] Port 5000 di-forward dengan visibility **Public**
- [ ] Port 3000 di-forward dengan visibility **Public**
- [ ] File `.env.local` diupdate dengan URL backend
- [ ] Frontend sudah di-restart
