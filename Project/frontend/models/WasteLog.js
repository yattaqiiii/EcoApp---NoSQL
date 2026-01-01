import mongoose from "mongoose"

const WasteLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    waste_type: {
      type: String,
      required: true,
      enum: ["Plastik", "Organik", "Kertas", "Logam", "Kaca", "Residu", "Botol Plastik"],
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    fakultas: {
      type: String,
      required: true,
    },
    lokasi_id: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
    },
    xp_earned: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "waste_logs",
  }
)

// Index untuk query performa
WasteLogSchema.index({ user_id: 1, timestamp: -1 })
WasteLogSchema.index({ waste_type: 1 })
WasteLogSchema.index({ fakultas: 1, lokasi_id: 1 })

export default mongoose.models.WasteLog || mongoose.model("WasteLog", WasteLogSchema)
