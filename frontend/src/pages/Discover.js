import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ROLES = ['', 'DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];

const roleColors = {
  DIRECTOR: 'var(--accent)', EDITOR: '#4a90e2', MUSICIAN: '#9b59b6',
  PRODUCER: '#f39c12', ACTOR: '#1abc9c', CINEMATOGRAPHER: '#e67e22',
  VFX_ARTIST: '#3498db', WRITER: '#2ecc71'
};

function Discover() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: '', city: '', search: '' });
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.city) params.append('city', filters.city);
      if (filters.search) params.append('search', filters.search);
      const res = await api.get(`/users/discover?${params}`);
      setUsers(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const cardStyle = {
    background: 'var(--bg-card)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', overflow: 'hidden',
    cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s',
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1128px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left Sidebar - Profile Card */}
        <div style={{ position: 'sticky', top: '72px' }}>
          {token ? (
            <div style={{ ...cardStyle, cursor: 'default' }}>
              {/* Cover */}
              <div style={{ height: '60px', background: 'linear-gradient(135deg, #b0bec5, #78909c)' }} />
              <div style={{ padding: '0 1rem 1rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'var(--accent)', border: '3px solid var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 'bold', color: '#fff',
                  marginTop: '-28px', marginBottom: '0.5rem'
                }}>
                  {(fullName || username)?.charAt(0).toUpperCase()}
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>{fullName}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.8rem' }}>@{username}</p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
                  <button onClick={() => navigate(`/profile/${username}`)} style={{
                    width: '100%', background: 'transparent', border: '1px solid var(--accent)',
                    color: 'var(--accent)', borderRadius: '20px', padding: '0.4rem',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
                  }}>View Profile</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...cardStyle, cursor: 'default', padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</p>
              <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.3rem' }}>Join TheFilmProject</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Connect with India's best film creators</p>
              <button onClick={() => navigate('/register')} style={{
                width: '100%', background: 'var(--accent)', border: 'none',
                color: '#fff', borderRadius: '20px', padding: '0.5rem',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem'
              }}>Join Now</button>
              <button onClick={() => navigate('/login')} style={{
                width: '100%', background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: '20px', padding: '0.5rem',
                cursor: 'pointer', fontSize: '0.85rem',
              }}>Sign In</button>
            </div>
          )}

          {/* Filters */}
          <div style={{ ...cardStyle, cursor: 'default', padding: '1rem', marginTop: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>Filter Creators</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                placeholder="Search by name..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                style={{
                  padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%',
                }}
              />
              <select value={filters.role}
                onChange={e => setFilters({ ...filters, role: e.target.value })}
                style={{
                  padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%',
                }}>
                {ROLES.map(r => <option key={r} value={r}>{r || 'All Roles'}</option>)}
              </select>
              <input
                placeholder="City..."
                value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })}
                style={{
                  padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%',
                }}
              />
              <button onClick={fetchUsers} style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: '20px', padding: '0.5rem', cursor: 'pointer',
                fontSize: '0.85rem', fontWeight: '600',
              }}>Search</button>
            </div>
          </div>
        </div>

        {/* Center - Creator Feed */}
        <div>
          <div style={{ ...cardStyle, cursor: 'default', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Discover Creators</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Find your next collaborator</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading creators...</div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No creators found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {users.map(user => (
                <div key={user.id}
                  style={cardStyle}
                  onClick={() => navigate(`/profile/${user.username}`)}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Cover strip */}
                  <div style={{ height: '50px', background: `linear-gradient(135deg, ${roleColors[user.roles?.[0]] || 'var(--accent)'}33, ${roleColors[user.roles?.[0]] || '#4a90e2'}22)` }} />
                  <div style={{ padding: '0 1.2rem 1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '-24px', marginBottom: '0.8rem' }}>
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: roleColors[user.roles?.[0]] || 'var(--accent)',
                        border: '3px solid var(--bg-card)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', flexShrink: 0
                      }}>{user.fullName?.charAt(0)}</div>
                      <div style={{ paddingBottom: '0.2rem' }}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>{user.fullName}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>@{user.username}</p>
                      </div>
                    </div>

                    {user.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{user.bio}</p>}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.8rem' }}>
                      {user.roles?.map(role => (
                        <span key={role} style={{
                          background: `${roleColors[role]}22`, color: roleColors[role],
                          padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500',
                          border: `1px solid ${roleColors[role]}44`
                        }}>{role.replace('_', ' ')}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {user.city && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {user.city}</span>}
                        {user.availableForWork && <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>✅ Available</span>}
                      </div>
                      <button onClick={e => { e.stopPropagation(); navigate(`/profile/${user.username}`); }} style={{
                        background: 'transparent', border: '1px solid var(--accent)',
                        color: 'var(--accent)', borderRadius: '20px', padding: '0.3rem 0.9rem',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                      }}>Connect</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ position: 'sticky', top: '72px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ ...cardStyle, cursor: 'default', padding: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.8rem', fontSize: '0.9rem' }}>🎬 About TheFilmProject</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.5' }}>
              India's professional network for film & content creators. Connect, collaborate, and create.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['📽️ Directors', '🎵 Musicians', '✂️ Editors', '🎭 Actors', '📸 Cinematographers'].map(item => (
                <p key={item} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{item}</p>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, cursor: 'default', padding: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.8rem', fontSize: '0.9rem' }}>🔥 Trending Roles</p>
            {['VFX Artist', 'Content Creator', 'Music Composer', 'Script Writer'].map(role => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Discover;
