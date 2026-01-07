import WasteLog from "../models/WasteLog.js"

/**
 * @desc    Get all waste logs with filters
 * @route   GET /api/admin/waste-logs
 * @query   search, waste_type, fakultas, user_id
 * @access  Admin
 */
export const getAllWasteLogs = async (req, res) => {
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
}

// GET single waste log by ID
export const getWasteLogById = async (req, res) => {
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
}

// POST create new waste log
export const createWasteLog = async (req, res) => {
  try {
    const body = req.body

    const confidence = body.confidence != null ? Number(body.confidence) : undefined
    body.confidence = confidence

    // Normalize waste_type untuk handle label yang terpotong
    if (body.waste_type && body.waste_type.includes("Botol Plasti")) {
      body.waste_type = "Botol Plastik"
    }

    // Calculate XP based on confidence if not provided
    if (!body.xp_earned) {
      if (confidence != null && !Number.isNaN(confidence)) {
        body.xp_earned = Math.round(body.confidence * 10)
      } else {
        body.xp_earned = 0
      }
    } else {
      body.xp_earned = Number(body.xp_earned)
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
}

// PUT update waste log
export const updateWasteLog = async (req, res) => {
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
}

// DELETE waste log
export const deleteWasteLog = async (req, res) => {
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
}
