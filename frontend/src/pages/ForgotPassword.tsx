import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { usePageMeta } from '../hooks/usePageMeta';
import './ForgotPassword.css';

function ForgotPassword() {
  usePageMeta('Forgot Password');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch {
      // Still show success to not leak email existence
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot__page">
      <div className="forgot__card">
        <h2 className="forgot__title">Reset your password</h2>

        {submitted ? (
          <div>
            <p className="forgot__success-text">
              ✅ Check your email — if that address is registered, we've sent a reset link.
            </p>
            <Link to="/login" className="forgot__back-link">← Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="forgot__description">
              Enter your email and we'll send you a reset link.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="forgot__input"
            />

            <button
              type="submit"
              disabled={loading}
              className={`forgot__btn${loading ? ' forgot__btn--loading' : ''}`}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <div className="forgot__footer">
              <Link to="/login" className="forgot__back-link">← Back to Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
