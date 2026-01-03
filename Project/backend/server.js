import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

// Import Model WasteLog yang sudah kamu buat
import WasteLog from "./models/WasteLog.js"
import User from "./models/User.js"

import statsRoutes from "./routes/statsRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config()
const app = express()

// Middleware
app.use(express.json())
app.use(cors()) // Penting agar Frontend (Port 3000) bisa bicara ke Backend (Port 5000)

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"))

// Connection to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Berhasil terhubung ke MongoDB Atlas"))
  .catch(err => console.error("Gagal koneksi... : ", err))

// --- ROUTING ---
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validasi dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field harus diisi" })
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" })
    }

    // Buat User Baru (XP dan Level otomatis default)
    const newUser = new User({
      username: name, // Mapping 'name' dari frontend ke 'username' di DB
      email,
      password: password, // (Catatan: Di production sebaiknya di-hash pakai bcrypt)
    })

    await newUser.save()

    res.status(201).json({
      message: "Registrasi berhasil",
      user: { email: newUser.email, name: newUser.username },
    })
  } catch (error) {
    console.error("Register Error:", error)
    res.status(500).json({ message: "Terjadi kesalahan server" })
  }
})

// 2. LOGIN USER
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Cari user berdasarkan email
    const user = await User.findOne({ email })

    // Cek user dan password (sederhana)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Email atau password salah" })
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
        joinDate: user.joined_at,
      },
    })
  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({ message: "Terjadi kesalahan server" })
  }
})
app.post("/api/scan", async (req, res) => {
  try {
    // Ambil user_id dari body request
    const { waste_type, confidence, fakultas, lokasi_id, user_id } = req.body

    if (!waste_type || !confidence || !fakultas || !user_id) {
      return res.status(400).json({ message: "Data tidak lengkap (User ID wajib ada)" })
    }

    const newLog = new WasteLog({
      user_id, // Simpan ID pemilik
      waste_type,
      confidence,
      fakultas,
      lokasi_id: lokasi_id || fakultas,
      timestamp: new Date(),
    })

    const savedLog = await newLog.save()

    // [OPSIONAL] Update XP User di sini jika mau
    // await User.findByIdAndUpdate(user_id, { $inc: { total_xp: 10 } });

    res.status(201).json({ message: "Scan berhasil!", data: savedLog })
  } catch (error) {
    console.error("Error saving scan:", error)
    res.status(500).json({ message: "Gagal menyimpan data" })
  }
})

// [BARU] 2. API HISTORY PER USER
app.get("/api/waste-logs", async (req, res) => {
  try {
    const { userId } = req.query // Ambil dari ?userId=...

    if (!userId) {
      return res.status(400).json({ message: "User ID diperlukan" })
    }

    // Cari sampah yang user_id-nya COCOK dengan userId yang diminta
    const logs = await WasteLog.find({ user_id: userId }).sort({ timestamp: -1 }) // Urutkan dari yang terbaru

    res.json({ data: logs })
  } catch (error) {
    console.error("Error fetching logs:", error)
    res.status(500).json({ message: "Gagal mengambil history" })
  }
})

// API endpoint untuk mengambil data statistics
app.use("/api/stats", statsRoutes)

// API endpoint untuk admin dashboard
app.use("/api/admin", adminRoutes)

// app.get('/test', (req, res) => res.send("Server aktif"));

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server Express jalan di http://localhost:${PORT}`)
})

app.get("/", (req, res) => {
  res.send("✅ Backend EcoScan Siap Menerima Data!")
})

app.use((req, res, next) => {
  console.log(`📡 TERIMA REQUEST: ${req.method} ${req.url}`)
  console.log("📦 DATA DIKIRIM:", req.body)
  next()
})
