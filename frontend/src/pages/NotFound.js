import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import './NotFound.css';

function NotFound() {
  usePageMeta('Page Not Found');
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <span className="not-found__icon">🎬</span>
      <h1 className="not-found__title">Scene not found</h1>
      <p className="not-found__subtitle">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/home')}
        className="not-found__btn"
      >
        Back to Home
      </button>
    </div>
  );
}

export default NotFound;
