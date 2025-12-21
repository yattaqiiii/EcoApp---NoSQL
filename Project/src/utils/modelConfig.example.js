// ============================================
// KONFIGURASI MODEL TEACHABLE MACHINE
// ============================================
// Copy file ini dan rename menjadi modelConfig.js
// Lalu import di modelUtils.js

export const MODEL_CONFIG = {
  // OPSI 1: Gunakan Teachable Machine Cloud URL
  // Cara dapat URL:
  // 1. Buka Teachable Machine project Anda
  // 2. Klik "Export Model"
  // 3. Klik "Upload my model (Shareable Link)"
  // 4. Copy URL yang diberikan
  useCloudModel: true,
  cloudModelURL: 'https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/',
  
  // OPSI 2: Gunakan Model Lokal (jika sudah download)
  // Export model dengan format "TensorFlow.js"
  // Extract dan taruh di public/model/
  localModelPath: '/model/model.json',
  
  // Preprocessing settings
  imageSize: 224, // Teachable Machine default
  normalization: [0, 1], // Range normalization
  
  // Labels (akan di-override dari metadata.json)
  // Ini hanya fallback jika metadata tidak tersedia
  fallbackLabels: [
    'Organik',
    'Non Organik Daur Ulang',
    'Botol Plastik',
    'Kertas',
    'Residu'
  ]
};

// ============================================
// CONTOH PENGGUNAAN:
// ============================================
// import { MODEL_CONFIG } from './modelConfig';
// 
// const modelURL = MODEL_CONFIG.useCloudModel 
//   ? MODEL_CONFIG.cloudModelURL + 'model.json'
//   : MODEL_CONFIG.localModelPath;
