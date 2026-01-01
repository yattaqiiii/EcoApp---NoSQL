import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import WasteLog from "@/models/WasteLog"

// GET all waste logs
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const wasteType = searchParams.get("waste_type")
    const fakultas = searchParams.get("fakultas")
    const userId = searchParams.get("user_id")

    let query = {}

    // Search filter
    if (search) {
      query.$or = [{ waste_type: { $regex: search, $options: "i" } }, { fakultas: { $regex: search, $options: "i" } }, { lokasi_id: { $regex: search, $options: "i" } }]
    }

    // Waste type filter
    if (wasteType) {
      query.waste_type = wasteType
    }

    // Fakultas filter
    if (fakultas) {
      query.fakultas = fakultas
    }

    // User filter
    if (userId) {
      query.user_id = userId
    }

    const wasteLogs = await WasteLog.find(query).sort({ timestamp: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: wasteLogs,
      count: wasteLogs.length,
    })
  } catch (error) {
    console.error("Error fetching waste logs:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST create new waste log
export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    // Calculate XP based on confidence
    if (!body.xp_earned) {
      body.xp_earned = Math.round(body.confidence * 10)
    }

    const wasteLog = await WasteLog.create(body)

    return NextResponse.json(
      {
        success: true,
        data: wasteLog,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
