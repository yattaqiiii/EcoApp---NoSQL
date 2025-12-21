import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Result.css';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  useEffect(() => {
    // Redirect ke scan jika tidak ada data
    if (!result) {
      navigate('/scan');
    }
  }, [result, navigate]);

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
    <div className="result-container">
      <div className="result-header">
        <h1>Hasil Identifikasi</h1>
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

        {/* Disposal Instructions */}
        <div className="info-card">
          <div className="card-header">
            <span className="card-icon">🗑️</span>
            <h3>Cara Pembuangan</h3>
          </div>
          <p className="card-content">{result.disposal}</p>
        </div>

        {/* Additional Information */}
        {result.additionalInfo && (
          <div className="info-card">
            <div className="card-header">
              <span className="card-icon">💡</span>
              <h3>Informasi Tambahan</h3>
            </div>
            <p className="card-content">{result.additionalInfo}</p>
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
            onClick={() => navigate('/')}
          >
            Kembali ke Home
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/scan')}
          >
            Scan Lagi
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
