import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

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
        const followRes = await api.get('/companies/' + slug + '/follow');
        setFollowing(followRes.data.following);
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
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  );

  if (!company) return null;

  const typeColor = typeColors[company.type] || '#0a66c2';
  const isOwner = company.createdBy && company.createdBy.id === myId;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{
        height: '200px',
        background: company.coverUrl ? ('url(' + company.coverUrl + ') center/cover') : ('linear-gradient(135deg, ' + typeColor + '44, ' + typeColor + '22)'),
        position: 'relative'
      }}>
        {company.isOfficial && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', padding: '0.3rem 0.8rem' }}>
            <span style={{ color: '#ffd700', fontSize: '0.8rem' }}>★ Official Page</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '-50px', marginBottom: '1rem' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '12px',
            background: company.logoUrl ? 'transparent' : typeColor,
            border: '3px solid var(--bg-primary)', overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', color: '#fff'
          }}>
            {company.logoUrl
              ? <img src={company.logoUrl} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : company.name && company.name.charAt(0)}
          </div>
          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.4rem' }}>{company.name}</h1>
              {company.isVerified && <span style={{ color: '#0a66c2' }}>✓</span>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
              {company.type && (
                <span style={{ background: typeColor + '22', color: typeColor, fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: '600' }}>
                  {company.type.replace('_', ' ')}
                </span>
              )}
              {company.city && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {company.city}</span>}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>👥 {followers} followers</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '0.5rem' }}>
            {token && !isOwner && (
              <button onClick={toggleFollow} style={{
                background: following ? 'var(--bg-hover)' : 'var(--accent)',
                color: following ? 'var(--text-primary)' : '#fff',
                border: following ? '1px solid var(--border)' : 'none',
                borderRadius: '20px', padding: '0.5rem 1.2rem',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem'
              }}>{following ? 'Following' : '+ Follow'}</button>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" style={{
                background: 'var(--bg-hover)', color: 'var(--accent)',
                border: '1px solid var(--border)', borderRadius: '20px',
                padding: '0.5rem 1.2rem', textDecoration: 'none', fontSize: '0.9rem'
              }}>🌐 Website</a>
            )}
          </div>
        </div>

        {company.bio && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{company.bio}</p>
          </div>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          {['posts', 'about'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: 'none', border: 'none', padding: '0.7rem 1.2rem',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400',
              textTransform: 'capitalize', fontSize: '0.9rem'
            }}>{tab}</button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div>
            {posts.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No posts yet. Check back soon! 🎬</p>
              </div>
            ) : posts.map(post => (
              <div key={post.id} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>{post.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 0 }}>About {company.name}</h3>
            {company.bio && <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{company.bio}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {company.type && <p style={{ color: 'var(--text-secondary)', margin: 0 }}>🏢 {company.type.replace('_', ' ')}</p>}
              {company.city && <p style={{ color: 'var(--text-secondary)', margin: 0 }}>📍 {company.city}, {company.country}</p>}
              {company.website && <p style={{ color: 'var(--text-secondary)', margin: 0 }}>🌐 <a href={company.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{company.website}</a></p>}
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>👥 {followers} followers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Company;
