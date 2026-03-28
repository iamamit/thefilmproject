import React, { ReactNode } from 'react';
import { UserSummary } from '../../../types';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { RoleBadge } from '../RoleBadge/RoleBadge';
import './ConnectionCard.css';

interface ConnectionCardProps {
  user: UserSummary;
  actions?: ReactNode;
  label?: string;
}

export function ConnectionCard({ user, actions, label }: ConnectionCardProps) {
  return (
    <div className="conn-card">
      <Avatar photoUrl={user.profilePhotoUrl} name={user.fullName} size={48} />
      <div className="conn-card__info">
        <p className="conn-card__name">{user.fullName}</p>
        <p className="conn-card__username">@{user.username}</p>
        {user.city && <p className="conn-card__city">📍 {user.city}</p>}
        <div className="conn-card__roles">
          {user.roles?.slice(0, 2).map(r => <RoleBadge key={r} role={r} />)}
        </div>
      </div>
      <div className="conn-card__actions">
        {label && <span className="conn-card__label">{label}</span>}
        {actions}
      </div>
    </div>
  );
}
