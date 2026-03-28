import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';

function VerifyEmail() {
  usePageMeta('Verify Email');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    api.get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Invalid or expired verification link.');
      });
  }, [token]);

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
        {status === 'loading' && (
          <p style={{ color: 'var(--text-secondary)' }}>Verifying your email...</p>
        )}
        {status === 'success' && (
          <>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✅</span>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Email verified!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Your account is now active. You can sign in.
            </p>
            <Link
              to="/login"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '20px',
                fontSize: '0.95rem',
              }}
            >
              Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>❌</span>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Verification failed</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {message}
            </p>
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
