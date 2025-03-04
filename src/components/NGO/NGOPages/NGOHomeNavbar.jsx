// src/NGOHomeNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NGOHomeNavbar.css'; // Import the custom CSS

const NGOHomeNavbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication status and navigate to home
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="ngo-navbar">
      <div className="ngo-navbar-container">
        {/* Left Section - Logo */}
        <div className="ngo-navbar-left">
          <Link to="/ngohome" className="ngo-navbar-brand">
            <img src="/logo.png" alt="Logo" className="ngo-navbar-logo" />
          </Link>
        </div>

        {/* Center Section - Navigation Links */}
        <div className="ngo-navbar-center">
          <Link to="/ngohome" className="ngo-nav-link">Home</Link>
          <Link to="/add-worker" className="ngo-nav-link">Add Worker</Link>
          <Link to="/search-worker" className="ngo-nav-link">Search Worker</Link>
        </div>

        {/* Right Section - Logout Button */}
        <div className="ngo-navbar-right">
          <button className="ngo-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NGOHomeNavbar;
