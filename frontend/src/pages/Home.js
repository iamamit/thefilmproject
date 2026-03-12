import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const roleColors = {
  DIRECTOR: 'var(--accent)', EDITOR: '#4a90e2', MUSICIAN: '#9b59b6',
  PRODUCER: '#f39c12', ACTOR: '#1abc9c', CINEMATOGRAPHER: '#e67e22',
  VFX_ARTIST: '#3498db', WRITER: '#2ecc71'
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [showPostBox, setShowPostBox] = useState(false);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');
  const myId = parseInt(localStorage.getItem('userId'));

  useEffect(() => { fetchFeed(); }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/posts/feed');
      setPosts(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitPost = async () => {
    if (!postContent.trim()) return;
    setPosting(true);
    try {
      await api.post('/posts', { content: postContent });
      setPostContent('');
      setShowPostBox(false);
      fetchFeed();
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId) => {
    if (!token) { navigate('/login'); return; }
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setPosts(posts.map(p => p.id === postId ? res.data : p));
    } catch (err) { console.error(err); }
  };

  const deletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) { console.error(err); }
  };

  const cardStyle = {
    background: 'var(--bg-card)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', overflow: 'hidden',
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1128px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left Sidebar */}
        <div style={{ position: 'sticky', top: '72px' }}>
          {token ? (
            <div style={cardStyle}>
              <div style={{ height: '60px', background: 'linear-gradient(135deg, #b0bec5, #78909c)' }} />
              <div style={{ padding: '0 1rem 1rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'var(--accent)', border: '3px solid var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 'bold', color: '#fff',
                  marginTop: '-28px', marginBottom: '0.5rem'
                }}>
                  {(fullName || username)?.charAt(0).toUpperCase()}
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>{fullName}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.8rem' }}>@{username}</p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={() => navigate(`/profile/${username}`)} style={{
                    width: '100%', background: 'transparent', border: '1px solid var(--accent)',
                    color: 'var(--accent)', borderRadius: '20px', padding: '0.4rem',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
                  }}>View Profile</button>
                  <button onClick={() => navigate('/connections')} style={{
                    width: '100%', background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', borderRadius: '20px', padding: '0.4rem',
                    cursor: 'pointer', fontSize: '0.85rem',
                  }}>My Network</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...cardStyle, padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</p>
              <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.3rem' }}>Join TheFilmProject</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Connect with India's best film creators</p>
              <button onClick={() => navigate('/register')} style={{
                width: '100%', background: 'var(--accent)', border: 'none',
                color: '#fff', borderRadius: '20px', padding: '0.5rem',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem'
              }}>Join Now</button>
              <button onClick={() => navigate('/login')} style={{
                width: '100%', background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-primary)', borderRadius: '20px', padding: '0.5rem',
                cursor: 'pointer', fontSize: '0.85rem',
              }}>Sign In</button>
            </div>
          )}

          {/* Quick Links */}
          <div style={{ ...cardStyle, padding: '0.8rem', marginTop: '1rem' }}>
            {[
              { icon: '🧭', label: 'Discover Creators', path: '/discover' },
              { icon: '🤝', label: 'My Network', path: '/connections' },
              { icon: '💬', label: 'Messages', path: '/messages' },
            ].map(({ icon, label, path }) => (
              <button key={path} onClick={() => navigate(path)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem',
                background: 'none', border: 'none', color: 'var(--text-secondary)',
                padding: '0.6rem 0.5rem', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Create Post Box */}
          {token && (
            <div style={{ ...cardStyle, padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: '#fff'
                }}>{(fullName || username)?.charAt(0).toUpperCase()}</div>
                <button onClick={() => setShowPostBox(true)} style={{
                  flex: 1, padding: '0.7rem 1rem', borderRadius: '24px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'text',
                  textAlign: 'left',
                }}>Share something with the film community...</button>
              </div>

              {showPostBox && (
                <div style={{ marginTop: '1rem' }}>
                  <textarea
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    placeholder="What's on your mind? Share updates, projects, opportunities..."
                    autoFocus
                    rows={4}
                    style={{
                      width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'var(--bg-primary)',
                      color: 'var(--text-primary)', fontSize: '0.9rem', resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => { setShowPostBox(false); setPostContent(''); }} style={{
                      background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                      padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem'
                    }}>Cancel</button>
                    <button onClick={submitPost} disabled={posting || !postContent.trim()} style={{
                      background: postContent.trim() ? 'var(--accent)' : 'var(--bg-hover)',
                      color: postContent.trim() ? '#fff' : 'var(--text-muted)',
                      border: 'none', padding: '0.4rem 1.2rem', borderRadius: '20px',
                      cursor: postContent.trim() ? 'pointer' : 'default', fontSize: '0.85rem', fontWeight: '600'
                    }}>{posting ? 'Posting...' : 'Post'}</button>
                  </div>
                </div>
              )}

              {!showPostBox && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border)' }}>
                  {[['🎬', 'Video'], ['📸', 'Photo'], ['✍️', 'Article']].map(([icon, label]) => (
                    <button key={label} onClick={() => setShowPostBox(true)} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.4rem', background: 'none', border: 'none',
                      color: 'var(--text-secondary)', padding: '0.4rem', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >{icon} {label}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading feed...</div>
          ) : posts.length === 0 ? (
            <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</p>
              <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>No posts yet</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Be the first to share something!</p>
            </div>
          ) : posts.map(post => {
            const isLiked = post.likedByUserIds?.includes(myId);
            const isOwner = post.author?.username === username;
            const authorColor = roleColors[post.author?.roles?.[0]] || 'var(--accent)';

            return (
              <div key={post.id} style={cardStyle}>
                <div style={{ padding: '1rem 1.2rem' }}>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => navigate(`/profile/${post.author?.username}`)}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                        background: authorColor, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: '#fff'
                      }}>{post.author?.fullName?.charAt(0)}</div>
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0, fontSize: '0.95rem' }}>{post.author?.fullName}</p>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {post.author?.roles?.slice(0, 2).map(role => (
                            <span key={role} style={{ color: authorColor, fontSize: '0.75rem', fontWeight: '500' }}>
                              {role.replace('_', ' ')}
                            </span>
                          ))}
                          {post.author?.city && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>· {post.author.city}</span>}
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>· {timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    {isOwner && (
                      <button onClick={() => deletePost(post.id)} style={{
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        cursor: 'pointer', fontSize: '1rem', padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                      }} title="Delete post">🗑️</button>
                    )}
                  </div>

                  {/* Content */}
                  <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginBottom: '0.8rem' }}>
                    {post.content}
                  </p>

                  {/* Actions */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => toggleLike(post.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isLiked ? 'var(--accent)' : 'var(--text-secondary)',
                      padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem', fontWeight: isLiked ? '600' : '400',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {isLiked ? '❤️' : '🤍'} {post.likedByUserIds?.length || 0} Like{post.likedByUserIds?.length !== 1 ? 's' : ''}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar */}
        <div style={{ position: 'sticky', top: '72px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ ...cardStyle, padding: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.8rem', fontSize: '0.9rem' }}>🎬 About TheFilmProject</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.5' }}>
              India's professional network for film & content creators. Connect, collaborate, and create.
            </p>
          </div>
          <div style={{ ...cardStyle, padding: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.8rem', fontSize: '0.9rem' }}>🔥 Trending Roles</p>
            {['VFX Artist', 'Content Creator', 'Music Composer', 'Script Writer'].map(role => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
