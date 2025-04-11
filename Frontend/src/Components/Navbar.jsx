import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoM from "../assets/logos/pnglogo.png";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={LogoM} alt="Echolearn Logo" className="logo-image" />
        </Link>
        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/chatit" className="nav-link">EchoAI</Link>
          <Link to="/fcards" className="nav-link">FlashCards</Link>
          <Link to="/pdf" className="nav-link">SummarizePDF</Link>
          <Link to="/motivator" className="nav-link">Motivator</Link>

          {isAuthenticated && (
            <>
              <Link to="/chatit" className="nav-link">Chat</Link>
              <Link to="/pdf" className="nav-link">Upload</Link>
              <Link to="/fcards" className="nav-link">Flash Cards</Link>
              <Link to="/questions" className="nav-link">Questions</Link>
              <Link to="/timetable" className="nav-link">Time Table</Link>
              <Link to="/motivator" className="nav-link">Motivator</Link>
            </>
          )}
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-button">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
