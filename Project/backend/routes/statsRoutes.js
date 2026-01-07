import express from "express"
import { getDashboardStats } from "../controllers/statsController.js"

const router = express.Router()

/**
 * @route   GET /api/stats/stats
 * @desc    Get dashboard statistics with optional time filter
 * @query   timeFilter - 'today' | 'week' | 'month' | 'all'
 * @access  Admin
 */
router.get("/stats", getDashboardStats)

export default router
