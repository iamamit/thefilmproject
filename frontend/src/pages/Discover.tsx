import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { roleColors } from '../utils/roleColors';
import { UserRole } from '../types/enums';
import { User, Company } from '../types';
import './Discover.css';

const ROLES: Array<UserRole | ''> = ['', 'DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];

type Tab = 'people' | 'companies';

interface Filters {
  role: UserRole | '';
  city: string;
  search: string;
}

function Discover() {
  usePageMeta('Discover Creators', 'Find directors, editors, musicians across India.');
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('people');
  const [filters, setFilters] = useState<Filters>({ role: '', city: '', search: '' });
  const [companySearch, setCompanySearch] = useState('');
  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role)   params.append('role', filters.role);
      if (filters.city)   params.append('city', filters.city);
      if (filters.search) params.append('search', filters.search);
      const res = await api.get(`/users/discover?${params}`);
      setUsers(res.data.content);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCompanies = async () => {
    try {
      const params = companySearch ? `?q=${companySearch}` : '';
      const res = await api.get(`/companies${params}`);
      setCompanies(res.data.content || res.data);
    } catch {}
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetchCompanies(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="discover">
      <div className="discover__tabs">
        {(['people', 'companies'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`discover__tab${activeTab === tab ? ' discover__tab--active' : ''}`}
          >
            {tab === 'people' ? '👥 People' : '🏢 Companies'}
          </button>
        ))}
      </div>

      <div className="discover__layout">
        {/* Left Sidebar */}
        <div className="discover__sidebar-left">
          {token ? (
            <div className="discover__card discover__card--static">
              <div className="discover__profile-cover" />
              <div className="discover__profile-body">
                <div className="discover__profile-avatar">
                  {(fullName || username)?.charAt(0).toUpperCase()}
                </div>
                <p className="discover__profile-name">{fullName}</p>
                <p className="discover__profile-username">@{username}</p>
                <div className="discover__profile-divider">
                  <button onClick={() => navigate(`/profile/${username}`)} className="discover__profile-btn">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="discover__card discover__card--static discover__guest-card">
              <p className="discover__guest-icon">🎬</p>
              <p className="discover__guest-title">Join CollabNow</p>
              <p className="discover__guest-subtitle">Connect with India's best film creators</p>
              <button onClick={() => navigate('/register')} className="discover__btn--join">Join Now</button>
              <button onClick={() => navigate('/login')} className="discover__btn--signin">Sign In</button>
            </div>
          )}

          <div className="discover__card discover__card--static discover__filters">
            <p className="discover__filters-title">Filter Creators</p>
            <div className="discover__filters-group">
              <input
                placeholder="Search by name..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="discover__filters-input"
              />
              <select
                value={filters.role}
                onChange={e => setFilters({ ...filters, role: e.target.value as UserRole | '' })}
                className="discover__filters-select"
              >
                {ROLES.map(r => <option key={r} value={r}>{r || 'All Roles'}</option>)}
              </select>
              <input
                placeholder="City..."
                value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })}
                className="discover__filters-input"
              />
              <button onClick={fetchUsers} className="discover__btn--search">Search</button>
            </div>
          </div>
        </div>

        {/* Center */}
        <div>
          {activeTab === 'companies' ? (
            <div>
              <div className="discover__card discover__card--static discover__companies-header">
                <p className="discover__companies-title">🏢 Companies & Studios</p>
                <p className="discover__companies-subtitle">Find production houses, studios and agencies</p>
                <input
                  value={companySearch}
                  onChange={e => setCompanySearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchCompanies()}
                  placeholder="Search companies..."
                  className="discover__companies-search"
                />
              </div>
              {companies.length === 0 ? (
                <div className="discover__empty">No companies found.</div>
              ) : (
                <div className="discover__feed-list">
                  {companies.map(company => (
                    <div
                      key={company.id}
                      onClick={() => navigate('/company/' + company.slug)}
                      className="discover__card discover__company-card"
                    >
                      <div
                        className="discover__company-logo"
                        style={{ background: company.logoUrl ? 'transparent' : 'var(--accent)' }}
                      >
                        {company.logoUrl
                          ? <img src={company.logoUrl} alt={company.name} className="discover__company-logo-img" />
                          : company.name && company.name.charAt(0)}
                      </div>
                      <div className="discover__company-info">
                        <div className="discover__company-name-row">
                          <p className="discover__company-name">{company.name}</p>
                          {company.isVerified && <span className="discover__company-verified">✓</span>}
                          {company.isOfficial && <span className="discover__company-official">★ Official</span>}
                        </div>
                        {company.type && <p className="discover__company-type">{company.type.replace('_', ' ')}</p>}
                        {company.city && <p className="discover__company-city">📍 {company.city} · 👥 {company.followerCount} followers</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="discover__card discover__card--static discover__feed-header">
                <p className="discover__feed-title">Discover Creators</p>
                <p className="discover__feed-subtitle">Find your next collaborator</p>
              </div>

              {loading ? (
                <div className="discover__empty">Loading creators...</div>
              ) : users.length === 0 ? (
                <div className="discover__empty">No creators found.</div>
              ) : (
                <div className="discover__feed-list">
                  {users.map(user => {
                    const primaryColor   = roleColors[user.roles?.[0] as UserRole] || 'var(--accent)';
                    const secondaryColor = roleColors[user.roles?.[0] as UserRole] || '#4a90e2';
                    return (
                      <div
                        key={user.id}
                        className="discover__card"
                        onClick={() => navigate(`/profile/${user.username}`)}
                      >
                        <div
                          className="discover__creator-cover"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}33, ${secondaryColor}22)` }}
                        />
                        <div className="discover__creator-body">
                          <div className="discover__creator-header">
                            <div className="discover__creator-avatar" style={{ background: primaryColor }}>
                              {user.fullName?.charAt(0)}
                            </div>
                            <div className="discover__creator-meta">
                              <p className="discover__creator-name">{user.fullName}</p>
                              <p className="discover__creator-username">@{user.username}</p>
                            </div>
                          </div>

                          {user.bio && <p className="discover__creator-bio">{user.bio}</p>}

                          <div className="discover__creator-roles">
                            {user.roles?.map(role => (
                              <span
                                key={role}
                                className="discover__role-badge"
                                style={{
                                  background: `${roleColors[role as UserRole]}22`,
                                  color: roleColors[role as UserRole],
                                  border: `1px solid ${roleColors[role as UserRole]}44`,
                                }}
                              >
                                {role.replace('_', ' ')}
                              </span>
                            ))}
                          </div>

                          <div className="discover__creator-footer">
                            <div className="discover__creator-info">
                              {user.city && <span className="discover__creator-city">📍 {user.city}</span>}
                              {user.availableForWork && <span className="discover__creator-available">✅ Available</span>}
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); navigate(`/profile/${user.username}`); }}
                              className="discover__btn--connect"
                            >
                              Connect
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="discover__sidebar-right">
          <div className="discover__card discover__card--static discover__sidebar-card">
            <p className="discover__sidebar-title">🎬 About CollabNow</p>
            <p className="discover__sidebar-text">
              India's professional network for film & content creators. Connect, collaborate, and create.
            </p>
            <div className="discover__sidebar-list">
              {['📽️ Directors', '🎵 Musicians', '✂️ Editors', '🎭 Actors', '📸 Cinematographers'].map(item => (
                <p key={item} className="discover__sidebar-list-item">{item}</p>
              ))}
            </div>
          </div>

          <div className="discover__card discover__card--static discover__sidebar-card">
            <p className="discover__sidebar-title">🔥 Trending Roles</p>
            {['VFX Artist', 'Content Creator', 'Music Composer', 'Script Writer'].map(role => (
              <div key={role} className="discover__trending-item">
                <div className="discover__trending-dot" />
                <p className="discover__trending-label">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discover;
