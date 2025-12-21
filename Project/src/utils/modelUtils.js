import * as tf from '@tensorflow/tfjs';

let model = null;
let labels = [];

/**
 * Load model dan labels
 * Untuk TFLite, kita perlu konversi dulu ke TensorFlow.js format
 * Alternatif: gunakan Teachable Machine export dengan TensorFlow.js
 */
export async function loadModel() {
  try {
    console.log('Loading model...');
    
    // Load labels
    const response = await fetch('/labels.txt');
    const text = await response.text();
    labels = text.trim().split('\n').map(line => {
      // Format: "0 Organik" -> extract "Organik"
      return line.split(' ').slice(1).join(' ');
    });
    console.log('Labels loaded:', labels);

    // Note: TFLite tidak bisa langsung dimuat di browser dengan TensorFlow.js biasa
    // Ada beberapa opsi:
    // 1. Konversi TFLite ke TensorFlow.js format menggunakan tfjs-converter
    // 2. Export ulang dari Teachable Machine dengan format TensorFlow.js
    // 3. Gunakan Teachable Machine hosted model URL
    
    // Untuk sementara, kita akan simulasi model
    // PENTING: Anda perlu export ulang model dari Teachable Machine dengan format TensorFlow.js
    // atau convert model_unquant.tflite ke format TFJS
    
    console.warn('TFLite model tidak bisa langsung dimuat. Silakan export model dari Teachable Machine dalam format TensorFlow.js atau gunakan converter.');
    
    // Simulasi model untuk testing UI
    model = {
      predict: async (tensor) => {
        // Simulasi prediksi - random untuk testing
        // Ganti dengan model.predict() setelah model di-convert
        const predictions = tf.randomUniform([1, labels.length]);
        return predictions;
      }
    };

    return { success: true };
  } catch (error) {
    console.error('Error loading model:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Preprocess image untuk model
 * Teachable Machine biasanya menggunakan input 224x224
 */
function preprocessImage(imageElement) {
  return tf.tidy(() => {
    // Convert image ke tensor
    let tensor = tf.browser.fromPixels(imageElement);
    
    // Resize ke 224x224 (sesuaikan dengan input model Teachable Machine)
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // Normalize ke range [0, 1]
    tensor = tensor.div(255.0);
    
    // Add batch dimension
    tensor = tensor.expandDims(0);
    
    return tensor;
  });
}

/**
 * Run prediction pada gambar
 * @param {HTMLImageElement} imageElement - Element gambar HTML
 * @returns {Promise<Object>} Hasil prediksi dengan label dan confidence
 */
export async function predictImage(imageElement) {
  if (!model) {
    throw new Error('Model belum di-load. Panggil loadModel() terlebih dahulu.');
  }

  try {
    // Preprocess image
    const tensor = preprocessImage(imageElement);
    
    // Run inference
    const predictions = await model.predict(tensor);
    
    // Get prediction data
    const predictionData = await predictions.data();
    
    // Clean up tensor
    tensor.dispose();
    predictions.dispose();

    // Find label dengan confidence tertinggi
    let maxIndex = 0;
    let maxValue = predictionData[0];
    
    for (let i = 1; i < predictionData.length; i++) {
      if (predictionData[i] > maxValue) {
        maxValue = predictionData[i];
        maxIndex = i;
      }
    }

    const confidence = (maxValue * 100).toFixed(2);
    const label = labels[maxIndex];

    console.log('Prediction result:', { label, confidence });

    return {
      label,
      confidence: parseFloat(confidence),
      allPredictions: labels.map((label, i) => ({
        label,
        confidence: (predictionData[i] * 100).toFixed(2)
      }))
    };
  } catch (error) {
    console.error('Error during prediction:', error);
    throw error;
  }
}

/**
 * Get kategori dan informasi disposal berdasarkan label
 */
export function getWasteInfo(label) {
  const wasteInfoMap = {
    'Organik': {
      category: 'Organik',
      icon: '🌿',
      color: '#4caf50',
      disposal: 'Buang ke tempat sampah organik/hijau. Dapat dikompos untuk pupuk.',
      additionalInfo: 'Sampah organik dapat terurai secara alami dan bisa dijadikan kompos yang berguna untuk tanaman.'
    },
    'Non Organik Daur Ulang': {
      category: 'Non Organik',
      icon: '♻️',
      color: '#2196f3',
      disposal: 'Buang ke tempat sampah non organik/biru. Pisahkan untuk daur ulang.',
      additionalInfo: 'Bersihkan terlebih dahulu sebelum dibuang untuk memudahkan proses daur ulang.'
    },
    'Botol Plastik': {
      category: 'Daur Ulang',
      icon: '🍾',
      color: '#ffa726',
      disposal: 'Cuci bersih, lepas tutup dan label, lalu buang ke tempat sampah plastik.',
      additionalInfo: 'Botol plastik dapat didaur ulang menjadi berbagai produk baru. Pastikan bersih dan kering.'
    },
    'Kertas': {
      category: 'Daur Ulang',
      icon: '📄',
      color: '#8d6e63',
      disposal: 'Buang ke tempat sampah kertas. Pastikan kertas dalam kondisi kering.',
      additionalInfo: 'Kertas basah atau terkontaminasi makanan sebaiknya dibuang ke sampah organik.'
    },
    'Residu': {
      category: 'Residu',
      icon: '🗑️',
      color: '#757575',
      disposal: 'Buang ke tempat sampah residu/hitam. Tidak dapat didaur ulang.',
      additionalInfo: 'Sampah residu adalah sampah yang tidak dapat didaur ulang dan tidak dapat terurai dengan cepat.'
    }
  };

  return wasteInfoMap[label] || {
    category: 'Unknown',
    icon: '❓',
    color: '#9e9e9e',
    disposal: 'Silakan hubungi petugas untuk informasi lebih lanjut.',
    additionalInfo: 'Label tidak dikenali dalam sistem.'
  };
}

/**
 * Check apakah model sudah di-load
 */
export function isModelLoaded() {
  return model !== null;
}
