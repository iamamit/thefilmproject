import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Connections.css';

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

  if (loading) return (
    <div className="connections__loading">
      <p className="connections__loading-text">Loading...</p>
    </div>
  );

  return (
    <div className="connections">
      <div className="connections__container">
        <h2 className="connections__heading">My Network</h2>
        <p className="connections__subheading">Manage your connections</p>

        {/* Tabs */}
        <div className="connections__tabs">
          <button
            className={`connections__tab${activeTab === 'connections' ? ' connections__tab--active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            🤝 Connected ({connections.length})
          </button>
          <button
            className={`connections__tab${activeTab === 'pending' ? ' connections__tab--active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            ⏳ Pending ({pending.length})
          </button>
          <button
            className={`connections__tab${activeTab === 'sent' ? ' connections__tab--active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            📤 Sent ({sent.length})
          </button>
        </div>

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="connections__list">
            {connections.length === 0 ? (
              <p className="connections__empty">No connections yet. Discover creators and connect!</p>
            ) : connections.map(conn => {
              const other = getOtherUser(conn);
              return (
                <div key={conn.id} className="connections__card">
                  <div className="connections__avatar">{other.fullName?.charAt(0)}</div>
                  <div className="connections__info">
                    <p className="connections__name">{other.fullName}</p>
                    <p className="connections__username">@{other.username}</p>
                    <div className="connections__roles">
                      {other.roles?.map(role => (
                        <span key={role} className="connections__role-badge">
                          {role.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="connections__actions">
                    <button
                      onClick={() => navigate(`/profile/${other.username}`)}
                      className="connections__btn--view"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/messages?user=${other.id}&name=${other.fullName}`)}
                      className="connections__btn--message"
                    >
                      💬
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="connections__list">
            {pending.length === 0 ? (
              <p className="connections__empty">No pending requests.</p>
            ) : pending.map(conn => (
              <div key={conn.id} className="connections__card">
                <div className="connections__avatar">{conn.sender.fullName?.charAt(0)}</div>
                <div className="connections__info">
                  <p className="connections__name">{conn.sender.fullName}</p>
                  <p className="connections__username">@{conn.sender.username}</p>
                  {conn.sender.city && <p className="connections__city">📍 {conn.sender.city}</p>}
                </div>
                <div className="connections__actions">
                  <button onClick={() => respond(conn.id, true)} className="connections__btn--accept">
                    ✅ Accept
                  </button>
                  <button onClick={() => respond(conn.id, false)} className="connections__btn--decline">
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sent Tab */}
        {activeTab === 'sent' && (
          <div className="connections__list">
            {sent.length === 0 ? (
              <p className="connections__empty">No sent requests.</p>
            ) : sent.map(conn => (
              <div key={conn.id} className="connections__card">
                <div className="connections__avatar">{conn.receiver.fullName?.charAt(0)}</div>
                <div className="connections__info">
                  <p className="connections__name">{conn.receiver.fullName}</p>
                  <p className="connections__username">@{conn.receiver.username}</p>
                  {conn.receiver.city && <p className="connections__city">📍 {conn.receiver.city}</p>}
                </div>
                <span className="connections__pending-label">⏳ Pending</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Connections;
