import express from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import User from "../models/User.js"
import WasteLog from "../models/WasteLog.js"
import Bin from "../models/Bin.js"

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Multer configuration for bin images
const binStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/bins"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "bin-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const uploadBinImage = multer({
  storage: binStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only image files are allowed!"))
  },
})

// ========== USER MANAGEMENT ==========

// GET all users with search
router.get("/users", async (req, res) => {
  try {
    const { search } = req.query

    let query = {}
    if (search) {
      query = {
        $or: [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      }
    }

    const users = await User.find(query).sort({ joined_at: -1 })

    res.json({
      success: true,
      data: users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create new user
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body)

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update user
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// ========== WASTE LOG MANAGEMENT ==========

// GET all waste logs with filters
router.get("/waste-logs", async (req, res) => {
  try {
    const { search, waste_type, fakultas, user_id } = req.query

    let query = {}

    // Search filter
    if (search) {
      query.$or = [{ waste_type: { $regex: search, $options: "i" } }, { fakultas: { $regex: search, $options: "i" } }, { lokasi_id: { $regex: search, $options: "i" } }]
    }

    // Waste type filter
    if (waste_type) {
      query.waste_type = waste_type
    }

    // Fakultas filter
    if (fakultas) {
      query.fakultas = fakultas
    }

    // User filter
    if (user_id) {
      query.user_id = user_id
    }

    const wasteLogs = await WasteLog.find(query).sort({ timestamp: -1 })

    res.json({
      success: true,
      data: wasteLogs,
      count: wasteLogs.length,
    })
  } catch (error) {
    console.error("Error fetching waste logs:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single waste log by ID
router.get("/waste-logs/:id", async (req, res) => {
  try {
    const wasteLog = await WasteLog.findById(req.params.id)

    if (!wasteLog) {
      return res.status(404).json({ success: false, error: "Waste log not found" })
    }

    res.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error fetching waste log:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create new waste log
router.post("/waste-logs", async (req, res) => {
  try {
    const body = req.body

    // Calculate XP based on confidence if not provided
    if (!body.xp_earned) {
      body.xp_earned = Math.round(body.confidence * 10)
    }

    const wasteLog = await WasteLog.create(body)

    res.status(201).json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error creating waste log:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update waste log
router.put("/waste-logs/:id", async (req, res) => {
  try {
    const body = req.body

    // Recalculate XP if confidence changed
    if (body.confidence && !body.xp_earned) {
      body.xp_earned = Math.round(body.confidence * 10)
    }

    const wasteLog = await WasteLog.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })

    if (!wasteLog) {
      return res.status(404).json({ success: false, error: "Waste log not found" })
    }

    res.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error updating waste log:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE waste log
router.delete("/waste-logs/:id", async (req, res) => {
  try {
    const wasteLog = await WasteLog.findByIdAndDelete(req.params.id)

    if (!wasteLog) {
      return res.status(404).json({ success: false, error: "Waste log not found" })
    }

    res.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error deleting waste log:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// ========== DASHBOARD STATS ==========

// GET dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    // Get counts
    const totalScans = await WasteLog.countDocuments()
    const totalUsers = await User.countDocuments()

    // Get total XP
    const xpResult = await User.aggregate([
      {
        $group: {
          _id: null,
          totalXP: { $sum: "$total_xp" },
        },
      },
    ])
    const totalXP = xpResult.length > 0 ? xpResult[0].totalXP : 0

    // Get average level
    const avgLevelResult = await User.aggregate([
      {
        $group: {
          _id: null,
          avgLevel: { $avg: "$level" },
        },
      },
    ])
    const avgLevel = avgLevelResult.length > 0 ? avgLevelResult[0].avgLevel : 0

    // Get waste type distribution
    const wasteTypeDistribution = await WasteLog.aggregate([
      {
        $group: {
          _id: "$waste_type",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get recent activities (last 10 logs with user info)
    const recentLogs = await WasteLog.find().sort({ timestamp: -1 }).limit(10)

    // Get user info for recent logs
    const userIds = [...new Set(recentLogs.map(log => log.user_id))]
    const users = await User.find({ _id: { $in: userIds } })
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]))

    const recentActivities = recentLogs.map(log => ({
      ...log.toObject(),
      username: userMap[log.user_id]?.username || "Unknown User",
    }))

    res.json({
      success: true,
      data: {
        stats: {
          totalScans,
          totalUsers,
          totalXP,
          avgLevel,
        },
        wasteTypeDistribution,
        recentActivities,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// ========== BIN MANAGEMENT ==========

// GET all bins with filters
router.get("/bins", async (req, res) => {
  try {
    const { search, fakultas, jenis, status } = req.query

    let query = {}

    // Search filter
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { lokasi: { $regex: search, $options: "i" } }]
    }

    // Fakultas filter
    if (fakultas) {
      query.fakultas = fakultas
    }

    // Jenis filter
    if (jenis) {
      query.jenis = jenis
    }

    // Status filter
    if (status) {
      query.status = status
    }

    const bins = await Bin.find(query).sort({ created_at: -1 })

    res.json({
      success: true,
      data: bins,
      count: bins.length,
    })
  } catch (error) {
    console.error("Error fetching bins:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single bin by ID
router.get("/bins/:id", async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id)

    if (!bin) {
      return res.status(404).json({ success: false, error: "Bin not found" })
    }

    res.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error fetching bin:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create new bin
router.post("/bins", uploadBinImage.single("image"), async (req, res) => {
  try {
    const binData = req.body

    // If file uploaded, set image_url to the uploaded file path
    if (req.file) {
      binData.image_url = `/uploads/bins/${req.file.filename}`
    }

    const bin = await Bin.create(binData)

    res.status(201).json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error creating bin:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update bin
router.put("/bins/:id", uploadBinImage.single("image"), async (req, res) => {
  try {
    const binData = req.body

    // If file uploaded, set image_url to the uploaded file path
    if (req.file) {
      binData.image_url = `/uploads/bins/${req.file.filename}`
    }

    const bin = await Bin.findByIdAndUpdate(req.params.id, binData, { new: true, runValidators: true })

    if (!bin) {
      return res.status(404).json({ success: false, error: "Bin not found" })
    }

    res.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error updating bin:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE bin
router.delete("/bins/:id", async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id)

    if (!bin) {
      return res.status(404).json({ success: false, error: "Bin not found" })
    }

    res.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error deleting bin:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
