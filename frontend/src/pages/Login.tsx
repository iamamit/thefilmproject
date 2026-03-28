import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { usePageMeta } from '../hooks/usePageMeta';
import './Login.css';

function Login() {
  usePageMeta('Sign In');
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
      if (!payload.exp || payload.exp * 1000 > Date.now()) {
        navigate('/home');
      } else {
        localStorage.removeItem('token');
      }
    } catch {
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
    } catch {
      setError('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="login__page">
      <div className="login__topbar">
        <Link to="/" className="login__logo">
          <span className="login__logo-icon">🎬</span>
          <span className="login__logo-name">CollabNow</span>
        </Link>
        <div className="login__topbar-nav">
          <span className="login__topbar-hint">New to CollabNow?</span>
          <Link to="/register" className="login__topbar-link">Join now</Link>
        </div>
      </div>

      <div className="login__main">
        <div className="login__branding">
          <div>
            <h1 className="login__headline">
              Welcome to your<br />
              <span className="login__headline-accent">creative community</span>
            </h1>
            <p className="login__tagline">
              Connect with directors, editors, musicians, and more from India's film industry.
            </p>
          </div>

          <div className="login__features">
            {[
              { icon: '🎬', title: 'Find collaborators', desc: 'Connect with 100+ creators across India' },
              { icon: '💬', title: 'Message directly',   desc: 'Chat with your connections instantly' },
              { icon: '📢', title: 'Share your work',    desc: 'Post updates, projects and opportunities' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="login__feature">
                <span className="login__feature-icon">{icon}</span>
                <div>
                  <p className="login__feature-title">{title}</p>
                  <p className="login__feature-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="login__card">
          <h2 className="login__card-title">Sign in</h2>
          <p className="login__card-subtitle">Stay updated on your creative world</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="login__form">
            <div>
              <label className="login__label">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your email"
                className="login__input"
              />
            </div>
            <div>
              <label className="login__label">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your password"
                className="login__input"
              />
              <div className="login__forgot-row">
                <Link to="/forgot-password" className="login__forgot-link">Forgot password?</Link>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`login__btn${loading ? ' login__btn--loading' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="login__divider">
              <div className="login__divider-line" />
              <span className="login__divider-text">or</span>
            </div>

            <p className="login__register-prompt">
              New to CollabNow?{' '}
              <Link to="/register" className="login__register-link">Join now</Link>
            </p>
          </div>

          <div className="login__google-section">
            <div className="login__google-divider">
              <div className="login__google-divider-bar" />
              <span className="login__google-divider-text">or</span>
              <div className="login__google-divider-bar" />
            </div>
            <a
              href={`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`}
              className="login__google-btn"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="login__google-icon" />
              Continue with Google
            </a>
          </div>

          <p className="login__legal">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="login__legal-link">Terms</Link>
            {' '}&{' '}
            <Link to="/privacy" className="login__legal-link">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
