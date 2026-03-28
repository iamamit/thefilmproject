import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './Company.css';

const typeColors = {
  STUDIO: '#0a66c2', PRODUCTION_HOUSE: '#9b59b6', OTT: '#e74c3c',
  AGENCY: '#f39c12', INDEPENDENT: '#2ecc71', PLATFORM: '#1abc9c'
};

function Company() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');
  const myId = parseInt(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');

  useEffect(() => { fetchCompany(); }, [slug]);

  const fetchCompany = async () => {
    try {
      const res = await api.get('/companies/' + slug);
      setCompany(res.data);
      setFollowers(res.data.followerCount);
      if (token) {
        try {
          const followRes = await api.get('/companies/' + slug + '/follow');
          setFollowing(followRes.data.following);
        } catch {}
      }
    } catch { navigate('/'); }
    finally { setLoading(false); }
  };

  const toggleFollow = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      const res = await api.post('/companies/' + slug + '/follow');
      setFollowing(res.data.following);
      setFollowers(res.data.followers);
    } catch {}
  };

  if (loading) return (
    <div className="company__loading">
      <p className="company__loading-text">Loading...</p>
    </div>
  );

  if (!company) return null;

  const typeColor = typeColors[company.type] || '#0a66c2';
  const isOwner = company.createdBy && company.createdBy.id === myId;

  const coverStyle = company.coverUrl
    ? { background: `url(${company.coverUrl}) center/cover` }
    : { background: `linear-gradient(135deg, ${typeColor}44, ${typeColor}22)` };

  const logoStyle = company.logoUrl
    ? {}
    : { background: typeColor };

  const typeBadgeStyle = {
    background: typeColor + '22',
    color: typeColor,
  };

  return (
    <div className="company">
      <div className="company__cover" style={coverStyle}>
        {company.isOfficial && (
          <div className="company__official-badge">
            <span className="company__official-label">★ Official Page</span>
          </div>
        )}
      </div>

      <div className="company__body">
        <div className="company__header">
          <div className="company__logo" style={logoStyle}>
            {company.logoUrl
              ? <img src={company.logoUrl} alt={company.name} className="company__logo-img" />
              : company.name && company.name.charAt(0)}
          </div>
          <div className="company__info">
            <div className="company__name-row">
              <h1 className="company__name">{company.name}</h1>
              {company.isVerified && <span className="company__verified">✓</span>}
            </div>
            <div className="company__meta">
              {company.type && (
                <span className="company__type-badge" style={typeBadgeStyle}>
                  {company.type.replace('_', ' ')}
                </span>
              )}
              {company.city && <span className="company__city">📍 {company.city}</span>}
              <span className="company__followers">👥 {followers} followers</span>
            </div>
          </div>
          <div className="company__actions">
            {token && !isOwner && (
              <button
                onClick={toggleFollow}
                className={`company__follow-btn ${following ? 'company__follow-btn--following' : 'company__follow-btn--not-following'}`}
              >
                {following ? 'Following' : '+ Follow'}
              </button>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="company__website-link">
                🌐 Website
              </a>
            )}
          </div>
        </div>

        {company.bio && (
          <div className="company__bio-card">
            <p className="company__bio-text">{company.bio}</p>
          </div>
        )}

        <div className="company__tabs">
          {['posts', 'about'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`company__tab ${activeTab === tab ? 'company__tab--active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div>
            {posts.length === 0 ? (
              <div className="company__empty-card">
                <p className="company__empty-text">No posts yet. Check back soon! 🎬</p>
              </div>
            ) : posts.map(post => (
              <div key={post.id} className="company__post-card">
                <p className="company__post-text">{post.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="company__about-card">
            <h3 className="company__about-title">About {company.name}</h3>
            {company.bio && <p className="company__about-bio">{company.bio}</p>}
            <div className="company__about-details">
              {company.type && <p className="company__about-detail">🏢 {company.type.replace('_', ' ')}</p>}
              {company.city && <p className="company__about-detail">📍 {company.city}, {company.country}</p>}
              {company.website && (
                <p className="company__about-detail">
                  🌐 <a href={company.website} target="_blank" rel="noreferrer" className="company__about-link">{company.website}</a>
                </p>
              )}
              <p className="company__about-detail">👥 {followers} followers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Company;
