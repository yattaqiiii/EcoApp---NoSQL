import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

// Import Model WasteLog yang sudah kamu buat
import WasteLog from "./models/WasteLog.js"
import User from "./models/User.js"

import statsRoutes from "./routes/statsRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

// Import gamification system
import { calculateXPFromConfidence, calculateLevel, checkNewBadges } from "./utils/gamification.js"

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

// 3. GET USER BY ID - untuk refresh user data
app.get("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }

    // Return user data
    res.json({
      message: "User data fetched successfully",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        total_xp: user.total_xp,
        level: user.level,
        badges: user.badges,
        joinDate: user.joined_at,
      },
    })
  } catch (error) {
    console.error("Get User Error:", error)
    res.status(500).json({ message: "Terjadi kesalahan server" })
  }
})

// 4. UPDATE USER PROFILE - untuk edit name dan email
app.put("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { name, email } = req.body

    // Validasi input
    if (!name || !email) {
      return res.status(400).json({ message: "Nama dan email harus diisi" })
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format email tidak valid" })
    }

    // Cek apakah email sudah digunakan user lain
    const existingUser = await User.findOne({ email, _id: { $ne: userId } })
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan oleh user lain" })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: name,
        email: email,
      },
      { new: true } // Return updated document
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }

    res.json({
      message: "Profile berhasil diperbarui",
      user: {
        id: updatedUser._id,
        name: updatedUser.username,
        email: updatedUser.email,
        total_xp: updatedUser.total_xp,
        level: updatedUser.level,
        badges: updatedUser.badges,
        joinDate: updatedUser.joined_at,
      },
    })
  } catch (error) {
    console.error("Update User Error:", error)
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

    // ========== CALCULATE XP ==========
    const xpEarned = calculateXPFromConfidence(confidence)

    // ========== SAVE WASTE LOG WITH XP ==========
    const newLog = new WasteLog({
      user_id,
      waste_type,
      confidence,
      xp_earned: xpEarned, // Save XP to waste log
      fakultas,
      lokasi_id: lokasi_id || fakultas,
      timestamp: new Date(),
    })

    const savedLog = await newLog.save()

    // ========== UPDATE USER XP & LEVEL ==========
    const user = await User.findById(user_id)

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }

    // Update total XP
    const newTotalXP = user.total_xp + xpEarned
    const newLevel = calculateLevel(newTotalXP)
    const leveledUp = newLevel > user.level

    // ========== CHECK FOR NEW BADGES ==========
    // Get user statistics for badge checking
    const userScans = await WasteLog.countDocuments({ user_id })
    const uniqueWasteTypes = await WasteLog.distinct("waste_type", { user_id })
    const highestConfidenceLog = await WasteLog.findOne({ user_id }).sort({ confidence: -1 })

    // Calculate streak (simplified - count scans in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentScans = await WasteLog.find({
      user_id,
      timestamp: { $gte: thirtyDaysAgo },
    }).sort({ timestamp: 1 })

    // Simple streak calculation (days with at least one scan)
    const scanDates = recentScans.map(log => log.timestamp.toDateString())
    const uniqueDays = [...new Set(scanDates)]
    const streak = uniqueDays.length

    const userStats = {
      totalScans: userScans,
      level: newLevel,
      totalXP: newTotalXP,
      highestConfidence: highestConfidenceLog?.confidence || 0,
      wasteTypesScanned: uniqueWasteTypes.length,
      streak: streak,
    }

    const newBadges = checkNewBadges(userStats, user.badges)

    // Update user with new XP, level, and badges
    await User.findByIdAndUpdate(user_id, {
      total_xp: newTotalXP,
      level: newLevel,
      $addToSet: { badges: { $each: newBadges } }, // Add new badges without duplicates
    })

    // ========== RETURN RESPONSE WITH GAMIFICATION DATA ==========
    res.status(201).json({
      message: "Scan berhasil!",
      data: savedLog,
      gamification: {
        xpEarned,
        newTotalXP,
        newLevel,
        leveledUp,
        newBadges,
        userStats,
      },
    })
  } catch (error) {
    console.error("Error saving scan:", error)
    res.status(500).json({ message: "Gagal menyimpan data", error: error.message })
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
