'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequireAuth } from '@/utils/authHooks';
import { logout } from '@/utils/authUtils';
import Navbar from '@/components/Navbar';

export default function Profile() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading } = useRequireAuth();
  const [user, setUser] = useState(null);

  // Dummy statistics
  const dummyStats = {
    totalScans: 24,
    wasteIdentified: 18,
    pointsEarned: 320,
    level: 5,
    lastScan: '2 jam yang lalu',
    recentScans: [
      { id: 1, type: 'Botol Plastik', category: 'Plastik', date: '2 jam yang lalu' },
      { id: 2, type: 'Kertas Bekas', category: 'Kertas', date: '1 hari yang lalu' },
      { id: 3, type: 'Kulit Pisang', category: 'Organik', date: '2 hari yang lalu' },
      { id: 4, type: 'Kaleng Minuman', category: 'Anorganik', date: '3 hari yang lalu' }
    ]
  };

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const handleLogout = () => {
    // Hapus user data dari localStorage
    logout();
    // Redirect ke welcome page
    router.push('/welcome');
  };

  const handleEditProfile = () => {
    alert('Fitur edit profile akan segera tersedia!');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#667eea]/30 border-t-[#667eea] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-[25px] p-8 text-white mb-8 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#667eea] text-5xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.name || 'User'}</h1>
              <p className="text-white/90 text-lg mb-1">{user?.email || 'email@example.com'}</p>
              <p className="text-white/80 text-sm">Bergabung sejak {user?.joinDate || 'Januari 2026'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEditProfile}
                className="bg-white text-[#667eea] px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/20 border-2 border-white text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-white/30"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-3xl font-bold text-[#667eea] mb-1">{dummyStats.totalScans}</div>
            <div className="text-gray-600 text-sm font-medium">Total Scan</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-3">♻️</div>
            <div className="text-3xl font-bold text-[#4caf50] mb-1">{dummyStats.wasteIdentified}</div>
            <div className="text-gray-600 text-sm font-medium">Sampah Teridentifikasi</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-3">⭐</div>
            <div className="text-3xl font-bold text-[#ff9800] mb-1">{dummyStats.pointsEarned}</div>
            <div className="text-gray-600 text-sm font-medium">Poin</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-3xl font-bold text-[#9c27b0] mb-1">Level {dummyStats.level}</div>
            <div className="text-gray-600 text-sm font-medium">Pencapaian</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[25px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Aktivitas Terakhir</h2>
            <span className="text-sm text-gray-500">{dummyStats.lastScan}</span>
          </div>

          <div className="space-y-4">
            {dummyStats.recentScans.map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white text-xl">
                    {scan.category === 'Organik' ? '🌿' : 
                     scan.category === 'Plastik' ? '♻️' : 
                     scan.category === 'Kertas' ? '📄' : '🗑️'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{scan.type}</h3>
                    <p className="text-sm text-gray-500">{scan.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{scan.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/scan"
              className="inline-block bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] hover:-translate-y-0.5"
            >
              Scan Sampah Baru
            </Link>
          </div>
        </div>

        {/* Achievements Section (Optional) */}
        <div className="bg-white rounded-[25px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.1)] mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pencapaian</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-[#4caf50]/10 to-[#4caf50]/20 rounded-xl">
              <div className="text-4xl mb-2">🌱</div>
              <p className="text-sm font-semibold text-gray-700">Pemula</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-[#2196f3]/10 to-[#2196f3]/20 rounded-xl">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-sm font-semibold text-gray-700">Scanner</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-[#ff9800]/10 to-[#ff9800]/20 rounded-xl">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-sm font-semibold text-gray-700">Bintang</p>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-xl opacity-50">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-sm font-semibold text-gray-700">Master</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
