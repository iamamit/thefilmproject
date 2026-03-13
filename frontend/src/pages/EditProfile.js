import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Avatar from '../components/AvatarUpload';

const ROLES = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati'];
const roleColors = {
  DIRECTOR: '#0a66c2', EDITOR: '#0073b1', MUSICIAN: '#9b59b6',
  PRODUCER: '#f39c12', ACTOR: '#1abc9c', CINEMATOGRAPHER: '#e67e22',
  VFX_ARTIST: '#3498db', WRITER: '#2ecc71'
};

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ fullName: '', bio: '', city: '', country: '', availableForWork: true, roles: [], languages: [] });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: 'BEGINNER' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, skillsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/skills'),
        ]);
        setUser(userRes.data);
        setForm({
          fullName: userRes.data.fullName || '',
          bio: userRes.data.bio || '',
          city: userRes.data.city || '',
          country: userRes.data.country || '',
          availableForWork: userRes.data.availableForWork,
          roles: userRes.data.roles || [],
          languages: userRes.data.languages || [],
        });
        setSkills(skillsRes.data);
      } catch (err) {
        console.error(err);
        // If not authenticated, send user back to login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const toggleRole = (role) => {
    setForm(f => ({ ...f, roles: f.roles.includes(role) ? f.roles.filter(r => r !== role) : [...f.roles, role] }));
  };

  const toggleLang = (lang) => {
    setForm(f => ({ ...f, languages: f.languages.includes(lang) ? f.languages.filter(l => l !== lang) : [...f.languages, lang] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/me', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { alert('Save failed'); }
    finally { setSaving(false); }
  };

  const addSkill = async () => {
    if (!newSkill.name.trim()) return;
    try {
      const res = await api.post('/skills', { ...newSkill, category: newSkill.category || 'GENERAL' });
      setSkills([...skills, res.data]);
      setNewSkill({ name: '', category: '', level: 'BEGINNER' });
    } catch {}
  };

  const deleteSkill = async (id) => {
    try { await api.delete(`/skills/${id}`); setSkills(skills.filter(s => s.id !== id)); }
    catch {}
  };

  const handlePhotoUpdated = (newPhoto) => {
    setUser(prev => ({ ...prev, profilePhotoUrl: newPhoto }));
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
  };

  const card = {
    background: 'var(--bg-card)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1rem',
  };

  if (!user) return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>Edit Profile</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.2rem 0 0' }}>Update your creator profile</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button onClick={() => navigate(`/profile/${username}`)} style={{
              background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)',
              padding: '0.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem',
            }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{
              background: saved ? '#2ecc71' : 'var(--accent)', color: '#fff', border: 'none',
              padding: '0.5rem 1.5rem', borderRadius: '20px', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: '600', transition: 'background 0.3s',
            }}>{saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>

        {/* Photo Card */}
        <div style={card}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Profile Photo</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Avatar user={user} size={80} editable={true} onUpdated={handlePhotoUpdated} />
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: '500', margin: '0 0 0.3rem' }}>Click the photo to update</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>JPG, PNG or GIF · Max 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div style={card}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>Basic Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
              <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your full name" style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                onBlur={e => e.target.style.border = '1px solid var(--border)'} />
            </div>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Bio / Tagline</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="e.g. Independent filmmaker based in Mumbai"
                rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                onBlur={e => e.target.style.border = '1px solid var(--border)'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Mumbai" style={inputStyle}
                  onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                  onBlur={e => e.target.style.border = '1px solid var(--border)'} />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.4rem' }}>Country</label>
                <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                  placeholder="India" style={inputStyle}
                  onFocus={e => e.target.style.border = '1px solid var(--accent)'}
                  onBlur={e => e.target.style.border = '1px solid var(--border)'} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.availableForWork}
                onChange={e => setForm({ ...form, availableForWork: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Available for work</span>
            </label>
          </div>
        </div>

        {/* Roles */}
        <div style={card}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Your Roles</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {ROLES.map(role => {
              const selected = form.roles.includes(role);
              const color = roleColors[role];
              return (
                <button key={role} onClick={() => toggleRole(role)} style={{
                  padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer',
                  border: `1px solid ${selected ? color : 'var(--border)'}`,
                  background: selected ? `${color}18` : 'transparent',
                  color: selected ? color : 'var(--text-secondary)',
                  fontSize: '0.85rem', fontWeight: selected ? '600' : '400',
                  transition: 'all 0.2s',
                }}>{role.replace('_', ' ')}</button>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div style={card}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Languages</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {LANGUAGES.map(lang => {
              const selected = form.languages.includes(lang);
              return (
                <button key={lang} onClick={() => toggleLang(lang)} style={{
                  padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer',
                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                  background: selected ? 'var(--accent)' : 'transparent',
                  color: selected ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.85rem', transition: 'all 0.2s',
                }}>{lang}</button>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div style={card}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Skills & Tools</h2>

          {/* Existing skills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem' }}>
            {skills.map(skill => (
              <div key={skill.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.3rem 0.6rem 0.3rem 0.8rem',
              }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{skill.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{skill.level}</span>
                <button onClick={() => deleteSkill(skill.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0 2px',
                }}>✕</button>
              </div>
            ))}
            {skills.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills added yet</p>}
          </div>

          {/* Add skill */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="e.g. Final Cut Pro" style={{ ...inputStyle, flex: 2, minWidth: '140px' }}
              onFocus={e => e.target.style.border = '1px solid var(--accent)'}
              onBlur={e => e.target.style.border = '1px solid var(--border)'} />
            <select value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
              style={{ ...inputStyle, flex: 1, minWidth: '110px' }}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
            <button onClick={addSkill} style={{
              background: 'var(--accent)', color: '#fff', border: 'none',
              padding: '0.7rem 1.2rem', borderRadius: '8px', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap',
            }}>+ Add</button>
          </div>
        </div>

        {/* Bottom Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', paddingBottom: '2rem' }}>
          <button onClick={() => navigate(`/profile/${username}`)} style={{
            background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)',
            padding: '0.6rem 1.5rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            background: saved ? '#2ecc71' : 'var(--accent)', color: '#fff', border: 'none',
            padding: '0.6rem 1.8rem', borderRadius: '20px', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: '600',
          }}>{saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
