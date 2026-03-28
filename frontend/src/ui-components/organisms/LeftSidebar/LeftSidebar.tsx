import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../atoms/Avatar/Avatar';
import './LeftSidebar.css';

interface LeftSidebarProps {
  isLoggedIn: boolean;
  fullName?: string | null;
  username?: string | null;
  profilePhoto?: string | null;
}

const quickLinks = [
  { icon: '🧭', label: 'Discover Creators', path: '/discover' },
  { icon: '🤝', label: 'My Network',         path: '/connections' },
  { icon: '💬', label: 'Messages',           path: '/messages' },
];

export function LeftSidebar({ isLoggedIn, fullName, username, profilePhoto }: LeftSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="left-sidebar">
      {isLoggedIn ? (
        <div className="left-sidebar__card">
          <div className="left-sidebar__banner" />
          <div className="left-sidebar__body">
            <div className="left-sidebar__avatar-wrap">
              <Avatar photoUrl={profilePhoto} name={fullName || username} size={56} />
            </div>
            <p className="left-sidebar__name">{fullName}</p>
            <p className="left-sidebar__username">@{username}</p>
            <div className="left-sidebar__actions">
              <button onClick={() => navigate(`/profile/${username}`)} className="left-sidebar__btn-profile">
                View Profile
              </button>
              <button onClick={() => navigate('/connections')} className="left-sidebar__btn-network">
                My Network
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="left-sidebar__guest-card">
          <p className="left-sidebar__guest-icon">🎬</p>
          <p className="left-sidebar__guest-title">Join CollabNow</p>
          <p className="left-sidebar__guest-subtitle">Connect with India's best film creators</p>
          <button onClick={() => navigate('/register')} className="left-sidebar__btn-join">Join Now</button>
          <button onClick={() => navigate('/login')} className="left-sidebar__btn-signin">Sign In</button>
        </div>
      )}

      <div className="left-sidebar__quicknav">
        {quickLinks.map(({ icon, label, path }) => (
          <button key={path} onClick={() => navigate(path)} className="left-sidebar__quicknav-btn">
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
