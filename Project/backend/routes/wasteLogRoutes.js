import express from "express"
import { submitScan, getUserWasteLogs } from "../controllers/scanController.js"

const router = express.Router()

/**
 * @route   POST /api/scan
 * @desc    Submit waste scan and update user gamification
 * @access  Private
 */
router.post("/", submitScan)

/**
 * @route   GET /api/waste-logs
 * @desc    Get user waste logs history
 * @query   userId
 * @access  Private
 */
router.get("/", getUserWasteLogs)

export default router
