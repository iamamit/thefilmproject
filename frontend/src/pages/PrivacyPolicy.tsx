import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  usePageMeta('Privacy Policy');

  return (
    <div className="privacy">
      <div className="privacy__content">
        <div className="privacy__back">
          <Link to="/home" className="privacy__back-link">
            ← Back to TheFilmProject
          </Link>
        </div>
        <h1 className="privacy__title">Privacy Policy</h1>
        <p className="privacy__updated">Last updated: March 2025</p>

        <h2 className="privacy__section-title">1. Information We Collect</h2>
        <p className="privacy__paragraph">
          We collect information you provide directly, including: name, email address, username, profile information, portfolio content, and messages. We also collect usage data such as pages visited, features used, and device information.
        </p>

        <h2 className="privacy__section-title">2. How We Use Your Information</h2>
        <p className="privacy__paragraph">
          We use your information to: provide and improve the Platform; send account-related communications; enable connections and messaging between users; show relevant content and creators; and comply with legal obligations.
        </p>

        <h2 className="privacy__section-title">3. Information Sharing</h2>
        <p className="privacy__paragraph">
          Your profile, posts, and portfolio are publicly visible to other users. We do not sell your personal information to third parties. We may share information with service providers who assist in operating the Platform, subject to confidentiality agreements.
        </p>

        <h2 className="privacy__section-title">4. Data Security</h2>
        <p className="privacy__paragraph">
          We implement industry-standard security measures including encryption, secure connections (HTTPS), and hashed password storage. However, no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="privacy__section-title">5. Cookies</h2>
        <p className="privacy__paragraph">
          We use localStorage to store your authentication token and preferences. We do not use tracking cookies for advertising purposes.
        </p>

        <h2 className="privacy__section-title">6. Your Rights (DPDP Act 2023)</h2>
        <p className="privacy__paragraph">
          Under India's Digital Personal Data Protection Act 2023, you have the right to: access your personal data; correct inaccurate data; request deletion of your account and data; and withdraw consent. Contact us at privacy@thefilmproject.in to exercise these rights.
        </p>

        <h2 className="privacy__section-title">7. Data Retention</h2>
        <p className="privacy__paragraph">
          We retain your data for as long as your account is active. Upon account deletion, we will delete your personal data within 30 days, except where retention is required by law.
        </p>

        <h2 className="privacy__section-title">8. Third-Party Services</h2>
        <p className="privacy__paragraph">
          We use Google OAuth for authentication. When you use Google Sign-In, Google's Privacy Policy also applies. We may link to third-party content (e.g., YouTube videos in portfolios) which are governed by their own privacy policies.
        </p>

        <h2 className="privacy__section-title">9. Children's Privacy</h2>
        <p className="privacy__paragraph">
          The Platform is not intended for users under 18 years of age. We do not knowingly collect personal information from minors.
        </p>

        <h2 className="privacy__section-title">10. Changes to This Policy</h2>
        <p className="privacy__paragraph">
          We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the Platform.
        </p>

        <h2 className="privacy__section-title">11. Contact</h2>
        <p className="privacy__paragraph">
          For privacy-related queries, contact our Data Protection Officer at privacy@thefilmproject.in
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
