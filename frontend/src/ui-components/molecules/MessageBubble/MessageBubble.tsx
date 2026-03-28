import React from 'react';
import { Message } from '../../../types';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`msg-bubble-row ${isMine ? 'msg-bubble-row--mine' : 'msg-bubble-row--theirs'}`}>
      <div className={`msg-bubble ${isMine ? 'msg-bubble--mine' : 'msg-bubble--theirs'}`}>
        <p className="msg-bubble__content">{message.content}</p>
        <p className={`msg-bubble__time ${isMine ? 'msg-bubble__time--mine' : 'msg-bubble__time--theirs'}`}>
          {time}
        </p>
      </div>
    </div>
  );
}
