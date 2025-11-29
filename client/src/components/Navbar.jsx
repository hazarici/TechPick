import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  // State to track if the mobile menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close the menu (used when a link is clicked)
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav>
      {/* Left side of the navbar: brand/logo */}
      <div className="nav-left">
        <h1>
          <Link to="/" onClick={closeMenu}>TechPick</Link>
        </h1>
      </div>

      {/* Hamburger button for mobile menu */}
      <button 
        className="hamburger" 
        onClick={() => setMenuOpen(!menuOpen)} // Toggle menu open/close
        aria-label="Toggle menu" // Accessibility label
        aria-expanded={menuOpen} // Accessibility: indicates if menu is open
      >
        ☰
      </button>

      {/* Navigation links */}
      {/* `menuOpen` class controls CSS for showing/hiding mobile menu */}
      <ul className={`menu-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/ready-systems" onClick={closeMenu}>Ready Systems</Link>
        </li>
        <li>
          <Link to="/components" onClick={closeMenu}>Components</Link>
        </li>
        <li>
          <Link to="/user" onClick={closeMenu}>
            <span role="img" aria-label="user">👤</span> User
          </Link>
        </li>
        <li>
          <Link to="/cart" onClick={closeMenu}>
            <span role="img" aria-label="cart">🛒</span> Cart
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
