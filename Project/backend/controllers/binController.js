import Bin from "../models/Bin.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * @desc    Get all bins with filters
 * @route   GET /api/admin/bins
 * @query   search, fakultas
 * @access  Admin
 */
export const getAllBins = async (req, res) => {
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
}

// GET single bin by ID
export const getBinById = async (req, res) => {
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
}

// GET bin by value (location ID)
export const getBinByValue = async (req, res) => {
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
}

// POST create new bin
export const createBin = async (req, res) => {
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
}

// PUT update bin
export const updateBin = async (req, res) => {
  try {
    const binData = req.body

    // Parse bins array if it's a string (from FormData)
    if (typeof binData.bins === "string") {
      binData.bins = JSON.parse(binData.bins)
    }

    // If new file uploaded, delete old image and set new image_url
    if (req.file) {
      // Get old bin data to access old image
      const oldBin = await Bin.findById(req.params.id)
      if (oldBin && oldBin.image_url) {
        const oldImagePath = path.join(__dirname, "..", oldBin.image_url)
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath)
            console.log(`Deleted old image: ${oldImagePath}`)
          } catch (err) {
            console.error(`Failed to delete old image: ${err.message}`)
          }
        }
      }
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
}

// DELETE bin
export const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id)

    if (!bin) {
      return res.status(404).json({ success: false, error: "Bin not found" })
    }

    // Delete associated image file if exists
    if (bin.image_url) {
      const imagePath = path.join(__dirname, "..", bin.image_url)
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath)
          console.log(`Deleted image: ${imagePath}`)
        } catch (err) {
          console.error(`Failed to delete image: ${err.message}`)
        }
      }
    }

    res.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error deleting bin:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}
