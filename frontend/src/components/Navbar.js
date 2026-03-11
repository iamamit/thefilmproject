import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1a1a2e',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/discover" style={{ color: '#e94560', fontWeight: 'bold', fontSize: '1.4rem', textDecoration: 'none' }}>
        🎬 TheFilmProject
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/discover" style={{ color: '#fff', textDecoration: 'none' }}>Discover</Link>
        {token ? (
          <>
            <Link to="/connections" style={{ color: '#fff', textDecoration: 'none' }}>🤝 Network</Link>
            <Link to="/messages" style={{ color: '#fff', textDecoration: 'none' }}>💬 Messages</Link>
            <Link to={`/profile/${username}`} style={{ color: '#fff', textDecoration: 'none' }}>My Profile</Link>
            <button onClick={logout} style={{
              background: '#e94560', color: '#fff', border: 'none',
              padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{
              background: '#e94560', color: '#fff', padding: '0.4rem 1rem',
              borderRadius: '20px', textDecoration: 'none'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
