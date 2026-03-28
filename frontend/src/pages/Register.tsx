import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { roleColors } from '../utils/roleColors';
import { UserRole } from '../types/enums';
import './Register.css';

const ROLES: UserRole[] = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati'];

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  username: string;
  roles: UserRole[];
  city: string;
  country: string;
  languages: string[];
}

function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterForm>({
    fullName: '', email: '', password: '', username: '',
    roles: [], city: '', country: 'India', languages: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = <K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) =>
    setForm(f => ({ ...f, [field]: value }));

  const toggleRole = (role: UserRole) =>
    update('roles', form.roles.includes(role)
      ? form.roles.filter(r => r !== role)
      : [...form.roles, role]);

  const toggleLang = (lang: string) =>
    update('languages', form.languages.includes(lang)
      ? form.languages.filter(l => l !== lang)
      : [...form.languages, lang]);

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
      sessionStorage.setItem('pendingVerificationEmail', form.email);
      navigate('/check-email');
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed');
      setStep(1);
    } finally { setLoading(false); }
  };

  return (
    <div className="register__page">
      <div className="register__topbar">
        <Link to="/" className="register__logo">
          <span className="register__logo-icon">🎬</span>
          <span className="register__logo-name">CollabNow</span>
        </Link>
        <div className="register__topbar-nav">
          <span className="register__topbar-hint">Already on CollabNow?</span>
          <Link to="/login" className="register__topbar-link">Sign in</Link>
        </div>
      </div>

      <div className="register__main">
        <div className="register__card">
          <div className="register__progress">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`register__progress-step${s <= step ? ' register__progress-step--active' : ''}`}
              />
            ))}
          </div>

          <h2 className="register__card-title">
            {step === 1 ? 'Create your account' : step === 2 ? 'What do you create?' : 'Almost done!'}
          </h2>
          <p className="register__card-subtitle">
            {step === 1 ? "Join India's film creator network" : step === 2 ? 'Select your roles (choose all that apply)' : 'A few more details'}
          </p>

          {error && <div className="auth-error">{error}</div>}

          {step === 1 && (
            <div className="register__fields">
              <div className="register__grid-2">
                <div>
                  <label className="register__label">Full Name</label>
                  <input value={form.fullName} onChange={e => update('fullName', e.target.value)}
                    placeholder="Raj Sharma" className="register__input" />
                </div>
                <div>
                  <label className="register__label">Username</label>
                  <input value={form.username} onChange={e => update('username', e.target.value.toLowerCase())}
                    placeholder="rajsharma" className="register__input" />
                </div>
              </div>
              <div>
                <label className="register__label">Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="raj@example.com" className="register__input" />
              </div>
              <div>
                <label className="register__label">Password</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min. 6 characters" className="register__input" />
              </div>
              <button onClick={nextStep} className="register__btn-primary">Continue →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="register__roles">
                {ROLES.map(role => {
                  const selected = form.roles.includes(role);
                  const color = roleColors[role];
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className="register__role-chip"
                      style={{
                        border: `1px solid ${selected ? color : 'var(--border)'}`,
                        background: selected ? `${color}18` : 'var(--bg-primary)',
                        color: selected ? color : 'var(--text-secondary)',
                        fontWeight: selected ? '600' : '400',
                      }}
                    >
                      {role.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
              <div className="register__btn-row">
                <button onClick={() => setStep(1)} className="register__btn-back">← Back</button>
                <button onClick={nextStep} className="register__btn-next">Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="register__step3-fields">
              <div className="register__grid-2">
                <div>
                  <label className="register__label">City</label>
                  <input value={form.city} onChange={e => update('city', e.target.value)}
                    placeholder="Mumbai" className="register__input" />
                </div>
                <div>
                  <label className="register__label">Country</label>
                  <input value={form.country} onChange={e => update('country', e.target.value)}
                    placeholder="India" className="register__input" />
                </div>
              </div>

              <div>
                <label className="register__label">Languages (optional)</label>
                <div className="register__languages">
                  {LANGUAGES.map(lang => {
                    const selected = form.languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLang(lang)}
                        className="register__lang-chip"
                        style={{
                          border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                          background: selected ? 'var(--accent)' : 'var(--bg-primary)',
                          color: selected ? '#fff' : 'var(--text-secondary)',
                        }}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="register__step3-btn-row">
                <button onClick={() => setStep(2)} className="register__btn-back">← Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`register__btn-submit${loading ? ' register__btn-submit--loading' : ''}`}
                >
                  {loading ? 'Creating account...' : '🎬 Join CollabNow'}
                </button>
              </div>
            </div>
          )}

          <p className="register__legal">
            By joining, you agree to our{' '}
            <Link to="/terms" className="register__legal-link">Terms of Service</Link>
            {' '}&{' '}
            <Link to="/privacy" className="register__legal-link">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
