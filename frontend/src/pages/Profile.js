import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Avatar from '../components/AvatarUpload';
import { usePageMeta } from '../hooks/usePageMeta';
import './Profile.css';

const roleColors = {
  DIRECTOR: '#0a66c2', EDITOR: '#0073b1', MUSICIAN: '#9b59b6',
  PRODUCER: '#f39c12', ACTOR: '#1abc9c', CINEMATOGRAPHER: '#e67e22',
  VFX_ARTIST: '#3498db', WRITER: '#2ecc71'
};
const levelColors = { BEGINNER: '#8899aa', INTERMEDIATE: '#f39c12', EXPERT: '#0a66c2' };

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const projectColors = {
  FILM: { bg: '#0a66c2', label: '🎬 Film Project' },
  MUSIC: { bg: '#9b59b6', label: '🎵 Music Project' },
  WRITING: { bg: '#f39c12', label: '✍️ Writing Project' },
  PHOTOGRAPHY: { bg: '#1abc9c', label: '📸 Photography Project' },
  THEATRE: { bg: '#e74c3c', label: '🎭 Theatre Project' },
  DIGITAL: { bg: '#2ecc71', label: '🎮 Digital Project' },
};

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
  return match ? match[1] : null;
}

function PortfolioCard({ item, isOwn, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const ytId = getYouTubeId(item.videoUrl);
  const categoryColors = {
    'Short Film': '#0a66c2', 'Music Video': '#9b59b6', 'Documentary': '#1abc9c',
    'Ad Film': '#f39c12', 'Reel': '#e74c3c', 'Photography': '#3498db', 'Other': '#8899aa'
  };
  const catColor = categoryColors[item.category] || '#8899aa';

  return (
    <div className="profile__card">
      {/* Category banner — background is data-driven */}
      <div className="portfolio-card__banner" style={{ background: catColor }}>
        <span className="portfolio-card__banner-label">{item.category}</span>
        {isOwn && (
          <button onClick={() => onDelete(item.id)} className="portfolio-card__delete-btn">🗑️</button>
        )}
      </div>
      <div className="portfolio-card__body">
        <h3 className="portfolio-card__title">{item.title}</h3>
        <p className="portfolio-card__description">{item.description}</p>
        {ytId && !expanded && (
          <div onClick={() => setExpanded(true)} className="portfolio-card__thumbnail">
            <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={item.title}
              className="portfolio-card__thumbnail-img" />
            <div className="portfolio-card__play-overlay">
              <div className="portfolio-card__play-btn">
                <span className="portfolio-card__play-icon">▶</span>
              </div>
            </div>
          </div>
        )}
        {ytId && expanded && (
          <div className="portfolio-card__video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              className="portfolio-card__iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen title={item.title}
            />
          </div>
        )}
        {item.imageUrl && !item.videoUrl && (
          <img src={item.imageUrl} alt={item.title} className="portfolio-card__image" />
        )}
      </div>
    </div>
  );
}

function ProfilePostCard({ post, idx, postsLen, myUsername, token }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingC, setLoadingC] = useState(false);
  const fullName = localStorage.getItem('fullName');

  const fetchComments = async () => {
    setLoadingC(true);
    try { const res = await api.get(`/posts/${post.id}/comments`); setComments(res.data); }
    catch {} finally { setLoadingC(false); }
  };

  const toggle = () => { if (!showComments) fetchComments(); setShowComments(!showComments); };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: commentText });
      setComments([...comments, res.data]);
      setCommentText('');
    } catch {}
  };

  const deleteComment = async (commentId) => {
    try { await api.delete(`/posts/${post.id}/comments/${commentId}`); setComments(comments.filter(c => c.id !== commentId)); }
    catch {}
  };

  const projectColor = (projectColors[post.projectType] || projectColors.FILM).bg;

  return (
    <div style={{
      borderBottom: idx < postsLen - 1 ? '1px solid var(--border)' : 'none',
      borderLeft: post.project ? `4px solid ${projectColor}` : 'none',
    }}>
      {post.project && (
        <div className="post-card__project-banner" style={{ background: `linear-gradient(90deg, ${projectColor} 0%, ${projectColor}cc 100%)` }}>
          <span className="post-card__project-label">{(projectColors[post.projectType] || projectColors.FILM).label}</span>
          <span className="post-card__collab-label">🔍 Looking for collaborators</span>
        </div>
      )}
      <div className="post-card__body">
        <p className="post-card__content">{post.content}</p>
        <div className="post-card__meta">
          <span className="post-card__likes">❤️ {post.likedByUserIds?.length || 0}</span>
          <span className="post-card__time">· {timeAgo(post.createdAt)}</span>
          <button onClick={toggle} className={`post-card__comment-toggle ${showComments ? 'post-card__comment-toggle--active' : 'post-card__comment-toggle--inactive'}`}>
            💬 {showComments ? 'Hide' : 'View Comments'}
          </button>
        </div>
      </div>
      {showComments && (
        <div className="post-card__comments">
          {loadingC && <p className="post-card__loading">Loading...</p>}
          {comments.map(comment => (
            <div key={comment.id} className="post-card__comment-item">
              <div className="post-card__comment-avatar">{comment.author?.fullName?.charAt(0)}</div>
              <div className="post-card__comment-bubble">
                <div className="post-card__comment-header">
                  <span className="post-card__comment-author">{comment.author?.fullName}</span>
                  <div className="post-card__comment-actions">
                    <span className="post-card__comment-time">{timeAgo(comment.createdAt)}</span>
                    {comment.author?.username === myUsername && (
                      <button onClick={() => deleteComment(comment.id)} className="post-card__comment-delete">🗑️</button>
                    )}
                  </div>
                </div>
                <p className="post-card__comment-text">{comment.content}</p>
              </div>
            </div>
          ))}
          {token && (
            <div className="post-card__new-comment">
              <div className="post-card__comment-avatar">{fullName?.charAt(0)}</div>
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitComment()}
                placeholder="Add a comment..."
                className="post-card__new-comment-input"
              />
              <button onClick={submitComment} disabled={!commentText.trim()}
                className={`post-card__submit-btn ${commentText.trim() ? 'post-card__submit-btn--active' : 'post-card__submit-btn--disabled'}`}>
                Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  usePageMeta(user ? `${user.fullName}'s Profile` : 'Profile', user ? `${user.fullName} — ${user.roles?.[0]?.replace('_', ' ')} on TheFilmProject` : null);
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', category: 'Short Film', videoUrl: '', imageUrl: '' });
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const myUsername = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const isOwn = username === myUsername;

  const handlePhotoUpdated = (newPhoto) => {
    setUser(prev => ({ ...prev, profilePhotoUrl: newPhoto }));
  };

  useEffect(() => { fetchProfile(); }, [username]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [userRes, skillsRes] = await Promise.all([
        api.get(`/users/${username}`),
        api.get(`/skills/user/${username}`),
      ]);
      setUser(userRes.data);
      setSkills(skillsRes.data);
      try {
        const postsRes = await api.get(`/posts/user/${userRes.data.id}`);
        setPosts(postsRes.data.content || []);
      } catch {}
      try { const portRes = await api.get(`/portfolio/${username}`); setPortfolio(portRes.data); } catch {}
      if (token && !isOwn) {
        try {
          const connRes = await api.get('/connections');
          const conn = connRes.data.find(c => c.sender.id === userRes.data.id || c.receiver.id === userRes.data.id);
          if (conn) { setConnectionStatus(conn.status); setConnectionId(conn.id); return; }
          const pendingRes = await api.get('/connections/pending');
          const pending = pendingRes.data.find(c => c.sender.id === userRes.data.id);
          if (pending) { setConnectionStatus('PENDING_INCOMING'); setConnectionId(pending.id); return; }
          const sentRes = await api.get('/connections/sent');
          const sent = sentRes.data.find(c => c.receiver.id === userRes.data.id);
          if (sent) setConnectionStatus('PENDING_SENT');
        } catch {}
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const sendConnection = async () => {
    try { await api.post(`/connections/request/${user.id}`); setConnectionStatus('PENDING_SENT'); }
    catch (err) { alert(err.response?.data || 'Error'); }
  };

  const respondConnection = async (accept) => {
    try { await api.patch(`/connections/${connectionId}/respond?accept=${accept}`); setConnectionStatus(accept ? 'ACCEPTED' : null); }
    catch {}
  };

  const deletePortfolioItem = async (id) => {
    try { await api.delete(`/portfolio/${id}`); setPortfolio(portfolio.filter(p => p.id !== id)); } catch {}
  };

  const addPortfolioItem = async () => {
    if (!newItem.title.trim()) return;
    try {
      const res = await api.post('/portfolio', newItem);
      setPortfolio([res.data, ...portfolio]);
      setNewItem({ title: '', description: '', category: 'Short Film', videoUrl: '', imageUrl: '' });
      setShowAddPortfolio(false);
    } catch {}
  };

  if (loading) return (
    <div className="profile__loading"><p>Loading...</p></div>
  );
  if (!user) return (
    <div className="profile__loading"><p>User not found</p></div>
  );

  return (
    <div className="profile__page">
      <div className="profile__layout">
        <div>
          {/* Profile Card */}
          <div className="profile__card">
            <div className="profile__banner" />
            <div className="profile__card-body">
              <div className="profile__header-row">
                <div className="profile__avatar-wrapper">
                  <Avatar user={user} size={100} editable={isOwn} onUpdated={handlePhotoUpdated} />
                </div>
                <div className="profile__actions">
                  {isOwn ? (
                    <button onClick={() => navigate('/edit-profile')} className="profile__btn profile__btn--edit">✏️ Edit Profile</button>
                  ) : (<>
                    {!connectionStatus && <button onClick={sendConnection} className="profile__btn profile__btn--connect">🤝 Connect</button>}
                    {connectionStatus === 'PENDING_SENT' && <button disabled className="profile__btn profile__btn--pending">⏳ Pending</button>}
                    {connectionStatus === 'PENDING_INCOMING' && <>
                      <button onClick={() => respondConnection(true)} className="profile__btn profile__btn--accept">✅ Accept</button>
                      <button onClick={() => respondConnection(false)} className="profile__btn profile__btn--decline">❌ Decline</button>
                    </>}
                    {connectionStatus === 'ACCEPTED' && <button onClick={() => navigate(`/messages?user=${user.id}&name=${user.fullName}`)} className="profile__btn profile__btn--message">💬 Message</button>}
                  </>)}
                </div>
              </div>
              <h1 className="profile__name">{user.fullName}</h1>
              <p className="profile__username">@{user.username}</p>
              {user.bio && <p className="profile__bio">{user.bio}</p>}
              <div className="profile__meta">
                {user.city && <span className="profile__meta-item">📍 {user.city}{user.country ? `, ${user.country}` : ''}</span>}
                {user.availableForWork && <span className="profile__meta-item--available">✅ Available for work</span>}
                <span className="profile__meta-item--joined">🗓️ {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="profile__roles">
                {user.roles?.map(role => (
                  <span key={role} className="profile__role-badge" style={{
                    background: `${roleColors[role] || '#0a66c2'}18`,
                    color: roleColors[role] || '#0a66c2',
                    border: `1px solid ${roleColors[role] || '#0a66c2'}44`,
                  }}>{role.replace('_', ' ')}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="profile__card">
              <div className="profile__section-header">
                <h2 className="profile__section-title">Skills & Tools</h2>
                <div className="profile__skills-list">
                  {skills.map(skill => (
                    <div key={skill.id} className="profile__skill-chip">
                      <span className="profile__skill-name">{skill.name}</span>
                      <span className="profile__skill-level" style={{ color: levelColors[skill.level] }}>{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages */}
          {user.languages?.length > 0 && (
            <div className="profile__card">
              <div className="profile__section-header">
                <h2 className="profile__section-title--sm-gap">Languages</h2>
                <div className="profile__languages-list">
                  {user.languages.map(lang => (
                    <span key={lang} className="profile__language-chip">🗣️ {lang}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio */}
          {(portfolio.length > 0 || isOwn) && (
            <div className="profile__card">
              <div className="profile__card-title-row">
                <h2 className="profile__section-title--no-margin">🎬 Portfolio</h2>
                {isOwn && (
                  <button onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                    className={showAddPortfolio ? 'profile__btn--portfolio-cancel' : 'profile__btn--portfolio-add'}>
                    {showAddPortfolio ? '✕ Cancel' : '+ Add Project'}
                  </button>
                )}
              </div>
              {showAddPortfolio && (
                <div className="profile__portfolio-form">
                  <input placeholder="Project title *" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                  <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} rows={3} />
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                    {['Short Film','Music Video','Documentary','Ad Film','Reel','Photography','Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input placeholder="YouTube URL (optional)" value={newItem.videoUrl} onChange={e => setNewItem({...newItem, videoUrl: e.target.value})} />
                  <input placeholder="Image URL (optional)" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} />
                  <button onClick={addPortfolioItem} className="profile__btn--save-project">Save Project</button>
                </div>
              )}
              <div className="profile__portfolio-grid">
                {portfolio.map(item => (
                  <PortfolioCard key={item.id} item={item} isOwn={isOwn} onDelete={deletePortfolioItem} />
                ))}
                {portfolio.length === 0 && (
                  <p className="profile__portfolio-empty">No portfolio items yet. Add your first project! 🎬</p>
                )}
              </div>
            </div>
          )}

          {/* Activity */}
          {posts.length > 0 && (
            <div className="profile__card">
              <div className="profile__activity-header">
                <h2 className="profile__section-title--no-margin">Activity</h2>
              </div>
              {posts.map((post, idx) => (
                <ProfilePostCard key={post.id} post={post} idx={idx} postsLen={posts.length} myUsername={myUsername} token={token} />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="profile__sidebar">
          <div className="profile__sidebar-card">
            <p className="profile__sidebar-heading">👥 People also viewed</p>
            <p className="profile__sidebar-subtext">Discover more creators like {user.fullName.split(' ')[0]}</p>
            <button onClick={() => navigate('/discover')} className="profile__btn--browse">Browse Creators</button>
          </div>
          {!isOwn && connectionStatus !== 'ACCEPTED' && token && (
            <div className="profile__sidebar-card">
              <p className="profile__sidebar-connect-heading">Connect with {user.fullName.split(' ')[0]}</p>
              <p className="profile__sidebar-connect-meta">{user.roles?.join(' & ')} · {user.city || 'India'}</p>
              {!connectionStatus && (
                <button onClick={sendConnection} className="profile__btn--sidebar-connect">🤝 Connect</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
