import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');

  const logout = () => {
    localStorage.clear();
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
    <nav style={{
      background: 'var(--bg-card)',
      padding: '0 2rem',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
    }}>

      {/* Left - Logo + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to={token ? '/home' : '/discover'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🎬</span>
          <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>TFP</span>
        </Link>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--bg-primary)', borderRadius: '6px',
          padding: '0.4rem 0.8rem', border: '1px solid var(--border)',
          minWidth: '200px'
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>🔍</span>
          <input placeholder="Search creators..." style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%',
          }} />
        </div>
      </div>

      {/* Center - Nav Links */}
      <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
        {navLinks.map(({ to, icon, label }) => (
          <Link key={to} to={to} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '0.3rem 1rem', textDecoration: 'none', gap: '0.1rem',
            borderBottom: isActive(to) ? '2px solid var(--accent)' : '2px solid transparent',
            color: isActive(to) ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'all 0.2s', minWidth: '60px', height: '56px', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>{label}</span>
          </Link>
        ))}
      </div>

      {/* Right - Theme + Profile */}
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        <button onClick={toggleTheme} style={{
          background: 'var(--bg-primary)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '0.35rem 0.7rem',
          cursor: 'pointer', fontSize: '1rem', color: 'var(--text-primary)',
        }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {token ? (
          <>
            <Link to={`/profile/${username}`} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '0.1rem', textDecoration: 'none',
              color: isActive(`/profile/${username}`) ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: isActive(`/profile/${username}`) ? '2px solid var(--accent)' : '2px solid transparent',
              padding: '0.3rem 0.8rem', height: '56px', justifyContent: 'center',
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'var(--accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: '#fff'
              }}>{(fullName || username)?.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Me</span>
            </Link>
            <button onClick={logout} style={{
              background: 'transparent', color: 'var(--text-secondary)',
              border: '1px solid var(--border)', padding: '0.35rem 0.8rem',
              borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500',
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: 'var(--accent)', border: '1px solid var(--accent)',
              padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
            }}>Sign in</Link>
            <Link to="/register" style={{
              background: 'var(--accent)', color: '#fff', padding: '0.35rem 1rem',
              borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600',
            }}>Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
