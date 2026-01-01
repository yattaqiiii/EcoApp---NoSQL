import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import WasteLog from "@/models/WasteLog"

// GET single waste log
export async function GET(request, { params }) {
  try {
    await connectDB()

    const wasteLog = await WasteLog.findById(params.id).lean()

    if (!wasteLog) {
      return NextResponse.json({ success: false, error: "Waste log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error fetching waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT update waste log
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()
    const wasteLog = await WasteLog.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!wasteLog) {
      return NextResponse.json({ success: false, error: "Waste log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error updating waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE waste log
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const wasteLog = await WasteLog.findByIdAndDelete(params.id)

    if (!wasteLog) {
      return NextResponse.json({ success: false, error: "Waste log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Waste log deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
