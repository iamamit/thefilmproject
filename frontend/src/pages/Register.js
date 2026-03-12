import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ROLES = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati'];

const roleColors = {
  DIRECTOR: '#0a66c2', EDITOR: '#0073b1', MUSICIAN: '#9b59b6',
  PRODUCER: '#f39c12', ACTOR: '#1abc9c', CINEMATOGRAPHER: '#e67e22',
  VFX_ARTIST: '#3498db', WRITER: '#2ecc71'
};

function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', username: '',
    roles: [], city: '', country: 'India', languages: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field, value) => setForm({ ...form, [field]: value });

  const toggleRole = (role) => {
    update('roles', form.roles.includes(role)
      ? form.roles.filter(r => r !== role)
      : [...form.roles, role]);
  };

  const toggleLang = (lang) => {
    update('languages', form.languages.includes(lang)
      ? form.languages.filter(l => l !== lang)
      : [...form.languages, lang]);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.fullName || !form.email || !form.password || !form.username) {
        setError('Please fill in all fields'); return;
      }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    }
    if (step === 2 && form.roles.length === 0) {
      setError('Please select at least one role'); return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('fullName', res.data.fullName);
      localStorage.setItem('userId', res.data.id);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
      setStep(1);
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '6px',
    border: '1px solid #c0c0c0', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'inherit', color: '#1a1a1a', background: '#fff',
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
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Already on TheFilmProject?</span>
          <Link to="/login" style={{
            border: '1px solid var(--accent)', color: 'var(--accent)',
            padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600',
          }}>Sign in</Link>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          background: 'var(--bg-card)', borderRadius: '12px',
          border: '1px solid var(--border)', padding: '2rem',
          width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow)',
        }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: s <= step ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.3rem' }}>
            {step === 1 ? 'Create your account' : step === 2 ? 'What do you create?' : 'Almost done!'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {step === 1 ? 'Join India\'s film creator network' : step === 2 ? 'Select your roles (choose all that apply)' : 'A few more details'}
          </p>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '0.7rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
                  <input value={form.fullName} onChange={e => update('fullName', e.target.value)}
                    placeholder="Raj Sharma" style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                    onBlur={e => e.target.style.border = '1px solid #c0c0c0'} />
                </div>
                <div>
                  <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Username</label>
                  <input value={form.username} onChange={e => update('username', e.target.value.toLowerCase())}
                    placeholder="rajsharma" style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                    onBlur={e => e.target.style.border = '1px solid #c0c0c0'} />
                </div>
              </div>
              <div>
                <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="raj@example.com" style={inputStyle}
                  onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                  onBlur={e => e.target.style.border = '1px solid #c0c0c0'} />
              </div>
              <div>
                <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Password</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min. 6 characters" style={inputStyle}
                  onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                  onBlur={e => e.target.style.border = '1px solid #c0c0c0'} />
              </div>
              <button onClick={nextStep} style={{
                width: '100%', padding: '0.8rem', borderRadius: '24px',
                background: 'var(--accent)', color: '#fff', border: 'none',
                fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem',
              }}>Continue →</button>
            </div>
          )}

          {/* Step 2 - Roles */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {ROLES.map(role => {
                  const selected = form.roles.includes(role);
                  const color = roleColors[role];
                  return (
                    <button key={role} onClick={() => toggleRole(role)} style={{
                      padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer',
                      border: `1px solid ${selected ? color : 'var(--border)'}`,
                      background: selected ? `${color}18` : 'var(--bg-primary)',
                      color: selected ? color : 'var(--text-secondary)',
                      fontSize: '0.875rem', fontWeight: selected ? '600' : '400',
                      transition: 'all 0.2s',
                    }}>{role.replace('_', ' ')}</button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '0.8rem', borderRadius: '24px',
                  background: 'transparent', color: 'var(--text-secondary)',
                  border: '1px solid var(--border)', fontSize: '0.95rem', cursor: 'pointer',
                }}>← Back</button>
                <button onClick={nextStep} style={{
                  flex: 2, padding: '0.8rem', borderRadius: '24px',
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
                }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3 - Location & Languages */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>City</label>
                  <input value={form.city} onChange={e => update('city', e.target.value)}
                    placeholder="Mumbai" style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                    onBlur={e => e.target.style.border = '1px solid #c0c0c0'} />
                </div>
                <div>
                  <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Country</label>
                  <input value={form.country} onChange={e => update('country', e.target.value)}
                    placeholder="India" style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                    onBlur={e => e.target.style.border = '1px solid #c0c0c0'} />
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.6rem' }}>Languages (optional)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {LANGUAGES.map(lang => {
                    const selected = form.languages.includes(lang);
                    return (
                      <button key={lang} onClick={() => toggleLang(lang)} style={{
                        padding: '0.35rem 0.8rem', borderRadius: '20px', cursor: 'pointer',
                        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                        background: selected ? 'var(--accent)' : 'var(--bg-primary)',
                        color: selected ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.8rem', transition: 'all 0.2s',
                      }}>{lang}</button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button onClick={() => setStep(2)} style={{
                  flex: 1, padding: '0.8rem', borderRadius: '24px',
                  background: 'transparent', color: 'var(--text-secondary)',
                  border: '1px solid var(--border)', fontSize: '0.95rem', cursor: 'pointer',
                }}>← Back</button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  flex: 2, padding: '0.8rem', borderRadius: '24px',
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  fontSize: '0.95rem', fontWeight: '600', cursor: loading ? 'default' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}>{loading ? 'Creating account...' : '🎬 Join TheFilmProject'}</button>
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            By joining, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
