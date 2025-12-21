import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleStartScan = () => {
    navigate('/scan');
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="app-title">EcoScan</h1>
        <p className="app-tagline">Identifikasi Sampah dengan Mudah</p>
        <p className="app-description">
          Scan sampah Anda dan dapatkan informasi tentang jenis sampah serta 
          cara pembuangan yang benar untuk lingkungan yang lebih bersih.
        </p>
        
        <button className="btn-primary" onClick={handleStartScan}>
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
        </div>
      </div>
    </div>
  );
}

export default Home;
