import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import WasteLog from "@/models/WasteLog"
import User from "@/models/User"

// GET dashboard statistics
export async function GET() {
  try {
    await connectDB()

    // Get counts
    const totalScans = await WasteLog.countDocuments()
    const totalUsers = await User.countDocuments()

    // Get total XP
    const xpResult = await User.aggregate([
      {
        $group: {
          _id: null,
          totalXP: { $sum: "$total_xp" },
        },
      },
    ])
    const totalXP = xpResult.length > 0 ? xpResult[0].totalXP : 0

    // Get waste type distribution
    const wasteTypeDistribution = await WasteLog.aggregate([
      {
        $group: {
          _id: "$waste_type",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get recent activities (last 10 logs with user info)
    const recentLogs = await WasteLog.find().sort({ timestamp: -1 }).limit(10).lean()

    // Get user info for recent logs
    const userIds = [...new Set(recentLogs.map(log => log.user_id))]
    const users = await User.find({ _id: { $in: userIds } }).lean()
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]))

    const recentActivities = recentLogs.map(log => ({
      ...log,
      username: userMap[log.user_id]?.username || "Unknown User",
    }))

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalScans,
          totalUsers,
          totalXP,
          avgLevel: totalUsers > 0 ? (await User.aggregate([{ $group: { _id: null, avgLevel: { $avg: "$level" } } }]))[0]?.avgLevel || 0 : 0,
        },
        wasteTypeDistribution,
        recentActivities,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
