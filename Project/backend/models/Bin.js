import mongoose from "mongoose"

const binSchema = new mongoose.Schema(
  {
    fakultas: {
      type: String,
      required: true,
    },
    lokasi: {
      type: String,
      required: true,
      trim: true,
    },
    jenis: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const Bin = mongoose.model("Bin", binSchema, "bins")

export default Bin
