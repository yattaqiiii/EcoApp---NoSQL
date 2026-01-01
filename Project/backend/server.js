import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// Import Model WasteLog yang sudah kamu buat
import WasteLog from './models/WasteLog.js'; 
import User from './models/User.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Penting agar Frontend (Port 3000) bisa bicara ke Backend (Port 5000)

// Connection to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB Atlas'))
    .catch((err) => console.error('Gagal koneksi... : ', err));

// --- ROUTING ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi dasar
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        // Buat User Baru (XP dan Level otomatis default)
        const newUser = new User({
            username: name, // Mapping 'name' dari frontend ke 'username' di DB
            email,
            password: password // (Catatan: Di production sebaiknya di-hash pakai bcrypt)
        });

        await newUser.save();

        res.status(201).json({ 
            message: "Registrasi berhasil", 
            user: { email: newUser.email, name: newUser.username } 
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// 2. LOGIN USER
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ email });

        // Cek user dan password (sederhana)
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        // Login Sukses -> Kirim data user ke frontend
        res.json({
            message: "Login berhasil",
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                total_xp: user.total_xp,
                level: user.level,
                joinDate: user.joined_at
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});
// API Endpoint untuk menyimpan hasil scan
app.post('/api/scan', async (req, res) => {
    try {
        // Ambil data yang dikirim dari frontend
        const { waste_type, confidence, fakultas, lokasi_id } = req.body;

        // Validasi sederhana
        if (!waste_type || !confidence || !fakultas) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        // Buat data baru menggunakan Model Mongoose
        const newLog = new WasteLog({
            waste_type,
            confidence,
            fakultas,
            lokasi_id: lokasi_id || fakultas, // Gunakan fakultas jika lokasi_id kosong
            timestamp: new Date()
        });

        // Simpan ke MongoDB Atlas
        const savedLog = await newLog.save();

        res.status(201).json({
            message: "Scan berhasil disimpan!",
            data: savedLog
        });
    } catch (error) {
        console.error("Error saving scan:", error);
        res.status(500).json({ message: "Gagal menyimpan data", error: error.message });
    }
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Express jalan di http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('✅ Backend EcoScan Siap Menerima Data!');
});

app.use((req, res, next) => {
    console.log(`📡 TERIMA REQUEST: ${req.method} ${req.url}`);
    console.log("📦 DATA DIKIRIM:", req.body);
    next();
});