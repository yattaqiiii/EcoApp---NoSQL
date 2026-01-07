import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

// Import routes
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import wasteLogRoutes from "./routes/wasteLogRoutes.js"
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

// --- ROUTES ---
// Auth routes (public)
app.use("/api/auth", authRoutes)

// User profile routes (private)
app.use("/api/user", userRoutes)

// Scan & waste logs routes (private - user)
app.use("/api/scan", wasteLogRoutes)
app.use("/api/waste-logs", wasteLogRoutes)

// Stats routes (admin)
app.use("/api/stats", statsRoutes)

// Admin routes (admin)
app.use("/api/admin", adminRoutes)

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server Express jalan di http://localhost:${PORT}`)
})

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Backend EcoScan Siap Menerima Data!")
})

// Logging middleware
app.use((req, res, next) => {
  console.log(`📡 TERIMA REQUEST: ${req.method} ${req.url}`)
  console.log("📦 DATA DIKIRIM:", req.body)
  next()
})
