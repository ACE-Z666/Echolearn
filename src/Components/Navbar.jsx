import React from 'react';
import { Link } from 'react-router-dom';
import LogoM from "../assets/logos/pnglogo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={LogoM} alt="Echolearn Logo" className="logo-image" />
        </Link>
        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/chat" className="nav-link">Chat</Link>
          <Link to="/upload" className="nav-link">Upload</Link>
        </div>
        <div className="nav-right">
          <Link to="/signup" className="nav-button">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
