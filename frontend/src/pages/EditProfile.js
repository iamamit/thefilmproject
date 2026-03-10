import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ROLES = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];
const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Bengali', 'Marathi', 'Kannada', 'Punjabi', 'English'];
const SKILL_CATEGORIES = ['SOFTWARE', 'INSTRUMENT', 'TECHNIQUE', 'OTHER'];
const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', bio: '', city: '', country: 'India',
    roles: [], languages: [], availableForWork: true
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'SOFTWARE', level: 'INTERMEDIATE' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/users/me'),
      api.get('/skills')
    ]).then(([userRes, skillsRes]) => {
      const u = userRes.data;
      setForm({
        fullName: u.fullName || '',
        bio: u.bio || '',
        city: u.city || '',
        country: u.country || 'India',
        roles: u.roles || [],
        languages: u.languages || [],
        availableForWork: u.availableForWork
      });
      setSkills(skillsRes.data);
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

  const addSkill = async () => {
    if (!newSkill.name.trim()) return;
    try {
      const res = await api.post('/skills', newSkill);
      setSkills([...skills, res.data]);
      setNewSkill({ name: '', category: 'SOFTWARE', level: 'INTERMEDIATE' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
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
  const selectStyle = { padding: '0.6rem', borderRadius: '8px', border: '1px solid #333', background: '#0f0f1a', color: '#fff', fontSize: '0.9rem' };

  const levelColors = { BEGINNER: '#4a90e2', INTERMEDIATE: '#f5a623', EXPERT: '#4caf50' };

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

        {/* Skills */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#e94560', marginBottom: '1.2rem' }}>Skills & Tools</h3>

          {/* Add skill form */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            <input
              placeholder="Skill name (e.g. Premiere Pro)"
              value={newSkill.name}
              onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              style={{ ...inputStyle, flex: 1, minWidth: '160px' }}
            />
            <select value={newSkill.category}
              onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
              style={selectStyle}>
              {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={newSkill.level}
              onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
              style={selectStyle}>
              {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button onClick={addSkill} style={{
              background: '#e94560', color: '#fff', border: 'none',
              padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}>+ Add</button>
          </div>

          {/* Skills list */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.map(skill => (
              <div key={skill.id} style={{
                background: '#0f0f1a', border: `1px solid ${levelColors[skill.level] || '#444'}`,
                borderRadius: '20px', padding: '0.3rem 0.8rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <span style={{ color: '#fff', fontSize: '0.85rem' }}>{skill.name}</span>
                <span style={{ color: levelColors[skill.level], fontSize: '0.75rem' }}>{skill.level}</span>
                <button onClick={() => deleteSkill(skill.id)} style={{
                  background: 'none', border: 'none', color: '#666',
                  cursor: 'pointer', fontSize: '0.9rem', padding: 0
                }}>✕</button>
              </div>
            ))}
            {skills.length === 0 && <p style={{ color: '#666', fontSize: '0.9rem' }}>No skills added yet</p>}
          </div>
        </div>

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
