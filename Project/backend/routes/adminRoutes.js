import express from "express"

// Import controllers
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js"
import { getAllWasteLogs, getWasteLogById, createWasteLog, updateWasteLog, deleteWasteLog } from "../controllers/wasteLogController.js"
import { getAllBins, getBinById, getBinByValue, createBin, updateBin, deleteBin } from "../controllers/binController.js"

// Import middlewares
import { uploadBinImage } from "../middlewares/upload.js"

const router = express.Router()

// ========== USER MANAGEMENT ==========

// GET all users with search
router.get("/users", getAllUsers)

// GET single user by ID
router.get("/users/:id", getUserById)

// POST create new user
router.post("/users", createUser)

// PUT update user
router.put("/users/:id", updateUser)

// DELETE user
router.delete("/users/:id", deleteUser)

// ========== WASTE LOG MANAGEMENT ==========

// GET all waste logs with filters
router.get("/waste-logs", getAllWasteLogs)

// GET single waste log by ID
router.get("/waste-logs/:id", getWasteLogById)

// POST create new waste log
router.post("/waste-logs", createWasteLog)

// PUT update waste log
router.put("/waste-logs/:id", updateWasteLog)

// DELETE waste log
router.delete("/waste-logs/:id", deleteWasteLog)

// ========== BIN MANAGEMENT ==========

// GET all bins with filters
router.get("/bins", getAllBins)

// GET single bin by ID
router.get("/bins/:id", getBinById)

// GET bin by value (location ID)
router.get("/bins/by-value/:value", getBinByValue)

// POST create new bin
router.post("/bins", uploadBinImage.single("image"), createBin)

// PUT update bin
router.put("/bins/:id", uploadBinImage.single("image"), updateBin)

// DELETE bin
router.delete("/bins/:id", deleteBin)

export default router
