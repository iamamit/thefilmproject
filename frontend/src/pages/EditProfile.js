import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Avatar from '../components/AvatarUpload';
import './EditProfile.css';

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
        // If not authenticated, send user back to login (do not remove token here;
        // allow login page or auth flow to handle token clearing to avoid immediate
        // logout on transient failures)
        if (err.response && err.response.status === 401) {
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
  const [deletedSkillIds, setDeletedSkillIds] = useState([]);
  const [newSkills, setNewSkills] = useState([]);


  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/me', form);
      // Delete removed skills
      await Promise.all(deletedSkillIds.map(id => api.delete(`/skills/${id}`).catch(() => {})));
      // Add new skills
      await Promise.all(newSkills.map(s => api.post('/skills', { name: s.name, category: s.category, level: s.level }).catch(() => {})));
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate(`/profile/${username}`); }, 1500);
    } catch (err) { alert('Save failed'); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    const tempSkill = { ...newSkill, category: newSkill.category || 'GENERAL', id: 'new_' + Date.now() };
    setSkills([...skills, tempSkill]);
    setNewSkills([...newSkills, tempSkill]);
    setNewSkill({ name: '', category: '', level: 'BEGINNER' });
  };

  const deleteSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
    if (String(id).startsWith('new_')) {
      setNewSkills(newSkills.filter(s => s.id !== id));
    } else {
      setDeletedSkillIds([...deletedSkillIds, id]);
    }
  };

  const handlePhotoUpdated = (newPhoto) => {
    setUser(prev => ({ ...prev, profilePhotoUrl: newPhoto }));
  };

  const calcCompletion = () => {
    if (!user) return 0;
    const checks = [
      !!user.fullName && user.fullName.trim().length > 0,
      !!user.bio && user.bio.trim().length > 10,
      !!user.city && user.city.trim().length > 0,
      !!user.country && user.country.trim().length > 0,
      Array.isArray(user.roles) && user.roles.length > 0,
      Array.isArray(user.languages) && user.languages.length > 0,
      Array.isArray(skills) && skills.length > 0,
      !!user.profilePhotoUrl && user.profilePhotoUrl.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };
  const completionPct = calcCompletion();

  if (!user) return (
    <div className="edit-profile__loading">
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="edit-profile__page">
      <div className="edit-profile__container">

        {/* Header */}
        <div className="edit-profile__header">
          <div>
            <h1 className="edit-profile__header-title">Edit Profile</h1>
            <p className="edit-profile__header-subtitle">Update your creator profile</p>
          </div>
          <div className="edit-profile__header-actions">
            <button onClick={() => navigate(`/profile/${username}`)} className="edit-profile__btn--cancel">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className={`edit-profile__btn--save ${saved ? 'edit-profile__btn--save--saved' : 'edit-profile__btn--save--default'}`}>
              {saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="edit-profile__completion">
          <div className="edit-profile__completion-row">
            <span className="edit-profile__completion-label">
              Profile {completionPct}% complete
              {completionPct < 100 && ' — complete your profile to get discovered'}
            </span>
            <span className={`edit-profile__completion-pct ${completionPct === 100 ? 'edit-profile__completion-pct--complete' : 'edit-profile__completion-pct--incomplete'}`}>
              {completionPct}%
            </span>
          </div>
          <div className="edit-profile__completion-track">
            {/* width is dynamic — kept inline */}
            <div className={`edit-profile__completion-fill ${completionPct === 100 ? 'edit-profile__completion-fill--complete' : 'edit-profile__completion-fill--incomplete'}`}
              style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        {/* Photo Card */}
        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title">Profile Photo</h2>
          <div className="edit-profile__photo-row">
            <Avatar user={user} size={80} editable={true} onUpdated={handlePhotoUpdated} />
            <div>
              <p className="edit-profile__photo-hint-primary">Click the photo to update</p>
              <p className="edit-profile__photo-hint-secondary">JPG, PNG or GIF · Max 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title--lg-gap">Basic Info</h2>
          <div className="edit-profile__fields">
            <div>
              <label className="edit-profile__label">Full Name</label>
              <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your full name" className="edit-profile__input" />
            </div>
            <div>
              <label className="edit-profile__label">Bio / Tagline</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="e.g. Independent filmmaker based in Mumbai"
                rows={3} maxLength={500} className="edit-profile__textarea" />
              <div className={`edit-profile__char-count ${(form.bio?.length || 0) > 450 ? 'edit-profile__char-count--warning' : 'edit-profile__char-count--normal'}`}>
                {form.bio?.length || 0}/500
              </div>
            </div>
            <div className="edit-profile__city-country">
              <div>
                <label className="edit-profile__label">City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Mumbai" className="edit-profile__input" />
              </div>
              <div>
                <label className="edit-profile__label">Country</label>
                <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                  placeholder="India" className="edit-profile__input" />
              </div>
            </div>
            <label className="edit-profile__available-label">
              <input type="checkbox" checked={form.availableForWork}
                onChange={e => setForm({ ...form, availableForWork: e.target.checked })}
                className="edit-profile__available-checkbox" />
              <span className="edit-profile__available-text">Available for work</span>
            </label>
          </div>
        </div>

        {/* Roles */}
        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title">Your Roles</h2>
          <div className="edit-profile__role-list">
            {ROLES.map(role => {
              const selected = form.roles.includes(role);
              const color = roleColors[role];
              return (
                <button key={role} onClick={() => toggleRole(role)}
                  className={`edit-profile__role-btn ${selected ? 'edit-profile__role-btn--selected' : 'edit-profile__role-btn--unselected'}`}
                  style={selected ? {
                    border: `1px solid ${color}`,
                    background: `${color}18`,
                    color: color,
                  } : undefined}>
                  {role.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title">Languages</h2>
          <div className="edit-profile__lang-list">
            {LANGUAGES.map(lang => {
              const selected = form.languages.includes(lang);
              return (
                <button key={lang} onClick={() => toggleLang(lang)}
                  className={`edit-profile__lang-btn ${selected ? 'edit-profile__lang-btn--selected' : 'edit-profile__lang-btn--unselected'}`}>
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title">Skills & Tools</h2>

          {/* Existing skills */}
          <div className="edit-profile__skill-chips">
            {skills.map(skill => (
              <div key={skill.id} className="edit-profile__skill-chip">
                <span className="edit-profile__skill-name">{skill.name}</span>
                <span className="edit-profile__skill-level">{skill.level}</span>
                <button onClick={() => deleteSkill(skill.id)} className="edit-profile__skill-remove">✕</button>
              </div>
            ))}
            {skills.length === 0 && <p className="edit-profile__skill-empty">No skills added yet</p>}
          </div>

          {/* Add skill */}
          <div className="edit-profile__skill-add-row">
            <input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="e.g. Final Cut Pro"
              className={`edit-profile__input edit-profile__skill-input`} />
            <select value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
              className={`edit-profile__input edit-profile__skill-level-select`}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
            <button onClick={addSkill} className="edit-profile__btn--add-skill">+ Add</button>
          </div>
        </div>

        {/* Bottom Save */}
        <div className="edit-profile__footer">
          <button onClick={() => navigate(`/profile/${username}`)} className="edit-profile__btn--cancel-footer">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className={`edit-profile__btn--save-footer ${saved ? 'edit-profile__btn--save-footer--saved' : 'edit-profile__btn--save-footer--default'}`}>
            {saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
