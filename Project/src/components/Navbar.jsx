import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          EcoScan
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/home" className={`nav-link ${isActive('/home')}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/scan" className={`nav-link ${isActive('/scan')}`}>
              Scan
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={`nav-link ${isActive('/about')}`}>
              Tentang
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
