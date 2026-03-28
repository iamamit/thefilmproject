import React from 'react';
import { UserRole } from '../../../types/enums';
import { roleColors } from '../../../utils/roleColors';
import './RoleBadge.css';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const color = roleColors[role] ?? '#0a66c2';
  return (
    <span
      className={`role-badge role-badge--${size}`}
      style={{ color, background: `${color}18`, border: `1px solid ${color}33` }}
    >
      {role.replace('_', ' ')}
    </span>
  );
}
