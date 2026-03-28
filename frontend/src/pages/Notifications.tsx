import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Notification } from '../types';
import { timeAgo } from '../utils/timeAgo';
import './Notifications.css';

const notifIcons: Record<string, string> = {
  LIKE: '❤️',
  COMMENT: '💬',
  REPLY: '↩️',
  CONNECTION_REQUEST: '🤝',
  CONNECTION_ACCEPTED: '✅',
  PORTFOLIO_COMMENT: '🎬',
};

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  const handleClick = async (notif: Notification) => {
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch {}
    }
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
                <div className="notifications__avatar">
                  {notif.sender?.profilePhotoUrl
                    ? <img src={notif.sender.profilePhotoUrl} alt="" className="notifications__avatar-img" />
                    : notif.sender?.fullName?.charAt(0)}
                  <span className="notifications__avatar-icon">
                    {notifIcons[notif.type] || '🔔'}
                  </span>
                </div>

                <div className="notifications__body">
                  <p className="notifications__message">
                    <strong>{notif.sender?.fullName}</strong>{' '}
                    {notif.message.replace((notif.sender?.fullName ?? '') + ' ', '')}
                  </p>
                  <p className="notifications__time">{timeAgo(notif.createdAt)}</p>
                </div>

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
