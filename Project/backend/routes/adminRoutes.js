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

    // Normalize waste_type untuk handle label yang terpotong
    if (body.waste_type && body.waste_type.includes('Botol Plasti')) {
      body.waste_type = 'Botol Plastik'
    }

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

// GET dashboard statistics with time filter
router.get("/stats", async (req, res) => {
  try {
    const { timeFilter } = req.query // 'today', 'week', 'month', 'all'

    // Calculate date range based on filter
    let dateFilter = {}
    const now = new Date()

    if (timeFilter === "today") {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      dateFilter = { timestamp: { $gte: startOfDay } }
    } else if (timeFilter === "week") {
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - 7)
      dateFilter = { timestamp: { $gte: startOfWeek } }
    } else if (timeFilter === "month") {
      const startOfMonth = new Date()
      startOfMonth.setDate(startOfMonth.getDate() - 30)
      dateFilter = { timestamp: { $gte: startOfMonth } }
    }
    // 'all' or no filter = no date restriction

    // Get counts with date filter
    const totalScans = await WasteLog.countDocuments(dateFilter)
    const totalUsers = await User.countDocuments()

    // Get total XP using manual aggregation
    const xpResult = await User.aggregate([
      {
        $group: {
          _id: null,
          totalXP: { $sum: "$total_xp" },
        },
      },
    ])
    const totalXP = xpResult.length > 0 ? xpResult[0].totalXP : 0

    // Get average level using manual aggregation
    const avgLevelResult = await User.aggregate([
      {
        $group: {
          _id: null,
          avgLevel: { $avg: "$level" },
        },
      },
    ])
    const avgLevel = avgLevelResult.length > 0 ? avgLevelResult[0].avgLevel : 0

    // Get waste type distribution using manual aggregation with date filter
    const wasteTypeDistribution = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
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

    // Get fakultas distribution using manual aggregation with date filter
    const fakultasDistribution = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      {
        $group: {
          _id: "$fakultas",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get daily scans for the last 7 days using manual aggregation
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)

    const dailyScans = await WasteLog.aggregate([
      {
        $match: {
          timestamp: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get top users by total XP using manual aggregation
    const topUsers = await User.aggregate([
      {
        $sort: { total_xp: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          username: 1,
          total_xp: 1,
          level: 1,
          _id: 0,
        },
      },
    ])

    // Get average confidence score using manual aggregation with date filter
    const avgConfidenceResult = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$confidence" },
        },
      },
    ])
    const avgConfidence = avgConfidenceResult.length > 0 ? avgConfidenceResult[0].avgConfidence : 0

    // Get scans by hour (24-hour distribution) using manual aggregation
    const scansByHour = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get recent activities (last 10 logs with user info)
    const recentLogs = await WasteLog.find(dateFilter).sort({ timestamp: -1 }).limit(10)

    // Get user info for recent logs
    const userIds = [...new Set(recentLogs.map(log => log.user_id))]
    const users = await User.find({ _id: { $in: userIds } })
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]))

    const recentActivities = recentLogs.map(log => ({
      ...log.toObject(),
      username: userMap[log.user_id]?.username || "Unknown User",
    }))

    // ========== BIN DISTRIBUTION ANALYTICS ==========

    // Get total bins count
    const totalBins = await Bin.countDocuments()

    // Get bin locations by faculty using manual aggregation
    const binsByFakultas = await Bin.aggregate([
      {
        $group: {
          _id: "$fakultas",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get bin types distribution (unwind bins array and count each type)
    const binTypesDistribution = await Bin.aggregate([
      {
        $unwind: "$bins",
      },
      {
        $group: {
          _id: "$bins",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get bin types per faculty (fakultas vs bin types matrix)
    const binTypesPerFakultas = await Bin.aggregate([
      {
        $unwind: "$bins",
      },
      {
        $group: {
          _id: {
            fakultas: "$fakultas",
            binType: "$bins",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.fakultas",
          binTypes: {
            $push: {
              type: "$_id.binType",
              count: "$count",
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    res.json({
      success: true,
      data: {
        stats: {
          totalScans,
          totalUsers,
          totalXP,
          avgLevel,
          avgConfidence,
          totalBins,
        },
        wasteTypeDistribution,
        fakultasDistribution,
        dailyScans,
        topUsers,
        scansByHour,
        recentActivities,
        binsByFakultas,
        binTypesDistribution,
        binTypesPerFakultas,
        timeFilter: timeFilter || "all",
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
    const { search, fakultas } = req.query

    let query = {}

    // Search filter
    if (search) {
      query.$or = [{ value: { $regex: search, $options: "i" } }, { label: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Fakultas filter
    if (fakultas) {
      query.fakultas = fakultas
    }

    const bins = await Bin.find(query).sort({ createdAt: -1 })

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

// GET bin by value (location ID)
router.get("/bins/by-value/:value", async (req, res) => {
  try {
    const bin = await Bin.findOne({ value: req.params.value })

    if (!bin) {
      return res.status(404).json({ success: false, error: "Bin location not found" })
    }

    res.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error fetching bin by value:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create new bin
router.post("/bins", uploadBinImage.single("image"), async (req, res) => {
  try {
    const binData = req.body

    // Parse bins array if it's a string (from FormData)
    if (typeof binData.bins === "string") {
      binData.bins = JSON.parse(binData.bins)
    }

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

    // Parse bins array if it's a string (from FormData)
    if (typeof binData.bins === "string") {
      binData.bins = JSON.parse(binData.bins)
    }

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
