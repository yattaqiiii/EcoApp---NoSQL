import express from "express"
import { getUserProfile, updateUserProfile } from "../controllers/userProfileController.js"

const router = express.Router()

/**
 * @route   GET /api/user/:userId
 * @desc    Get user profile by ID
 * @access  Private
 */
router.get("/:userId", getUserProfile)

/**
 * @route   PUT /api/user/:userId
 * @desc    Update user profile
 * @access  Private
 */
router.put("/:userId", updateUserProfile)

export default router
