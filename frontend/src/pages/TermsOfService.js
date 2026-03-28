import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

function TermsOfService() {
  usePageMeta('Terms of Service');

  const containerStyle = {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    fontFamily: 'DM Sans, sans-serif',
    color: 'var(--text-primary)',
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  };

  const h2Style = {
    color: 'var(--text-primary)',
    marginTop: '2rem',
    marginBottom: '0.5rem',
    fontSize: '1.2rem',
  };

  const pStyle = {
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    marginBottom: '1rem',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/home" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to TheFilmProject
          </Link>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Last updated: March 2025
        </p>

        <h2 style={h2Style}>1. Acceptance of Terms</h2>
        <p style={pStyle}>
          By accessing or using TheFilmProject ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.
        </p>

        <h2 style={h2Style}>2. Eligibility</h2>
        <p style={pStyle}>
          You must be at least 18 years old to use the Platform. By using the Platform, you represent that you meet this requirement.
        </p>

        <h2 style={h2Style}>3. User Accounts</h2>
        <p style={pStyle}>
          You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Each person may only maintain one account.
        </p>

        <h2 style={h2Style}>4. User Content</h2>
        <p style={pStyle}>
          You retain ownership of content you post on the Platform. By posting content, you grant TheFilmProject a non-exclusive, worldwide, royalty-free license to display and distribute your content on the Platform. You are solely responsible for ensuring your content does not infringe any third-party rights.
        </p>

        <h2 style={h2Style}>5. Prohibited Conduct</h2>
        <p style={pStyle}>
          You agree not to: (a) post offensive, harmful, or illegal content; (b) harass, abuse, or threaten other users; (c) spam or send unsolicited messages; (d) attempt to gain unauthorized access to the Platform; (e) use automated means to access the Platform without permission.
        </p>

        <h2 style={h2Style}>6. Intellectual Property</h2>
        <p style={pStyle}>
          The Platform and its original content (excluding user-generated content) are owned by TheFilmProject and protected by applicable intellectual property laws.
        </p>

        <h2 style={h2Style}>7. Termination</h2>
        <p style={pStyle}>
          We reserve the right to suspend or terminate your account at our discretion if you violate these Terms or engage in conduct we deem harmful to the Platform or its users.
        </p>

        <h2 style={h2Style}>8. Limitation of Liability</h2>
        <p style={pStyle}>
          TheFilmProject is provided on an "as is" basis. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
        </p>

        <h2 style={h2Style}>9. Governing Law</h2>
        <p style={pStyle}>
          These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai, Maharashtra.
        </p>

        <h2 style={h2Style}>10. Changes to Terms</h2>
        <p style={pStyle}>
          We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new Terms.
        </p>

        <h2 style={h2Style}>11. Contact</h2>
        <p style={pStyle}>
          For questions about these Terms, contact us at legal@thefilmproject.in
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;
