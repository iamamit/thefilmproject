import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import './TermsOfService.css';

function TermsOfService() {
  usePageMeta('Terms of Service');

  return (
    <div className="terms">
      <div className="terms__content">
        <div className="terms__back">
          <Link to="/home" className="terms__back-link">
            ← Back to TheFilmProject
          </Link>
        </div>
        <h1 className="terms__title">Terms of Service</h1>
        <p className="terms__updated">
          Last updated: March 2025
        </p>

        <h2 className="terms__section-title">1. Acceptance of Terms</h2>
        <p className="terms__paragraph">
          By accessing or using TheFilmProject ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.
        </p>

        <h2 className="terms__section-title">2. Eligibility</h2>
        <p className="terms__paragraph">
          You must be at least 18 years old to use the Platform. By using the Platform, you represent that you meet this requirement.
        </p>

        <h2 className="terms__section-title">3. User Accounts</h2>
        <p className="terms__paragraph">
          You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Each person may only maintain one account.
        </p>

        <h2 className="terms__section-title">4. User Content</h2>
        <p className="terms__paragraph">
          You retain ownership of content you post on the Platform. By posting content, you grant TheFilmProject a non-exclusive, worldwide, royalty-free license to display and distribute your content on the Platform. You are solely responsible for ensuring your content does not infringe any third-party rights.
        </p>

        <h2 className="terms__section-title">5. Prohibited Conduct</h2>
        <p className="terms__paragraph">
          You agree not to: (a) post offensive, harmful, or illegal content; (b) harass, abuse, or threaten other users; (c) spam or send unsolicited messages; (d) attempt to gain unauthorized access to the Platform; (e) use automated means to access the Platform without permission.
        </p>

        <h2 className="terms__section-title">6. Intellectual Property</h2>
        <p className="terms__paragraph">
          The Platform and its original content (excluding user-generated content) are owned by TheFilmProject and protected by applicable intellectual property laws.
        </p>

        <h2 className="terms__section-title">7. Termination</h2>
        <p className="terms__paragraph">
          We reserve the right to suspend or terminate your account at our discretion if you violate these Terms or engage in conduct we deem harmful to the Platform or its users.
        </p>

        <h2 className="terms__section-title">8. Limitation of Liability</h2>
        <p className="terms__paragraph">
          TheFilmProject is provided on an "as is" basis. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
        </p>

        <h2 className="terms__section-title">9. Governing Law</h2>
        <p className="terms__paragraph">
          These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai, Maharashtra.
        </p>

        <h2 className="terms__section-title">10. Changes to Terms</h2>
        <p className="terms__paragraph">
          We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the new Terms.
        </p>

        <h2 className="terms__section-title">11. Contact</h2>
        <p className="terms__paragraph">
          For questions about these Terms, contact us at legal@thefilmproject.in
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;
