import User from "../models/User.js"

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validasi dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field harus diisi" })
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" })
    }

    // Buat User Baru (XP dan Level otomatis default)
    const newUser = new User({
      username: name, // Mapping 'name' dari frontend ke 'username' di DB
      email,
      password: password, // (Catatan: Di production sebaiknya di-hash pakai bcrypt)
    })

    await newUser.save()

    res.status(201).json({
      message: "Registrasi berhasil",
      user: { email: newUser.email, name: newUser.username },
    })
  } catch (error) {
    console.error("Register Error:", error)
    res.status(500).json({ message: "Terjadi kesalahan server" })
  }
}

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Cari user berdasarkan email
    const user = await User.findOne({ email })

    // Cek user dan password (sederhana)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Email atau password salah" })
    }

    // Login Sukses -> Kirim data user ke frontend
    res.json({
      message: "Login berhasil",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        total_xp: user.total_xp,
        level: user.level,
        joinDate: user.joined_at,
      },
    })
  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({ message: "Terjadi kesalahan server" })
  }
}
