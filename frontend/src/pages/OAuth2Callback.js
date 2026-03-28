import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OAuth2Callback.css';

function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OAuth2Callback mounted, URL:", window.location.href);
    const params = new URLSearchParams(window.location.search);
    console.log("Token found:", params.get('token') ? 'YES' : 'NO');
    const token = params.get('token');
    const username = params.get('username');
    const fullName = params.get('fullName');
    const userId = params.get('userId');
    const photo = params.get('photo');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('userId', userId);
      if (photo) localStorage.setItem('profilePhoto', photo);
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="oauth2-callback">
      <p className="oauth2-callback__message">🔐 Signing you in with Google...</p>
    </div>
  );
}

export default OAuth2Callback;
