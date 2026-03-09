import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ROLES = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', fullName: '',
    username: '', city: '', country: 'India', roles: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleRole = (role) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.roles.length === 0) { setError('Please select at least one role'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('fullName', res.data.fullName);
      navigate('/discover');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const input = (label, field, type = 'text') => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ color: '#aaa', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
      <input
        type={type} required
        value={form[field]}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', boxSizing: 'border-box' }}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#1a1a2e', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '480px' }}>
        <h2 style={{ color: '#fff', marginBottom: '0.5rem', textAlign: 'center' }}>Join TheFilmProject 🎬</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem' }}>Create your creator profile</p>

        {error && <p style={{ color: '#e94560', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {input('Full Name', 'fullName')}
          {input('Username', 'username')}
          {input('Email', 'email', 'email')}
          {input('Password', 'password', 'password')}
          {input('City', 'city')}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.8rem' }}>Your Roles (select all that apply)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ROLES.map(role => (
                <button
                  key={role} type="button"
                  onClick={() => toggleRole(role)}
                  style={{
                    padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer',
                    border: '1px solid #e94560', fontSize: '0.85rem',
                    background: form.roles.includes(role) ? '#e94560' : 'transparent',
                    color: '#fff'
                  }}
                >
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.8rem', background: '#e94560',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold'
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ color: '#888', textAlign: 'center', marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#e94560' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
