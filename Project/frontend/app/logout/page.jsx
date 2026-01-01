'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/authUtils';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear localStorage
    logout();
    
    // Redirect ke welcome page
    setTimeout(() => {
      router.push('/welcome');
    }, 500);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
      <div className="bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-10 text-center">
        <div className="w-16 h-16 border-4 border-[#667eea]/30 border-t-[#667eea] rounded-full animate-spin mx-auto mb-5"></div>
        <h2 className="text-2xl font-bold text-gray-800">Logout...</h2>
        <p className="text-gray-600 mt-2">Menghapus session</p>
      </div>
    </div>
  );
}
