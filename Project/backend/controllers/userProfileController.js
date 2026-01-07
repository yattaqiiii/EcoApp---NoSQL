import User from "../models/User.js"

/**
 * @desc    Get user by ID
 * @route   GET /api/user/:userId
 * @access  Private (user)
 */
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }

    // Return user data
    res.json({
      message: "User data fetched successfully",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        total_xp: user.total_xp,
        level: user.level,
        badges: user.badges,
        joinDate: user.joined_at,
      },
    })
  } catch (error) {
    console.error("Get User Error:", error)
    res.status(500).json({ message: "Terjadi kesalahan server" })
  }
}

/**
 * @desc    Update user profile
 * @route   PUT /api/user/:userId
 * @access  Private (user)
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const { name, email } = req.body

    // Validasi input
    if (!name || !email) {
      return res.status(400).json({ message: "Nama dan email harus diisi" })
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format email tidak valid" })
    }

    // Cek apakah email sudah digunakan user lain
    const existingUser = await User.findOne({ email, _id: { $ne: userId } })
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan oleh user lain" })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: name,
        email: email,
      },
      { new: true } // Return updated document
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" })
    }

    res.json({
      message: "Profile berhasil diperbarui",
      user: {
        id: updatedUser._id,
        name: updatedUser.username,
        email: updatedUser.email,
        total_xp: updatedUser.total_xp,
        level: updatedUser.level,
        badges: updatedUser.badges,
        joinDate: updatedUser.joined_at,
      },
    })
  } catch (error) {
    console.error("Update User Error:", error)
    res.status(500).json({ message: "Terjadi kesalahan server" })
  }
}
