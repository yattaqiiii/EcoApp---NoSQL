import WasteLog from "../models/WasteLog.js";

export const getDashboardStats = async (req, res) => {
    try{
        const categoryStats = await WasteLog.aggregate([
            {
                $group: {
                    _id: "$waste_type",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1} }
        ]);

        const weeklyTrends = await WasteLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    total: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({
            categories: categoryStats,
            trends: weeklyTrends
        });
    }catch(error){
        console.error("Aggregation error detail: ", error);
        res.status(500).json({ message: "Gagal mengambil data statistik: ", error: error.message });
    }
};