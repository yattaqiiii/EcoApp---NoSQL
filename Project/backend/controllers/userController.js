import User from "../models/User.js"

/**
 * @desc    Get all users with optional search filter
 * @route   GET /api/admin/users
 * @query   search - Search term for username or email
 * @access  Admin
 */
export const getAllUsers = async (req, res) => {
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
}

// GET single user by ID
export const getUserById = async (req, res) => {
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
}

// POST create new user
export const createUser = async (req, res) => {
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
}

// PUT update user
export const updateUser = async (req, res) => {
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
}

// DELETE user
export const deleteUser = async (req, res) => {
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
}
