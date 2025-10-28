import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ onUploadClick }) => {
  const { currentUser, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header>
      <h1><Link to="/">Sports Club</Link></h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><a href="/#about">About</a></li>
                    <li><a href="/#contact">Contact</a></li>
          <li><Link to="/events">Events</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        {currentUser ? (
          <>
            <button onClick={onUploadClick} className="btn btn-upload">Upload Event</button>
            <div className="profile-container">
              <div className="profile-icon" onClick={() => setShowProfile(!showProfile)}>
                {currentUser.email.charAt(0).toUpperCase()}
              </div>
              {showProfile && (
                <div className="profile-dropdown">
                  <p>{currentUser.email}</p>
                  <button onClick={signOut} className="btn btn-signout">Sign Out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/signin" className="btn btn-signin">Sign In</Link>
            <Link to="/signup" className="btn btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
