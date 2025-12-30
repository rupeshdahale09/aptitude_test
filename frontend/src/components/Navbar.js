import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Aptitude Test Platform
          </Link>
          {user ? (
            <div className="navbar-menu">
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/tests" className="navbar-link">
                Tests
              </Link>
              <Link to="/leaderboard" className="navbar-link">
                Leaderboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="navbar-link">
                  Admin Panel
                </Link>
              )}
              <span className="navbar-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-menu">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


