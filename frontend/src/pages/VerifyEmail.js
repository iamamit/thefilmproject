import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';
import './VerifyEmail.css';

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
    <div className="verify-email">
      <div className="verify-email__card">
        {status === 'loading' && (
          <p className="verify-email__loading-text">Verifying your email...</p>
        )}
        {status === 'success' && (
          <>
            <span className="verify-email__icon">✅</span>
            <h2 className="verify-email__title">Email verified!</h2>
            <p className="verify-email__body">
              Your account is now active. You can sign in.
            </p>
            <Link to="/login" className="verify-email__signin-link">
              Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <span className="verify-email__icon">❌</span>
            <h2 className="verify-email__title">Verification failed</h2>
            <p className="verify-email__body">
              {message}
            </p>
            <Link to="/login" className="verify-email__back-link">
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
