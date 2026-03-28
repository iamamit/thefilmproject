import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { useUnreadCount } from '../../../hooks/useUnreadCount';
import './Navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');
  const profilePhoto = localStorage.getItem('profilePhoto');
  const unreadCount = useUnreadCount();

  const handleBellClick = () => navigate('/notifications');

  const logout = () => {
    localStorage.clear();
    document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/home',        icon: '🏠', label: 'Home',     authOnly: true },
    { to: '/discover',    icon: '🧭', label: 'Discover', authOnly: false },
    { to: '/connections', icon: '🤝', label: 'Network',  authOnly: true },
    { to: '/messages',    icon: '💬', label: 'Messages', authOnly: true },
  ].filter(l => !l.authOnly || token);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to={token ? '/home' : '/discover'} className="navbar__logo">
          <span className="navbar__logo-icon">🎬</span>
          <span className="navbar__logo-text">CollabNow</span>
        </Link>
        <div className="navbar__search">
          <span className="navbar__search-icon">🔍</span>
          <input placeholder="Search creators..." className="navbar__search-input" />
        </div>
      </div>

      <div className="navbar__links">
        {navLinks.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`navbar__link ${isActive(to) ? 'navbar__link--active' : 'navbar__link--inactive'}`}
          >
            <span className="navbar__link-icon">{icon}</span>
            <span className="navbar__link-label">{label}</span>
          </Link>
        ))}
      </div>

      <div className="navbar__right">
        <button onClick={toggleTheme} className="navbar__theme-btn">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {token ? (
          <>
            <div onClick={handleBellClick} className="navbar__bell">
              <span className="navbar__bell-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="navbar__bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </div>
            <Link
              to={`/profile/${username}`}
              className={`navbar__profile-link ${isActive(`/profile/${username}`) ? 'navbar__profile-link--active' : 'navbar__profile-link--inactive'}`}
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="me" className="navbar__profile-photo" />
              ) : (
                <div className="navbar__profile-initial">
                  {(fullName || username)?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="navbar__profile-me-label">Me</span>
            </Link>
            <button onClick={logout} className="navbar__btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link-signin">Sign in</Link>
            <Link to="/register" className="navbar__link-join">Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}
