import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';
import './ResetPassword.css';

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

  return (
    <div className="reset__page">
      <div className="reset__card">
        <h2 className="reset__title">Choose a new password</h2>

        {success ? (
          <div>
            <p className="reset__success-text">
              ✅ Password updated successfully!
            </p>
            <Link to="/login" className="reset__signin-link">
              Sign In
            </Link>
          </div>
        ) : !token ? (
          <div>
            <div className="auth-error">
              Invalid reset link. Please request a new one.
            </div>
            <Link to="/forgot-password" className="reset__invalid-link">
              Request new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">{error}</div>
            )}

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="reset__input"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="reset__input"
            />

            <button
              type="submit"
              disabled={loading}
              className={`reset__btn${loading ? ' reset__btn--loading' : ''}`}
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
