import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ROLES = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];
const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Bengali', 'Marathi', 'Kannada', 'Punjabi', 'English'];

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', bio: '', city: '', country: 'India',
    roles: [], languages: [], availableForWork: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/users/me').then(res => {
      const u = res.data;
      setForm({
        fullName: u.fullName || '',
        bio: u.bio || '',
        city: u.city || '',
        country: u.country || 'India',
        roles: u.roles || [],
        languages: u.languages || [],
        availableForWork: u.availableForWork
      });
      setLoading(false);
    });
  }, []);

  const toggleRole = (role) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const toggleLanguage = (lang) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.put('/users/me', form);
      setMessage('Profile updated! ✅');
      setTimeout(() => navigate(`/profile/${localStorage.getItem('username')}`), 1000);
    } catch (err) {
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading...</p>
    </div>
  );

  const inputStyle = { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', boxSizing: 'border-box', fontSize: '0.95rem' };
  const labelStyle = { color: '#aaa', display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem' };
  const sectionStyle = { background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #2a2a4a' };

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Edit Profile</h2>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Update your creator profile</p>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#e94560', marginBottom: '1.2rem' }}>Basic Info</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Bio / Tagline</label>
            <input style={inputStyle} placeholder="e.g. Independent filmmaker based in Mumbai"
              value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input style={inputStyle} value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <input type="checkbox" id="available" checked={form.availableForWork}
              onChange={e => setForm({ ...form, availableForWork: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            <label htmlFor="available" style={{ color: '#aaa', cursor: 'pointer' }}>Available for work</label>
          </div>
        </div>

        {/* Roles */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#e94560', marginBottom: '1.2rem' }}>Your Roles</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ROLES.map(role => (
              <button key={role} onClick={() => toggleRole(role)} style={{
                padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer',
                border: '1px solid #e94560', fontSize: '0.85rem',
                background: form.roles.includes(role) ? '#e94560' : 'transparent',
                color: '#fff'
              }}>{role.replace('_', ' ')}</button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#e94560', marginBottom: '1.2rem' }}>Languages You Work In</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {LANGUAGES.map(lang => (
              <button key={lang} onClick={() => toggleLanguage(lang)} style={{
                padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer',
                border: '1px solid #4a90e2', fontSize: '0.85rem',
                background: form.languages.includes(lang) ? '#4a90e2' : 'transparent',
                color: '#fff'
              }}>{lang}</button>
            ))}
          </div>
        </div>

        {/* Save */}
        {message && <p style={{ color: message.includes('✅') ? '#4caf50' : '#e94560', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', padding: '0.9rem', background: '#e94560',
          color: '#fff', border: 'none', borderRadius: '8px',
          fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold'
        }}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
