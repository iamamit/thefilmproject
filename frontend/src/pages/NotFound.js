import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

function NotFound() {
  usePageMeta('Page Not Found');
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <span style={{ fontSize: '4rem' }}>🎬</span>
      <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', margin: 0 }}>Scene not found</h1>
      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/home')}
        style={{
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '0.6rem 1.5rem',
          fontSize: '0.9rem',
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          marginTop: '0.5rem',
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default NotFound;
