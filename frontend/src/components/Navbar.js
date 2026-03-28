import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';
import { useTheme } from '../ThemeContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications/unread-count');
        setUnreadCount(res.data.count);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  const handleBellClick = () => {
    setUnreadCount(0);
    navigate('/notifications');
  };

  const logout = () => {
    localStorage.clear();
    document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/home', icon: '🏠', label: 'Home', authOnly: true },
    { to: '/discover', icon: '🧭', label: 'Discover', authOnly: false },
    { to: '/connections', icon: '🤝', label: 'Network', authOnly: true },
    { to: '/messages', icon: '💬', label: 'Messages', authOnly: true },
  ].filter(l => !l.authOnly || token);

  return (
    <nav className="navbar">

      {/* Left - Logo + Search */}
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

      {/* Center - Nav Links */}
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

      {/* Right - Theme + Profile */}
      <div className="navbar__right">
        <button onClick={toggleTheme} className="navbar__theme-btn">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {token ? (
          <>
            {/* Bell icon */}
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
              {localStorage.getItem('profilePhoto') ? (
                <img src={localStorage.getItem('profilePhoto')} alt="me" className="navbar__profile-photo" />
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

export default Navbar;
