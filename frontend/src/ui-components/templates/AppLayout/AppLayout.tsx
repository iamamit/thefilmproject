import React, { ReactNode } from 'react';
import './AppLayout.css';

interface AppLayoutProps {
  left?: ReactNode;
  center: ReactNode;
  right?: ReactNode;
}

export function AppLayout({ left, center, right }: AppLayoutProps) {
  return (
    <div className="app-layout">
      {left  && <aside className="app-layout__left">{left}</aside>}
      <main  className="app-layout__center">{center}</main>
      {right && <aside className="app-layout__right">{right}</aside>}
    </div>
  );
}
