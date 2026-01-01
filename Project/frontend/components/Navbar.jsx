'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navbar.css';

function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/home" className="navbar-logo">
          EcoScan
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link href="/home" className={`nav-link ${isActive('/home')}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/scan" className={`nav-link ${isActive('/scan')}`}>
              Scan
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/about" className={`nav-link ${isActive('/about')}`}>
              Tentang
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
