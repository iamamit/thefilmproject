import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const parts = token.split('.');
      if (parts.length < 2) { localStorage.removeItem('token'); return; }
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      // If token has exp claim, ensure it's in the future (exp is seconds)
      if (!payload.exp || payload.exp * 1000 > Date.now()) {
        navigate('/home');
      } else {
        // expired token: clear and stay on login
        localStorage.removeItem('token');
      }
    } catch (e) {
      localStorage.removeItem('token');
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('fullName', res.data.fullName);
      localStorage.setItem('userId', res.data.id);
      if (res.data.profilePhotoUrl) localStorage.setItem('profilePhoto', res.data.profilePhotoUrl);
      else localStorage.removeItem('profilePhoto');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '6px',
    border: '1px solid #c0c0c0', fontSize: '1rem', outline: 'none',
    transition: 'border 0.2s', fontFamily: 'inherit', color: '#1a1a1a',
    background: '#fff',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top bar */}
      <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem' }}>🎬</span>
          <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '1.2rem' }}>TheFilmProject</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>New to TheFilmProject?</span>
          <Link to="/register" style={{
            border: '1px solid var(--accent)', color: 'var(--accent)',
            padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600',
          }}>Join now</Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '5rem' }}>
        
        {/* Left - Branding */}
        <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '2.2rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '0.5rem' }}>
              Welcome to your<br />
              <span style={{ color: 'var(--accent)' }}>creative community</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
              Connect with directors, editors, musicians, and more from India's film industry.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {[
              { icon: '🎬', title: 'Find collaborators', desc: 'Connect with 100+ creators across India' },
              { icon: '💬', title: 'Message directly', desc: 'Chat with your connections instantly' },
              { icon: '📢', title: 'Share your work', desc: 'Post updates, projects and opportunities' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>{title}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '12px',
          border: '1px solid var(--border)', padding: '2rem',
          width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow)',
        }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.3rem' }}>Sign in</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Stay updated on your creative world</p>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '0.7rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your email"
                style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                onBlur={e => e.target.style.border = '1px solid #c0c0c0'}
              />
            </div>
            <div>
              <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your password"
                style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                onBlur={e => e.target.style.border = '1px solid #c0c0c0'}
              />
            </div>

            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '0.8rem', borderRadius: '24px',
              background: 'var(--accent)', color: '#fff', border: 'none',
              fontSize: '1rem', fontWeight: '600', cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: '0.5rem',
            }}>{loading ? 'Signing in...' : 'Sign in'}</button>

            <div style={{ textAlign: 'center', position: 'relative', margin: '0.5rem 0' }}>
              <div style={{ borderTop: '1px solid var(--border)', position: 'absolute', top: '50%', width: '100%' }} />
              <span style={{ background: 'var(--bg-card)', padding: '0 0.8rem', color: 'var(--text-muted)', fontSize: '0.85rem', position: 'relative' }}>or</span>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              New to TheFilmProject?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>Join now</Link>
            </p>
          </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
          <a href="http://localhost:8080/oauth2/authorization/google" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
            background: '#fff', color: '#333', border: '1px solid #ddd',
            borderRadius: '8px', padding: '0.7rem 1rem', textDecoration: 'none',
            fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer',
          }}>
            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px' }} />
            Continue with Google
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
