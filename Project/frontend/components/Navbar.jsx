'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-[0_2px_10px_rgba(0,0,0,0.1)] sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto py-4 px-5 flex justify-between items-center">
        <Link 
          href="/home" 
          className="text-3xl font-bold text-white no-underline flex items-center gap-2.5 transition-transform duration-300 hover:scale-105"
        >
          EcoScan
        </Link>

        <ul className="flex list-none gap-2.5 m-0 p-0">
          <li className="m-0">
            <Link 
              href="/home" 
              className={`text-white no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/home') 
                  ? 'bg-white text-[#667eea] font-semibold' 
                  : 'hover:bg-white/20'
              }`}
            >
              Home
            </Link>
          </li>
          <li className="m-0">
            <Link 
              href="/scan" 
              className={`text-white no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/scan') 
                  ? 'bg-white text-[#667eea] font-semibold' 
                  : 'hover:bg-white/20'
              }`}
            >
              Scan
            </Link>
          </li>
          <li className="m-0">
            <Link 
              href="/about" 
              className={`text-white no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/about') 
                  ? 'bg-white text-[#667eea] font-semibold' 
                  : 'hover:bg-white/20'
              }`}
            >
              Tentang
            </Link>
          </li>
          <li className="m-0">
            <Link 
              href="/profile" 
              className={`text-white no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/profile') 
                  ? 'bg-white text-[#667eea] font-semibold' 
                  : 'hover:bg-white/20'
              }`}
            >
              Profile
            </Link>
          </li>
          <li className="m-0">
            <Link 
              href="/login" 
              className={`text-white no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/login') 
                  ? 'bg-white text-[#667eea] font-semibold' 
                  : 'hover:bg-white/20'
              }`}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
