import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState('');
  const myUsername = localStorage.getItem('username');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const sendConnection = async () => {
    setConnecting(true);
    try {
      await api.post(`/connections/request/${user.id}`);
      setMessage('Connection request sent! ✅');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not send request');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#888' }}>Loading...</p></div>;
  if (!user) return <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#888' }}>User not found</p></div>;

  const isMyProfile = myUsername === username;

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header Card */}
        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #2a2a4a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%', background: '#e94560',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 'bold', color: '#fff', flexShrink: 0
            }}>
              {user.fullName?.charAt(0)}
            </div>
            <div>
              <h2 style={{ color: '#fff', margin: '0 0 0.3rem' }}>{user.fullName}</h2>
              <p style={{ color: '#888', margin: '0 0 0.5rem' }}>@{user.username}</p>
              {user.city && <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>📍 {user.city}, {user.country}</p>}
            </div>
          </div>

          {user.bio && <p style={{ color: '#aaa', marginBottom: '1rem' }}>{user.bio}</p>}

          {/* Roles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {user.roles?.map(role => (
              <span key={role} style={{
                background: '#2a2a4a', color: '#e94560', padding: '0.3rem 0.8rem',
                borderRadius: '20px', fontSize: '0.85rem'
              }}>{role.replace('_', ' ')}</span>
            ))}
          </div>

          {user.availableForWork && (
            <p style={{ color: '#4caf50', fontSize: '0.9rem', marginBottom: '1rem' }}>✅ Available for work</p>
          )}

          {/* Connect button */}
          {!isMyProfile && (
            <div>
              <button onClick={sendConnection} disabled={connecting} style={{
                background: '#e94560', color: '#fff', border: 'none',
                padding: '0.6rem 1.5rem', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem'
              }}>
                {connecting ? 'Sending...' : '🤝 Connect'}
              </button>
              {message && <p style={{ color: '#4caf50', marginTop: '0.5rem', fontSize: '0.9rem' }}>{message}</p>}
            </div>
          )}

          {isMyProfile && (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>This is your profile</p>
          )}
        </div>

        {/* Languages */}
        {user.languages?.length > 0 && (
          <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #2a2a4a' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Languages</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {user.languages.map(lang => (
                <span key={lang} style={{
                  background: '#2a2a4a', color: '#fff', padding: '0.3rem 0.8rem',
                  borderRadius: '20px', fontSize: '0.85rem'
                }}>{lang}</span>
              ))}
            </div>
          </div>
        )}

        {/* Member since */}
        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '1.5rem', border: '1px solid #2a2a4a' }}>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
            Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Profile;
