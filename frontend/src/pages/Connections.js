import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Connections() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connections');
  const myUsername = localStorage.getItem('username');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [connRes, pendingRes, sentRes] = await Promise.all([
        api.get('/connections'),
        api.get('/connections/pending'),
        api.get('/connections/sent')
      ]);
      setConnections(connRes.data);
      setPending(pendingRes.data);
      setSent(sentRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const respond = async (id, accept) => {
    try {
      await api.patch(`/connections/${id}/respond?accept=${accept}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const getOtherUser = (conn) => {
    return conn.sender.username === myUsername ? conn.receiver : conn.sender;
  };

  const tabStyle = (tab) => ({
    padding: '0.6rem 1.5rem', borderRadius: '20px', cursor: 'pointer',
    border: 'none', fontWeight: 'bold', fontSize: '0.9rem',
    background: activeTab === tab ? '#e94560' : '#2a2a4a',
    color: '#fff'
  });

  const cardStyle = {
    background: '#1a1a2e', borderRadius: '12px', padding: '1.2rem',
    border: '1px solid #2a2a4a', display: 'flex',
    alignItems: 'center', gap: '1rem'
  };

  const avatarStyle = {
    width: '55px', height: '55px', borderRadius: '50%', background: '#e94560',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem', fontWeight: 'bold', color: '#fff', flexShrink: 0
  };

  if (loading) return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>My Network</h2>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Manage your connections</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem' }}>
          <button style={tabStyle('connections')} onClick={() => setActiveTab('connections')}>
            🤝 Connected ({connections.length})
          </button>
          <button style={tabStyle('pending')} onClick={() => setActiveTab('pending')}>
            ⏳ Pending ({pending.length})
          </button>
          <button style={tabStyle('sent')} onClick={() => setActiveTab('sent')}>
            📤 Sent ({sent.length})
          </button>
        </div>

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {connections.length === 0 ? (
              <p style={{ color: '#888' }}>No connections yet. Discover creators and connect!</p>
            ) : connections.map(conn => {
              const other = getOtherUser(conn);
              return (
                <div key={conn.id} style={cardStyle}>
                  <div style={avatarStyle}>{other.fullName?.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>{other.fullName}</p>
                    <p style={{ color: '#888', margin: '0.2rem 0', fontSize: '0.85rem' }}>@{other.username}</p>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                      {other.roles?.map(role => (
                        <span key={role} style={{ background: '#2a2a4a', color: '#e94560', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem' }}>
                          {role.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => navigate(`/profile/${other.username}`)} style={{
                      background: '#2a2a4a', color: '#fff', border: 'none',
                      padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                    }}>View</button>
                    <button onClick={() => navigate(`/messages?user=${other.id}&name=${other.fullName}`)} style={{
                      background: '#e94560', color: '#fff', border: 'none',
                      padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                    }}>💬</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pending.length === 0 ? (
              <p style={{ color: '#888' }}>No pending requests.</p>
            ) : pending.map(conn => (
              <div key={conn.id} style={cardStyle}>
                <div style={avatarStyle}>{conn.sender.fullName?.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>{conn.sender.fullName}</p>
                  <p style={{ color: '#888', margin: '0.2rem 0', fontSize: '0.85rem' }}>@{conn.sender.username}</p>
                  {conn.sender.city && <p style={{ color: '#666', margin: 0, fontSize: '0.8rem' }}>📍 {conn.sender.city}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => respond(conn.id, true)} style={{
                    background: '#4caf50', color: '#fff', border: 'none',
                    padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                  }}>✅ Accept</button>
                  <button onClick={() => respond(conn.id, false)} style={{
                    background: '#2a2a4a', color: '#fff', border: 'none',
                    padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                  }}>❌ Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sent Tab */}
        {activeTab === 'sent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sent.length === 0 ? (
              <p style={{ color: '#888' }}>No sent requests.</p>
            ) : sent.map(conn => (
              <div key={conn.id} style={cardStyle}>
                <div style={avatarStyle}>{conn.receiver.fullName?.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>{conn.receiver.fullName}</p>
                  <p style={{ color: '#888', margin: '0.2rem 0', fontSize: '0.85rem' }}>@{conn.receiver.username}</p>
                  {conn.receiver.city && <p style={{ color: '#666', margin: 0, fontSize: '0.8rem' }}>📍 {conn.receiver.city}</p>}
                </div>
                <span style={{ color: '#f5a623', fontSize: '0.85rem', fontWeight: 'bold' }}>⏳ Pending</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Connections;
