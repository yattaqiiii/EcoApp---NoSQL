'use client';

import Navbar from '@/components/Navbar';
import './About.css';

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
      <div className="about-header">
        <h1>Tentang EcoScan</h1>
        <p className="tagline">Solusi Cerdas untuk Identifikasi Sampah</p>
      </div>

      <div className="about-content">
        {/* Introduction */}
        <section className="about-section">
          <h2>Apa itu EcoScan?</h2>
          <p>
            EcoScan adalah aplikasi berbasis AI yang membantu Anda mengidentifikasi 
            jenis sampah dengan mudah dan cepat. Cukup ambil foto sampah, dan aplikasi 
            kami akan memberikan informasi lengkap tentang jenis sampah tersebut beserta 
            cara pembuangan yang tepat.
          </p>
        </section>

        {/* How to Use */}
        <section className="about-section">
          <h2>Cara Menggunakan</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Ambil Foto</h3>
              <p>Klik tombol "Mulai Scan" dan ambil foto sampah Anda</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Proses AI</h3>
              <p>Sistem AI kami akan menganalisis dan mengidentifikasi jenis sampah</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Lihat Hasil</h3>
              <p>Dapatkan informasi detail dan panduan pembuangan yang benar</p>
            </div>
          </div>
        </section>

        {/* Waste Categories */}
        <section className="about-section">
          <h2>Kategori Sampah</h2>
          <div className="categories-grid">
            <div className="category-item">
              <span className="category-icon-large">🌿</span>
              <h3>Organik</h3>
              <p>Sampah yang dapat terurai secara alami seperti sisa makanan, daun, ranting</p>
            </div>
            <div className="category-item">
              <span className="category-icon-large">♻️</span>
              <h3>Anorganik</h3>
              <p>Sampah yang tidak dapat terurai seperti plastik, logam, kaca</p>
            </div>
            <div className="category-item">
              <span className="category-icon-large">⚠️</span>
              <h3>B3 (Berbahaya)</h3>
              <p>Sampah yang mengandung bahan berbahaya seperti baterai, cat, pestisida</p>
            </div>
            <div className="category-item">
              <span className="category-icon-large">🔄</span>
              <h3>Dapat Didaur Ulang</h3>
              <p>Sampah yang dapat diolah kembali seperti kertas, kardus, botol plastik</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="about-section mission-section">
          <h2>Misi Kami</h2>
          <p>
            Membantu masyarakat untuk memilah dan membuang sampah dengan benar, 
            sehingga dapat mengurangi pencemaran lingkungan dan meningkatkan 
            kesadaran akan pentingnya pengelolaan sampah yang baik.
          </p>
        </section>

        {/* Team Info */}
        <section className="about-section team-section">
          <h2>Tim Pengembang</h2>
          <p>
            Aplikasi ini dikembangkan sebagai Tugas Besar Mata Kuliah Sistem Cerdas 
            dengan tujuan memberikan solusi praktis untuk masalah pengelolaan sampah 
            melalui teknologi AI.
          </p>
          <div className="tech-stack">
            <h3>Teknologi yang Digunakan</h3>
            <div className="tech-badges">
              <span className="tech-badge">Next.js 15</span>
              <span className="tech-badge">React 19</span>
              <span className="tech-badge">TensorFlow.js</span>
              <span className="tech-badge">MongoDB</span>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
