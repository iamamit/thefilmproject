import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';

function CheckEmail() {
  usePageMeta('Check Your Email');
  const email = sessionStorage.getItem('pendingVerificationEmail') || '';

  const handleResend = async () => {
    if (!email) return;
    try {
      await api.post('/auth/resend-verification', { email });
      alert('Resent! Check your inbox.');
    } catch {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📬</span>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          Check your inbox
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          We sent a verification link to <strong>{email || 'your email'}</strong>.
          Click the link to activate your account.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Didn't get it? Check your spam folder or{' '}
          {email ? (
            <button
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: 0,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              resend the email
            </button>
          ) : 'try again.'}
        </p>
        <Link
          to="/login"
          style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default CheckEmail;
