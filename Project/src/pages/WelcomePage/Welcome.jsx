import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleNext = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
      navigate('/home');
    }
  };

  const screens = [
    {
      icons: { large: '♻️', medium: '🗑️', small: '🌱' },
      title: 'Identifikasi Sampah',
      description: 'Scan sampah dengan mudah dan dapatkan informasi cara pembuangan yang benar untuk lingkungan yang lebih bersih'
    },
    {
      icons: { large: '📷', medium: '🔍', small: '✨' },
      title: 'Scan & Analisis',
      description: 'Gunakan kamera untuk mengambil foto sampah, AI kami akan mengidentifikasi jenis sampah secara otomatis'
    },
    {
      icons: { large: '🌍', medium: '💚', small: '♻️' },
      title: 'Jaga Lingkungan',
      description: 'Dengan memilah sampah dengan benar, kita berkontribusi untuk bumi yang lebih bersih dan sehat'
    }
  ];

  const currentData = screens[currentScreen];

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {/* Logo Section */}
        <div className="logo-section">
          <h1 className="brand-logo">
            EcoScan
          </h1>
          <p className="brand-subtitle">Our New Lifestyles</p>
        </div>

        {/* Illustration Section */}
        <div className="illustration-section">
          <div className="illustration-placeholder">
            {/* Placeholder untuk ilustrasi */}
            <div className="illustration-icon">
              <span className="icon-large">{currentData.icons.large}</span>
              <span className="icon-medium">{currentData.icons.medium}</span>
              <span className="icon-small">{currentData.icons.small}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <h2 className="welcome-title">{currentData.title}</h2>
          <p className="welcome-description">
            {currentData.description}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <span className={`dot ${currentScreen === 0 ? 'active' : ''}`}></span>
          <span className={`dot ${currentScreen === 1 ? 'active' : ''}`}></span>
          <span className={`dot ${currentScreen === 2 ? 'active' : ''}`}></span>
        </div>

        {/* Button Section */}
        <button className="btn-enter" onClick={handleNext}>
          {currentScreen === 2 ? 'Mulai' : 'Lanjutkan'}
        </button>
      </div>
    </div>
  );
}

export default Welcome;
