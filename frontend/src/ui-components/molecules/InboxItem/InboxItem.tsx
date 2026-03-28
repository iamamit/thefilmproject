import React from 'react';
import { Message, UserSummary } from '../../../types';
import './InboxItem.css';

interface InboxItemProps {
  message: Message;
  otherUser: UserSummary;
  isActive: boolean;
  onClick: () => void;
}

export function InboxItem({ message, otherUser, isActive, onClick }: InboxItemProps) {
  return (
    <div
      className={`inbox-item ${isActive ? 'inbox-item--active' : ''}`}
      onClick={onClick}
    >
      <div className="inbox-item__avatar">{otherUser.fullName?.charAt(0)}</div>
      <div className="inbox-item__text">
        <p className="inbox-item__name">{otherUser.fullName}</p>
        <p className="inbox-item__preview">{message.content}</p>
      </div>
    </div>
  );
}
