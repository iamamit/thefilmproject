import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('fullName', res.data.fullName);
      navigate('/discover');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ color: '#fff', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back 🎬</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem' }}>Sign in to TheFilmProject</p>

        {error && <p style={{ color: '#e94560', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.8rem', background: '#e94560',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: '#888', textAlign: 'center', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#e94560' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
