import React, { ReactNode } from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  maxWidth?: number;
}

export function AuthLayout({ title, children, maxWidth = 400 }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card" style={{ maxWidth }}>
        <h2 className="auth-layout__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
