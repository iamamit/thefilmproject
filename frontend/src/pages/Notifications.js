import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const notifIcons = {
  LIKE: '❤️',
  COMMENT: '💬',
  REPLY: '↩️',
  CONNECTION_REQUEST: '🤝',
  CONNECTION_ACCEPTED: '✅',
  PORTFOLIO_COMMENT: '🎬',
};

function timeAgo(dateStr) {
  const diff = (new Date() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchNotifications();
  }, [token, navigate]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.content || []);
    } catch {}
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleClick = async (notif) => {
    // Mark as read
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch {}
    }
    // Navigate to relevant page
    if (notif.referenceType === 'POST' && notif.referenceId) {
      navigate('/home');
    } else if (notif.referenceType === 'USER' && notif.referenceId) {
      navigate(`/profile/${notif.sender?.username}`);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>🔔 Notifications</h2>
          {notifications.some(n => !n.isRead) && (
            <button onClick={markAllRead} style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--accent)', borderRadius: '20px',
              padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.85rem'
            }}>✓ Mark all as read</button>
          )}
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading...</p>
        ) : notifications.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', padding: '3rem', textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</p>
            <p style={{ color: 'var(--text-muted)' }}>No notifications yet!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.map(notif => (
              <div key={notif.id} onClick={() => handleClick(notif)} style={{
                background: notif.isRead ? 'var(--bg-card)' : 'var(--bg-hover)',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                padding: '0.8rem 1rem', cursor: 'pointer', display: 'flex',
                gap: '0.8rem', alignItems: 'center',
                borderLeft: notif.isRead ? '3px solid transparent' : '3px solid var(--accent)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = notif.isRead ? 'var(--bg-card)' : 'var(--bg-hover)'}
              >
                {/* Sender avatar */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', color: '#fff',
                  position: 'relative'
                }}>
                  {notif.sender?.profilePhotoUrl
                    ? <img src={notif.sender.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : notif.sender?.fullName?.charAt(0)}
                  <span style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    fontSize: '0.8rem', background: 'var(--bg-card)',
                    borderRadius: '50%', width: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{notifIcons[notif.type] || '🔔'}</span>
                </div>

                {/* Message */}
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem' }}>
                    <strong>{notif.sender?.fullName}</strong> {notif.message.replace(notif.sender?.fullName + ' ', '')}
                  </p>
                  <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0', fontSize: '0.75rem' }}>
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>

                {/* Unread dot */}
                {!notif.isRead && (
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'var(--accent)', flexShrink: 0
                  }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
