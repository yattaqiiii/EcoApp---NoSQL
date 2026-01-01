import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

// GET single user
export async function GET(request, { params }) {
  try {
    await connectDB()

    const user = await User.findById(params.id).lean()

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()
    const user = await User.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE user
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
