import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';
import './CheckEmail.css';

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
    <div className="check-email">
      <div className="check-email__card">
        <span className="check-email__icon">📬</span>
        <h2 className="check-email__title">
          Check your inbox
        </h2>
        <p className="check-email__body">
          We sent a verification link to <strong>{email || 'your email'}</strong>.
          Click the link to activate your account.
        </p>
        <p className="check-email__hint">
          Didn't get it? Check your spam folder or{' '}
          {email ? (
            <button
              onClick={handleResend}
              className="check-email__resend-btn"
            >
              resend the email
            </button>
          ) : 'try again.'}
        </p>
        <Link to="/login" className="check-email__back-link">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default CheckEmail;
