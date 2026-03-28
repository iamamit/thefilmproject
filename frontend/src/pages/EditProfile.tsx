import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Avatar } from '../ui-components/atoms/Avatar/Avatar'; // eslint-disable-line
import { roleColors } from '../utils/roleColors';
import { UserRole } from '../types/enums';
import { User } from '../types';
import './EditProfile.css';

const ROLES: UserRole[] = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati'];

interface ProfileForm {
  fullName: string;
  bio: string;
  city: string;
  country: string;
  availableForWork: boolean;
  roles: UserRole[];
  languages: string[];
}

interface Skill {
  id: number | string;
  name: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
}

function EditProfile() {
  const navigate  = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    fullName: '', bio: '', city: '', country: '', availableForWork: true, roles: [], languages: [],
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({ name: '', category: '', level: 'BEGINNER' });
  const [deletedSkillIds, setDeletedSkillIds] = useState<(number | string)[]>([]);
  const [newSkills, setNewSkills] = useState<Skill[]>([]);
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
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const toggleRole = (role: UserRole) =>
    setForm(f => ({ ...f, roles: f.roles.includes(role) ? f.roles.filter(r => r !== role) : [...f.roles, role] }));

  const toggleLang = (lang: string) =>
    setForm(f => ({ ...f, languages: f.languages.includes(lang) ? f.languages.filter(l => l !== lang) : [...f.languages, lang] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/me', form);
      await Promise.all(deletedSkillIds.map(id => api.delete(`/skills/${id}`).catch(() => {})));
      await Promise.all(newSkills.map(s => api.post('/skills', { name: s.name, category: s.category, level: s.level }).catch(() => {})));
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate(`/profile/${username}`); }, 1500);
    } catch { alert('Save failed'); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    const tempSkill: Skill = { ...newSkill, category: newSkill.category || 'GENERAL', id: 'new_' + Date.now() };
    setSkills(prev => [...prev, tempSkill]);
    setNewSkills(prev => [...prev, tempSkill]);
    setNewSkill({ name: '', category: '', level: 'BEGINNER' });
  };

  const deleteSkill = (id: number | string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    if (String(id).startsWith('new_')) {
      setNewSkills(prev => prev.filter(s => s.id !== id));
    } else {
      setDeletedSkillIds(prev => [...prev, id]);
    }
  };

  const handlePhotoUpdated = (newPhoto: string) =>
    setUser(prev => prev ? { ...prev, profilePhotoUrl: newPhoto } : prev);

  const calcCompletion = () => {
    if (!user) return 0;
    const checks = [
      !!user.fullName?.trim(),
      (user.bio?.trim().length ?? 0) > 10,
      !!user.city?.trim(),
      !!user.country?.trim(),
      (user.roles?.length ?? 0) > 0,
      (user.languages?.length ?? 0) > 0,
      skills.length > 0,
      !!user.profilePhotoUrl,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  const completionPct = calcCompletion();

  if (!user) return <div className="edit-profile__loading"><p>Loading...</p></div>;

  return (
    <div className="edit-profile__page">
      <div className="edit-profile__container">

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
            <div
              className={`edit-profile__completion-fill ${completionPct === 100 ? 'edit-profile__completion-fill--complete' : 'edit-profile__completion-fill--incomplete'}`}
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title">Profile Photo</h2>
          <div className="edit-profile__photo-row">
            <Avatar photoUrl={user.profilePhotoUrl} name={user.fullName} size={80} editable onUpdated={handlePhotoUpdated} />
            <div>
              <p className="edit-profile__photo-hint-primary">Click the photo to update</p>
              <p className="edit-profile__photo-hint-secondary">JPG, PNG or GIF · Max 2MB</p>
            </div>
          </div>
        </div>

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

        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title">Your Roles</h2>
          <div className="edit-profile__role-list">
            {ROLES.map(role => {
              const selected = form.roles.includes(role);
              const color    = roleColors[role];
              return (
                <button key={role} onClick={() => toggleRole(role)}
                  className={`edit-profile__role-btn ${selected ? 'edit-profile__role-btn--selected' : 'edit-profile__role-btn--unselected'}`}
                  style={selected ? { border: `1px solid ${color}`, background: `${color}18`, color } : undefined}>
                  {role.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

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

        <div className="edit-profile__card">
          <h2 className="edit-profile__card-title">Skills & Tools</h2>
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

          <div className="edit-profile__skill-add-row">
            <input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="e.g. Final Cut Pro"
              className="edit-profile__input edit-profile__skill-input" />
            <select value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
              className="edit-profile__input edit-profile__skill-level-select">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
            <button onClick={addSkill} className="edit-profile__btn--add-skill">+ Add</button>
          </div>
        </div>

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
