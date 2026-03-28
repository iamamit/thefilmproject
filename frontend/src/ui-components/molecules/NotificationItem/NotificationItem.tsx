import React from 'react';
import { Notification, NotificationType } from '../../../types';
import { timeAgo } from '../../../utils/timeAgo';
import './NotificationItem.css';

const notifIcons: Record<NotificationType, string> = {
  LIKE: '❤️',
  COMMENT: '💬',
  REPLY: '↩️',
  CONNECTION_REQUEST: '🤝',
  CONNECTION_ACCEPTED: '✅',
  PORTFOLIO_COMMENT: '🎬',
};

interface NotificationItemProps {
  notification: Notification;
  onClick: (n: Notification) => void;
}

export function NotificationItem({ notification: n, onClick }: NotificationItemProps) {
  return (
    <div
      className={`notif-item ${n.isRead ? 'notif-item--read' : 'notif-item--unread'}`}
      onClick={() => onClick(n)}
    >
      <div className="notif-item__avatar">
        {n.sender?.profilePhotoUrl
          ? <img src={n.sender.profilePhotoUrl} alt="" className="notif-item__avatar-img" />
          : <span>{n.sender?.fullName?.charAt(0)}</span>}
        <span className="notif-item__type-icon">{notifIcons[n.type] ?? '🔔'}</span>
      </div>
      <div className="notif-item__body">
        <p className="notif-item__message">
          <strong>{n.sender?.fullName}</strong> {n.message.replace(n.sender?.fullName + ' ', '')}
        </p>
        <p className="notif-item__time">{timeAgo(n.createdAt)}</p>
      </div>
      {!n.isRead && <div className="notif-item__dot" />}
    </div>
  );
}
