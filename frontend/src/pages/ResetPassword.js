import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';

function ResetPassword() {
  usePageMeta('Reset Password');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired reset link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
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
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Choose a new password
        </h2>

        {success ? (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              ✅ Password updated successfully!
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
          </div>
        ) : !token ? (
          <div>
            <p style={{ color: '#cc0000', marginBottom: '1rem' }}>
              Invalid reset link. Please request a new one.
            </p>
            <Link to="/forgot-password" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Request new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: '#cc0000', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(204,0,0,0.08)', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
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
              }}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
