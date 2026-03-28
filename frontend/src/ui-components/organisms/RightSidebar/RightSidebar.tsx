import React from 'react';
import './RightSidebar.css';

const trendingRoles = ['VFX Artist', 'Content Creator', 'Music Composer', 'Script Writer'];

export function RightSidebar() {
  return (
    <div className="right-sidebar">
      <div className="right-sidebar__about-card">
        <p className="right-sidebar__about-title">🎬 About CollabNow</p>
        <p className="right-sidebar__about-text">
          India's professional network for film &amp; content creators. Connect, collaborate, and create.
        </p>
      </div>
      <div className="right-sidebar__trending-card">
        <p className="right-sidebar__trending-title">🔥 Trending Roles</p>
        {trendingRoles.map(role => (
          <div key={role} className="right-sidebar__trending-item">
            <div className="right-sidebar__trending-dot" />
            <p className="right-sidebar__trending-role">{role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
