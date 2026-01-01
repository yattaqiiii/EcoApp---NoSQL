'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { FAKULTAS_OPTIONS } from '@/utils/locationConfig';
import Navbar from '@/components/Navbar';
import './Scan.css';
import { loadModel, predictImage, getWasteInfo, isModelLoaded } from '@/utils/modelUtils';

export default function Scan() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const router = useRouter();
  const { selectedFakultas, isLocationSet } = useLocation();

  // Cek apakah user sudah pilih fakultas
  useEffect(() => {
    if (!selectedFakultas) {
      alert('Silakan pilih fakultas terlebih dahulu!');
      router.push('/home');
    }
  }, [selectedFakultas, router]);

  // Load model saat component mount
  useEffect(() => {
    const initModel = async () => {
      if (!isModelLoaded()) {
        setIsModelLoading(true);
        const result = await loadModel();
        if (!result.success) {
          setModelError('Gagal memuat model AI. ' + result.error);
        }
        setIsModelLoading(false);
      } else {
        setIsModelLoading(false);
      }
    };

    initModel();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleScan = async () => {
    if (!selectedImage) {
      alert('Pilih gambar terlebih dahulu!');
      return;
    }

    if (modelError) {
      alert('Model AI belum siap. ' + modelError);
      return;
    }

    setIsProcessing(true);

    try {
      // Tunggu image element selesai load
      await new Promise((resolve) => {
        if (imageRef.current && imageRef.current.complete) {
          resolve();
        } else {
          imageRef.current.onload = resolve;
        }
      });

      // Run prediction menggunakan model TFLite
      const prediction = await predictImage(imageRef.current);
      
      // Get waste info berdasarkan label
      const wasteInfo = getWasteInfo(prediction.label);

      setIsProcessing(false);
      
      // Store data di sessionStorage karena Next.js tidak support state via router
      const resultData = {
        image: previewUrl,
        wasteType: prediction.label,
        category: wasteInfo.category,
        confidence: Math.round(prediction.confidence),
        disposal: wasteInfo.disposal,
        additionalInfo: wasteInfo.additionalInfo,
        allPredictions: prediction.allPredictions,
        fakultas: selectedFakultas
      };
      sessionStorage.setItem('scanResult', JSON.stringify(resultData));
      
      // Navigate ke result page
      router.push('/result');
    } catch (error) {
      setIsProcessing(false);
      console.error('Error during scanning:', error);
      alert('Terjadi kesalahan saat memproses gambar: ' + error.message);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChangeLocation = () => {
    router.push('/home');
  };

  const fakultasLabel = FAKULTAS_OPTIONS.find(f => f.value === selectedFakultas)?.label || '';

  return (
    <>
      <Navbar />
      <div className="scan-container">
      <div className="scan-header">
        <h1>Scan Sampah</h1>
        <p>Ambil atau upload foto sampah untuk identifikasi</p>
        
        {/* Fakultas Info */}
        {selectedFakultas && (
          <div className="location-info-box">
            <div className="location-display">
              <span className="location-icon">🏛️</span>
              <div className="location-text">
                <span className="location-label">Fakultas:</span>
                <span className="location-name">{fakultasLabel}</span>
              </div>
            </div>
            <button className="btn-change-location" onClick={handleChangeLocation}>
              Ganti Fakultas
            </button>
          </div>
        )}
        
        {isModelLoading && (
          <div className="model-status loading">
            <span className="spinner-small"></span>
            Memuat model AI...
          </div>
        )}
        {modelError && (
          <div className="model-status error">
            ⚠️ {modelError}
          </div>
        )}
      </div>

      <div className="scan-content">
        {!previewUrl ? (
          <div className="upload-section">
            <div className="camera-placeholder" onClick={handleCameraClick}>
              <span className="camera-icon">📷</span>
              <p>Klik untuk ambil/upload foto</p>
              <p className="hint">Format: JPG, PNG, JPEG</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              capture="environment"
            />
          </div>
        ) : (
          <div className="preview-section">
            <div className="image-preview">
              <img 
                ref={imageRef}
                src={previewUrl} 
                alt="Preview" 
                crossOrigin="anonymous"
              />
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-secondary" 
                onClick={handleReset}
                disabled={isProcessing}
              >
                Ganti Foto
              </button>
              <button 
                className="btn-primary" 
                onClick={handleScan}
                disabled={isProcessing || isModelLoading}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    Scan Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="loader"></div>
            <p>Mengidentifikasi sampah...</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
