import React from 'react';
import './Badge.css';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color, size = 'md' }: BadgeProps) {
  const style = color
    ? { background: `${color}22`, color, border: `1px solid ${color}44` }
    : undefined;

  return (
    <span className={`badge badge--${size}`} style={style}>
      {label}
    </span>
  );
}
