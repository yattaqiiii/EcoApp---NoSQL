'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { 
  FAKULTAS_OPTIONS, 
  mapWasteTypeToBin, 
  findLocationsWithBin,
  findLocationsWithFallback,
  getFallbackBin,
  binMatches
} from '@/utils/locationConfig';
import Navbar from '@/components/Navbar';
import './Result.css';

export default function Result() {
  const router = useRouter();
  const { selectedFakultas } = useLocation();
  
  // Get data dari sessionStorage (dari Scan page)
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const storedData = sessionStorage.getItem('scanResult');
    if (storedData) {
      setResult(JSON.parse(storedData));
    } else {
      // Redirect ke scan jika tidak ada data
      router.push('/scan');
    }
  }, [router]);
  
  // State untuk accordion (track which fakultas/location is expanded)
  const [expandedFakultas, setExpandedFakultas] = useState({});
  
  const fakultasLabel = selectedFakultas 
    ? FAKULTAS_OPTIONS.find(f => f.value === selectedFakultas)?.label 
    : '';
  
  // Map waste type ke bin category
  const targetBin = result ? mapWasteTypeToBin(result.wasteType) : '';
  const fallbackBin = result ? getFallbackBin(result.wasteType) : null;
  
  // Cari lokasi dengan fallback option
  const locationResult = selectedFakultas && result
    ? findLocationsWithFallback(selectedFakultas, result.wasteType)
    : { hasPrimary: false, hasFallback: false, primaryLocations: [], fallbackLocations: [] };
  
  // Debug logging
  console.log('Debug Info:', {
    fakultas: selectedFakultas,
    wasteType: result?.wasteType,
    targetBin,
    fallbackBin,
    locationResult
  });
  
  // Cari semua lokasi di fakultas lain yang punya bin spesifik
  const allLocationsWithBin = targetBin ? findLocationsWithBin(targetBin) : {};
  
  // Check kondisi
  const hasPrimaryBin = locationResult.hasPrimary;
  const hasFallbackOnly = !locationResult.hasPrimary && locationResult.hasFallback;
  const hasNoBin = !locationResult.hasPrimary && !locationResult.hasFallback;
  
  // Toggle accordion
  const toggleFakultas = (fakultasKey) => {
    setExpandedFakultas(prev => ({
      ...prev,
      [fakultasKey]: !prev[fakultasKey]
    }));
  };



  if (!result) {
    return null;
  }

  const getColorByCategory = (category) => {
    const colors = {
      'Organik': '#4caf50',
      'Anorganik': '#2196f3',
      'Plastik': '#ff9800',
      'Botol Plastik': '#ffa726',
      'Kertas': '#8d6e63',
      'Residu': '#757575'
    };
    return colors[category] || '#667eea';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Organik': '🌿',
      'Non Organik': '♻️',
      'Daur Ulang': '♻️',
      'Residu': '🗑️'
    };
    return icons[category] || '📦';
  };

  return (
    <>
      <Navbar />
      <div className="result-container">
      <div className="result-header">
        <h1>Hasil Identifikasi</h1>
        
        {/* Fakultas Info */}
        {fakultasLabel && (
          <div className="location-display-header">
            <span className="location-icon">🏛️</span>
            <span className="location-text">{fakultasLabel}</span>
          </div>
        )}
      </div>

      <div className="result-content">
        {/* Image Section */}
        <div className="result-image">
          <img src={result.image} alt="Scanned waste" />
        </div>

        {/* Result Info */}
        <div className="result-info">
          <div 
            className="category-badge" 
            style={{ backgroundColor: getColorByCategory(result.category) }}
          >
            <span className="category-icon">{getCategoryIcon(result.category)}</span>
            <span className="category-name">{result.category}</span>
          </div>

          <h2 className="waste-type">{result.wasteType}</h2>

          <div className="confidence-bar">
            <div className="confidence-label">
              <span>Tingkat Kepercayaan</span>
              <span className="confidence-value">{result.confidence}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Kondisi 1: Fakultas user PUNYA tempat sampah SPESIFIK */}
        {hasPrimaryBin && (
          <div className="info-card disposal-card available">
            <div className="card-header">
              <span className="card-icon">✅</span>
              <h3>Tempat Pembuangan Tersedia di {fakultasLabel}</h3>
            </div>
            <p className="card-content disposal-message">
              Buang sampah <strong>{result.wasteType}</strong> ke tempat sampah <strong>{targetBin}</strong> yang tersedia di lokasi berikut:
            </p>
            
            <div className="locations-container">
              {locationResult.primaryLocations.map((lokasi, index) => (
                <div key={index} className="location-item">
                  <div className="location-item-header">
                    <span className="location-icon">📍</span>
                    <div className="location-item-info">
                      <h4 className="location-name">{lokasi.label}</h4>
                      <p className="location-desc">{lokasi.description}</p>
                    </div>
                  </div>
                  <div className="location-bins">
                    <span className="bins-label">Tempat sampah:</span>
                    <div className="bins-tags">
                      {lokasi.bins.map((bin, binIndex) => (
                        <span 
                          key={binIndex} 
                          className={`bin-tag ${binMatches(bin, targetBin) ? 'highlight' : ''}`}
                        >
                          {bin}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kondisi 1.5: Fakultas user TIDAK PUNYA tempat spesifik tapi PUNYA FALLBACK */}
        {hasFallbackOnly && (
          <>
            {/* Tampilkan Fallback Option */}
            <div className="info-card disposal-card fallback">
              <div className="card-header">
                <span className="card-icon">ℹ️</span>
                <h3>Alternatif Pembuangan di {fakultasLabel}</h3>
              </div>
              <p className="card-content disposal-message">
                Tempat sampah khusus <strong>{targetBin}</strong> tidak tersedia di {fakultasLabel}, 
                tetapi Anda dapat membuang sampah <strong>{result.wasteType}</strong> ke tempat sampah <strong>{locationResult.fallbackBin}</strong> sebagai alternatif.
              </p>
              
              <div className="locations-container">
                {locationResult.fallbackLocations.map((lokasi, index) => (
                  <div key={index} className="location-item">
                    <div className="location-item-header">
                      <span className="location-icon">📍</span>
                      <div className="location-item-info">
                        <h4 className="location-name">{lokasi.label}</h4>
                        <p className="location-desc">{lokasi.description}</p>
                      </div>
                    </div>
                    <div className="location-bins">
                      <span className="bins-label">Tempat sampah:</span>
                      <div className="bins-tags">
                        {lokasi.bins.map((bin, binIndex) => (
                          <span 
                            key={binIndex} 
                            className={`bin-tag ${binMatches(bin, locationResult.fallbackBin) ? 'highlight-fallback' : ''}`}
                          >
                            {bin}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tampilkan Rekomendasi Lokasi dengan Tempat Sampah Spesifik */}
            {Object.keys(allLocationsWithBin).length > 0 && (
              <div className="info-card recommendation-card">
                <div className="card-header">
                  <span className="card-icon">⭐</span>
                  <h3>Rekomendasi Tempat Sampah Khusus {targetBin}</h3>
                </div>
                <p className="card-content">
                  Untuk hasil yang lebih optimal, berikut lokasi yang menyediakan tempat sampah khusus <strong>{targetBin}</strong>:
                </p>
                
                <div className="fakultas-recommendations">
                  {Object.keys(allLocationsWithBin).map((fakultasKey) => {
                    const fakultasInfo = FAKULTAS_OPTIONS.find(f => f.value === fakultasKey);
                    const locations = allLocationsWithBin[fakultasKey];
                    const isExpanded = expandedFakultas[fakultasKey];
                    
                    return (
                      <div key={fakultasKey} className="fakultas-accordion">
                        <div 
                          className="fakultas-accordion-header"
                          onClick={() => toggleFakultas(fakultasKey)}
                        >
                          <div className="fakultas-accordion-title">
                            <span className="fakultas-icon">🏛️</span>
                            <span className="fakultas-name">{fakultasInfo?.label || fakultasKey}</span>
                            <span className="location-count">({locations.length} lokasi)</span>
                          </div>
                          <span className={`accordion-arrow ${isExpanded ? 'expanded' : ''}`}>
                            ▼
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="fakultas-accordion-content">
                            {locations.map((lokasi, index) => (
                              <div key={index} className="location-item">
                                <div className="location-item-header">
                                  <span className="location-icon">📍</span>
                                  <div className="location-item-info">
                                    <h4 className="location-name">{lokasi.label}</h4>
                                    <p className="location-desc">{lokasi.description}</p>
                                  </div>
                                </div>
                                <div className="location-bins">
                                  <span className="bins-label">Tempat sampah:</span>
                                  <div className="bins-tags">
                                    {lokasi.bins.map((bin, binIndex) => (
                                      <span 
                                        key={binIndex} 
                                        className={`bin-tag ${binMatches(bin, targetBin) ? 'highlight' : ''}`}
                                      >
                                        {bin}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Kondisi 2: Fakultas user TIDAK PUNYA tempat sampah sama sekali */}
        {hasNoBin && Object.keys(allLocationsWithBin).length > 0 && (
          <div className="info-card disposal-card not-available">
            <div className="card-header">
              <span className="card-icon">⚠️</span>
              <h3>Tempat Sampah Tidak Tersedia di {fakultasLabel}</h3>
            </div>
            <p className="card-content disposal-message">
              Tempat sampah <strong>{targetBin}</strong> untuk sampah <strong>{result.wasteType}</strong> tidak tersedia di {fakultasLabel}. 
              Berikut rekomendasi lokasi terdekat yang menyediakan tempat sampah ini:
            </p>
            
            <div className="fakultas-recommendations">
              {Object.keys(allLocationsWithBin).map((fakultasKey) => {
                const fakultasInfo = FAKULTAS_OPTIONS.find(f => f.value === fakultasKey);
                const locations = allLocationsWithBin[fakultasKey];
                const isExpanded = expandedFakultas[fakultasKey];
                
                return (
                  <div key={fakultasKey} className="fakultas-accordion">
                    <div 
                      className="fakultas-accordion-header"
                      onClick={() => toggleFakultas(fakultasKey)}
                    >
                      <div className="fakultas-accordion-title">
                        <span className="fakultas-icon">🏛️</span>
                        <span className="fakultas-name">{fakultasInfo?.label || fakultasKey}</span>
                        <span className="location-count">({locations.length} lokasi)</span>
                      </div>
                      <span className={`accordion-arrow ${isExpanded ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </div>
                    
                    {isExpanded && (
                      <div className="fakultas-accordion-content">
                        {locations.map((lokasi, index) => (
                          <div key={index} className="location-item">
                            <div className="location-item-header">
                              <span className="location-icon">📍</span>
                              <div className="location-item-info">
                                <h4 className="location-name">{lokasi.label}</h4>
                                <p className="location-desc">{lokasi.description}</p>
                              </div>
                            </div>
                            <div className="location-bins">
                              <span className="bins-label">Tempat sampah:</span>
                              <div className="bins-tags">
                                {lokasi.bins.map((bin, binIndex) => (
                                  <span 
                                    key={binIndex} 
                                    className={`bin-tag ${bin.includes(targetBin) ? 'highlight' : ''}`}
                                  >
                                    {bin}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Jika tidak ada tempat sampah sama sekali */}
        {hasNoBin && Object.keys(allLocationsWithBin).length === 0 && (
          <div className="info-card disposal-card not-available">
            <div className="card-header">
              <span className="card-icon">⚠️</span>
              <h3>Tempat Sampah Tidak Ditemukan</h3>
            </div>
            <p className="card-content disposal-message">
              Maaf, tempat sampah untuk <strong>{result.wasteType}</strong> belum tersedia di sistem kami.
              Silakan hubungi pengelola kampus untuk informasi lebih lanjut.
            </p>
          </div>
        )}

        {/* All Predictions (confidence breakdown) */}
        {result.allPredictions && result.allPredictions.length > 0 && (
          <div className="info-card">
            <div className="card-header">
              <span className="card-icon">📊</span>
              <h3>Detail Prediksi</h3>
            </div>
            <div className="predictions-list">
              {result.allPredictions.map((pred, index) => (
                <div key={index} className="prediction-item">
                  <span className="prediction-label">{pred.label}</span>
                  <div className="prediction-bar-container">
                    <div 
                      className="prediction-bar-fill" 
                      style={{ width: `${pred.confidence}%` }}
                    ></div>
                  </div>
                  <span className="prediction-confidence">{pred.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn-secondary" 
            onClick={() => router.push('/home')}
          >
            Kembali ke Home
          </button>
          <button 
            className="btn-primary" 
            onClick={() => router.push('/scan')}
          >
            Scan Lagi
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
