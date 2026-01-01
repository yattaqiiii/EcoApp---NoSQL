import mongoose from 'mongoose';

const wasteLogSchema = new mongoose.Schema({
  // Jenis sampah hasil scan AI (misal: Plastik, Organik)
  waste_type: { 
    type: String, 
    required: true 
  },
  // Skor akurasi dari model AI
  confidence: { 
    type: Number, 
    required: true 
  },
  // Data lokasi berdasarkan locationConfig.js
  fakultas: { 
    type: String, 
    required: true 
  },
  lokasi_id: { 
    type: String, 
    required: true 
  },
  // Waktu penyimpanan otomatis
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('WasteLog', wasteLogSchema, 'waste_logs');