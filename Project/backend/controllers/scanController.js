import WasteLog from "../models/WasteLog.js"
import User from "../models/User.js"
import { calculateXPFromConfidence, calculateLevel, checkNewBadges } from "../utils/gamification.js"

/**
 * @desc    Submit waste scan
 * @route   POST /api/scan
 * @access  Private (user)
 */
export const submitScan = async (req, res) => {
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
}

/**
 * @desc    Get user waste logs history
 * @route   GET /api/waste-logs
 * @query   userId
 * @access  Private (user)
 */
export const getUserWasteLogs = async (req, res) => {
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
}
