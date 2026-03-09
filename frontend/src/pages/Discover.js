import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ROLES = ['', 'DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER'];

function Discover() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: '', city: '', search: '' });

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

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', padding: '2rem' }}>
      <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Discover Creators</h2>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Find your next collaborator</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Search by name..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', minWidth: '200px' }}
        />
        <select
          value={filters.role}
          onChange={e => setFilters({ ...filters, role: e.target.value })}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
        >
          {ROLES.map(r => <option key={r} value={r}>{r || 'All Roles'}</option>)}
        </select>
        <input
          placeholder="City..."
          value={filters.city}
          onChange={e => setFilters({ ...filters, city: e.target.value })}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
        />
        <button onClick={fetchUsers} style={{
          padding: '0.6rem 1.5rem', background: '#e94560', color: '#fff',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
        }}>Search</button>
      </div>

      {/* Results */}
      {loading ? (
        <p style={{ color: '#888' }}>Loading creators...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {users.map(user => (
            <div key={user.id} onClick={() => navigate(`/profile/${user.username}`)}
              style={{
                background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem',
                cursor: 'pointer', border: '1px solid #2a2a4a',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#e94560'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a4a'}
            >
              {/* Avatar */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: '#e94560', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold',
                color: '#fff', marginBottom: '1rem'
              }}>
                {user.fullName?.charAt(0)}
              </div>

              <h3 style={{ color: '#fff', margin: '0 0 0.3rem' }}>{user.fullName}</h3>
              <p style={{ color: '#888', margin: '0 0 0.8rem', fontSize: '0.9rem' }}>@{user.username}</p>

              {user.bio && <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{user.bio}</p>}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.8rem' }}>
                {user.roles?.map(role => (
                  <span key={role} style={{
                    background: '#2a2a4a', color: '#e94560', padding: '0.2rem 0.6rem',
                    borderRadius: '20px', fontSize: '0.75rem'
                  }}>{role.replace('_', ' ')}</span>
                ))}
              </div>

              {user.city && <p style={{ color: '#666', fontSize: '0.85rem' }}>📍 {user.city}, {user.country}</p>}

              {user.availableForWork && (
                <p style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: '0.5rem' }}>✅ Available for work</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && users.length === 0 && (
        <p style={{ color: '#888', textAlign: 'center', marginTop: '3rem' }}>No creators found. Try different filters.</p>
      )}
    </div>
  );
}

export default Discover;
