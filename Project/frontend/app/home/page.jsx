'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { FAKULTAS_OPTIONS } from '@/utils/locationConfig';
import Navbar from '@/components/Navbar';
import './Home.css';

export default function Home() {
  const router = useRouter();
  const { setLocation } = useLocation();
  const [selectedFakultas, setSelectedFakultas] = useState('');

  const handleFakultasChange = (e) => {
    setSelectedFakultas(e.target.value);
  };

  const handleStartScan = () => {
    if (!selectedFakultas) {
      alert('Silakan pilih fakultas terlebih dahulu!');
      return;
    }

    // Save fakultas to context (lokasi akan dipilih di Result page)
    setLocation(selectedFakultas, '', null);
    
    // Navigate to scan page
    router.push('/scan');
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="hero-section">
          <h1 className="app-title">EcoScan</h1>
          <p className="app-tagline">Identifikasi Sampah dengan Mudah</p>
          <p className="app-description">
            Scan sampah Anda dan dapatkan informasi tentang jenis sampah serta 
            cara pembuangan yang benar untuk lingkungan yang lebih bersih.
          </p>
          
          {/* Location Selection */}
          <div className="location-selection">
            <h3 className="location-title">📍 Pilih Fakultas Anda</h3>
            <p className="location-subtitle">Lokasi spesifik akan dipilih setelah scan</p>
            
            <div className="dropdown-container">
              <label htmlFor="fakultas-select">Fakultas:</label>
              <select
                id="fakultas-select"
                className="location-dropdown"
                value={selectedFakultas}
                onChange={handleFakultasChange}
              >
                <option value="">-- Pilih Fakultas --</option>
                {FAKULTAS_OPTIONS.map((fakultas) => (
                  <option key={fakultas.value} value={fakultas.value}>
                    {fakultas.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedFakultas && (
              <div className="location-info">
                <p className="fakultas-selected">
                  ✅ Fakultas dipilih: <strong>
                    {FAKULTAS_OPTIONS.find(f => f.value === selectedFakultas)?.label}
                  </strong>
                </p>
              </div>
            )}
          </div>

          <button 
            className="btn-primary" 
            onClick={handleStartScan}
            disabled={!selectedFakultas}
          >
            Mulai Scan
          </button>
        </div>

        <div className="features-section">
          <h2>Fitur Unggulan</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔍</span>
              <h3>Identifikasi Cepat</h3>
              <p>Scan dan identifikasi jenis sampah dalam hitungan detik</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">♻️</span>
              <h3>Panduan Pembuangan</h3>
              <p>Dapatkan instruksi cara membuang sampah yang benar</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌱</span>
              <h3>Ramah Lingkungan</h3>
              <p>Bantu menjaga lingkungan dengan pemilahan sampah yang tepat</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📍</span>
              <h3>Lokasi Spesifik</h3>
              <p>Rekomendasi tempat sampah sesuai lokasi Anda di kampus</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
