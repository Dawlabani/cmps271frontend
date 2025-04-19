// src/components/NavBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import Button from '../Dashboard/Button';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  // for protected modals
  const [showProtectedModal, setShowProtectedModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // for mobile hamburger
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProtectedNavigation = (route) => {
    if (isLoggedIn) {
      navigate(route);
      setMobileOpen(false);
    } else {
      setShowProtectedModal(true);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <h2 onClick={() => { navigate('/'); setMobileOpen(false); }}>
            SDG Finance
          </h2>
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(m => !m)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <button onClick={() => { navigate('/'); setMobileOpen(false); }}>
            Home
          </button>
          <button onClick={() => handleProtectedNavigation('/dashboard')}>
            Dashboard
          </button>
          <button onClick={() => handleProtectedNavigation('/budget')}>
            Budget
          </button>
          <button onClick={() => handleProtectedNavigation('/rewards')}>
            Rewards
          </button>
          <button onClick={() => handleProtectedNavigation('/chatbot')}>
            ChatBot
          </button>
        </div>

        <div className="navbar-action">
          {isLoggedIn ? (
            <Button
              text="Profile"
              className="navbar-profile-button"
              onClick={() => { navigate('/profile'); setMobileOpen(false); }}
            />
          ) : (
            <Button
              text="Join Now"
              className="navbar-join-button"
              onClick={() => setShowJoinModal(true)}
            />
          )}
        </div>
      </nav>

      {/* Protected Navigation Modal */}
      {showProtectedModal && (
        <div className="signin-modal-overlay">
          <div className="signin-modal-content">
            <h3>Please Sign In</h3>
            <p>You must be signed in to access this feature.</p>
            <div className="signin-modal-buttons">
              <Button
                text="Sign In"
                className="signin-modal-signin-button"
                onClick={() => {
                  navigate('/login');
                  setShowProtectedModal(false);
                }}
              />
              <Button
                text="Cancel"
                className="signin-modal-cancel-button"
                onClick={() => setShowProtectedModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Join Now Modal */}
      {showJoinModal && (
        <div className="join-modal-overlay">
          <div className="join-modal-content">
            <h3>Welcome!</h3>
            <p>Please choose an option to continue:</p>
            <div className="join-modal-buttons">
              <Button
                text="Sign In"
                className="join-modal-signin-button"
                onClick={() => {
                  navigate('/login');
                  setShowJoinModal(false);
                }}
              />
              <Button
                text="Sign Up"
                className="join-modal-signup-button"
                onClick={() => {
                  navigate('/signup');
                  setShowJoinModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;