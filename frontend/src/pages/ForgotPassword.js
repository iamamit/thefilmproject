import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';

function ForgotPassword() {
  usePageMeta('Forgot Password');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      // Still show success to not leak email existence
      setSubmitted(true);
    } finally {
      setLoading(false);
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
        maxWidth: '400px',
      }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          Reset your password
        </h2>

        {submitted ? (
          <div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              ✅ Check your email — if that address is registered, we've sent a reset link.
            </p>
            <Link
              to="/login"
              style={{
                color: 'var(--accent)',
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              ← Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '0.7rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                boxSizing: 'border-box',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: '1rem',
              }}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
