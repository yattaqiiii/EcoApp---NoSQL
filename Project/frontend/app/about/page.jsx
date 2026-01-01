'use client';

import Navbar from '@/components/Navbar';

export default function About() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-5 min-h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="text-center mb-12 py-10 px-5 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-[20px] text-white">
          <h1 className="text-5xl mb-2.5">Tentang EcoScan</h1>
          <p className="text-xl opacity-95">Solusi Cerdas untuk Identifikasi Sampah</p>
        </div>

        <div className="bg-white rounded-[20px] p-10 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#667eea]">
              Apa itu EcoScan?
            </h2>
            <p className="text-gray-600 text-lg leading-[1.8]">
              EcoScan adalah aplikasi berbasis AI yang membantu Anda mengidentifikasi 
              jenis sampah dengan mudah dan cepat. Cukup ambil foto sampah, dan aplikasi 
              kami akan memberikan informasi lengkap tentang jenis sampah tersebut beserta 
              cara pembuangan yang tepat.
            </p>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#667eea]">
              Cara Menggunakan
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-8">
              <div className="text-center py-8 px-5 bg-[#f8f9ff] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
                <div className="w-[60px] h-[60px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-5">
                  1
                </div>
                <h3 className="text-2xl text-[#667eea] mb-2.5">Ambil Foto</h3>
                <p className="text-gray-600 text-base">
                  Klik tombol "Mulai Scan" dan ambil foto sampah Anda
                </p>
              </div>
              <div className="text-center py-8 px-5 bg-[#f8f9ff] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
                <div className="w-[60px] h-[60px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-5">
                  2
                </div>
                <h3 className="text-2xl text-[#667eea] mb-2.5">Proses AI</h3>
                <p className="text-gray-600 text-base">
                  Sistem AI kami akan menganalisis dan mengidentifikasi jenis sampah
                </p>
              </div>
              <div className="text-center py-8 px-5 bg-[#f8f9ff] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
                <div className="w-[60px] h-[60px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-5">
                  3
                </div>
                <h3 className="text-2xl text-[#667eea] mb-2.5">Lihat Hasil</h3>
                <p className="text-gray-600 text-base">
                  Dapatkan informasi detail dan panduan pembuangan yang benar
                </p>
              </div>
            </div>
          </section>

          {/* Waste Categories */}
          <section className="mb-12">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#667eea]">
              Kategori Sampah
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mt-8">
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#667eea] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(102,126,234,0.2)]">
                <span className="text-6xl block mb-4">🌿</span>
                <h3 className="text-xl text-gray-800 mb-2.5">Organik</h3>
                <p className="text-gray-600 text-sm leading-normal">
                  Sampah yang dapat terurai secara alami seperti sisa makanan, daun, ranting
                </p>
              </div>
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#667eea] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(102,126,234,0.2)]">
                <span className="text-6xl block mb-4">♻️</span>
                <h3 className="text-xl text-gray-800 mb-2.5">Anorganik</h3>
                <p className="text-gray-600 text-sm leading-normal">
                  Sampah yang tidak dapat terurai seperti plastik, logam, kaca
                </p>
              </div>
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#667eea] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(102,126,234,0.2)]">
                <span className="text-6xl block mb-4">⚠️</span>
                <h3 className="text-xl text-gray-800 mb-2.5">B3 (Berbahaya)</h3>
                <p className="text-gray-600 text-sm leading-normal">
                  Sampah yang mengandung bahan berbahaya seperti baterai, cat, pestisida
                </p>
              </div>
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#667eea] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(102,126,234,0.2)]">
                <span className="text-6xl block mb-4">🔄</span>
                <h3 className="text-xl text-gray-800 mb-2.5">Dapat Didaur Ulang</h3>
                <p className="text-gray-600 text-sm leading-normal">
                  Sampah yang dapat diolah kembali seperti kertas, kardus, botol plastik
                </p>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="mb-12 bg-gradient-to-br from-[#667eea15] to-[#764ba215] p-8 rounded-2xl border-l-[5px] border-[#667eea]">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#667eea]">
              Misi Kami
            </h2>
            <p className="text-gray-700 text-xl leading-[1.8] font-medium">
              Membantu masyarakat untuk memilah dan membuang sampah dengan benar, 
              sehingga dapat mengurangi pencemaran lingkungan dan meningkatkan 
              kesadaran akan pentingnya pengelolaan sampah yang baik.
            </p>
          </section>

          {/* Team Info */}
          <section className="text-center mb-0">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#667eea]">
              Tim Pengembang
            </h2>
            <p className="text-gray-600 text-lg leading-[1.8]">
              Aplikasi ini dikembangkan sebagai Tugas Besar Mata Kuliah Sistem Cerdas 
              dengan tujuan memberikan solusi praktis untuk masalah pengelolaan sampah 
              melalui teknologi AI.
            </p>
            <div className="mt-8 p-8 bg-[#f8f9ff] rounded-2xl">
              <h3 className="text-2xl text-[#667eea] mb-5">
                Teknologi yang Digunakan
              </h3>
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="py-3 px-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-full font-semibold text-base">
                  Next.js 15
                </span>
                <span className="py-3 px-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-full font-semibold text-base">
                  React 19
                </span>
                <span className="py-3 px-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-full font-semibold text-base">
                  TensorFlow.js
                </span>
                <span className="py-3 px-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-full font-semibold text-base">
                  MongoDB
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
