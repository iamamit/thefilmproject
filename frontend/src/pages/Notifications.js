import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Notifications.css';

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
    <div className="notifications">
      <div className="notifications__container">
        <div className="notifications__header">
          <h2 className="notifications__title">🔔 Notifications</h2>
          {notifications.some(n => !n.isRead) && (
            <button onClick={markAllRead} className="notifications__mark-all-btn">
              ✓ Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <p className="notifications__loading">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="notifications__empty">
            <p className="notifications__empty-icon">🔔</p>
            <p className="notifications__empty-text">No notifications yet!</p>
          </div>
        ) : (
          <div className="notifications__list">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`notifications__item${notif.isRead ? ' notifications__item--read' : ' notifications__item--unread'}`}
              >
                {/* Sender avatar */}
                <div className="notifications__avatar">
                  {notif.sender?.profilePhotoUrl
                    ? <img src={notif.sender.profilePhotoUrl} alt="" className="notifications__avatar-img" />
                    : notif.sender?.fullName?.charAt(0)}
                  <span className="notifications__avatar-icon">
                    {notifIcons[notif.type] || '🔔'}
                  </span>
                </div>

                {/* Message */}
                <div className="notifications__body">
                  <p className="notifications__message">
                    <strong>{notif.sender?.fullName}</strong> {notif.message.replace(notif.sender?.fullName + ' ', '')}
                  </p>
                  <p className="notifications__time">{timeAgo(notif.createdAt)}</p>
                </div>

                {/* Unread dot */}
                {!notif.isRead && <div className="notifications__unread-dot" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
