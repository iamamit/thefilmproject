import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

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

  return (
    <div style={{ borderBottom: idx < postsLen - 1 ? '1px solid var(--border)' : 'none' }}>
      <div style={{ padding: '1rem 1.5rem' }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.6rem' }}>{post.content}</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>❤️ {post.likedByUserIds?.length || 0}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>· {timeAgo(post.createdAt)}</span>
          <button onClick={toggle} style={{
            background: 'none', border: 'none', color: showComments ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500', padding: 0,
          }}>💬 {showComments ? 'Hide' : `${comments.length || 'View'} Comments`}</button>
        </div>
      </div>

      {showComments && (
        <div style={{ background: 'var(--bg-primary)', padding: '0.8rem 1.5rem', borderTop: '1px solid var(--border)' }}>
          {loadingC && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</p>}
          {comments.map(comment => (
            <div key={comment.id} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff'
              }}>{comment.author?.fullName?.charAt(0)}</div>
              <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: '0 12px 12px 12px', padding: '0.5rem 0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.85rem' }}>{comment.author?.fullName}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{timeAgo(comment.createdAt)}</span>
                    {comment.author?.username === myUsername && (
                      <button onClick={() => deleteComment(comment.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}>🗑️</button>
                    )}
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{comment.content}</p>
              </div>
            </div>
          ))}
          {token && (
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff'
              }}>{fullName?.charAt(0)}</div>
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitComment()}
                placeholder="Add a comment..."
                style={{
                  flex: 1, padding: '0.5rem 0.8rem', borderRadius: '20px',
                  border: '1px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none',
                }}
              />
              <button onClick={submitComment} disabled={!commentText.trim()} style={{
                background: commentText.trim() ? 'var(--accent)' : 'var(--border)',
                color: '#fff', border: 'none', borderRadius: '20px',
                padding: '0.4rem 0.8rem', cursor: commentText.trim() ? 'pointer' : 'default',
                fontSize: '0.8rem', fontWeight: '600',
              }}>Post</button>
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
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const myUsername = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const isOwn = username === myUsername;

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

  const card = {
    background: 'var(--bg-card)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '1rem',
  };

  if (loading) return <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-secondary)' }}>Loading...</p></div>;
  if (!user) return <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-secondary)' }}>User not found</p></div>;

  const primaryColor = roleColors[user.roles?.[0]] || '#0a66c2';

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1128px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div style={card}>
            <div style={{ height: '130px', background: 'linear-gradient(135deg, #b0bec5 0%, #78909c 100%)' }} />
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%', background: primaryColor,
                  border: '4px solid var(--bg-card)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '2.2rem', fontWeight: 'bold', color: '#fff',
                  marginTop: '-50px', flexShrink: 0,
                }}>{user.fullName?.charAt(0)}</div>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                  {isOwn ? (
                    <button onClick={() => navigate('/edit-profile')} style={{
                      background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)',
                      padding: '0.4rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600',
                    }}>✏️ Edit Profile</button>
                  ) : (<>
                    {!connectionStatus && <button onClick={sendConnection} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.4rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}>🤝 Connect</button>}
                    {connectionStatus === 'PENDING_SENT' && <button disabled style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.875rem' }}>⏳ Pending</button>}
                    {connectionStatus === 'PENDING_INCOMING' && <>
                      <button onClick={() => respondConnection(true)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}>✅ Accept</button>
                      <button onClick={() => respondConnection(false)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem' }}>❌ Decline</button>
                    </>}
                    {connectionStatus === 'ACCEPTED' && <button onClick={() => navigate(`/messages?user=${user.id}&name=${user.fullName}`)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.4rem 1.2rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}>💬 Message</button>}
                  </>)}
                </div>
              </div>
              <h1 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: '700', margin: '0.6rem 0 0.1rem' }}>{user.fullName}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>@{user.username}</p>
              {user.bio && <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.6rem' }}>{user.bio}</p>}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                {user.city && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📍 {user.city}{user.country ? `, ${user.country}` : ''}</span>}
                {user.availableForWork && <span style={{ color: '#2ecc71', fontSize: '0.85rem', fontWeight: '500' }}>✅ Available for work</span>}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>🗓️ {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {user.roles?.map(role => (
                  <span key={role} style={{
                    background: `${roleColors[role] || '#0a66c2'}18`, color: roleColors[role] || '#0a66c2',
                    border: `1px solid ${roleColors[role] || '#0a66c2'}44`,
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                  }}>{role.replace('_', ' ')}</span>
                ))}
              </div>
            </div>
          </div>

          {skills.length > 0 && (
            <div style={card}>
              <div style={{ padding: '1.2rem 1.5rem' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Skills & Tools</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {skills.map(skill => (
                    <div key={skill.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '500' }}>{skill.name}</span>
                      <span style={{ color: levelColors[skill.level], fontSize: '0.72rem', fontWeight: '600' }}>{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {user.languages?.length > 0 && (
            <div style={card}>
              <div style={{ padding: '1.2rem 1.5rem' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem' }}>Languages</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {user.languages.map(lang => (
                    <span key={lang} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>🗣️ {lang}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {posts.length > 0 && (
            <div style={card}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700' }}>Activity</h2>
              </div>
              {posts.map((post, idx) => (
                <ProfilePostCard key={post.id} post={post} idx={idx} postsLen={posts.length} myUsername={myUsername} token={token} />
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: '72px' }}>
          <div style={{ ...card, padding: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.8rem', fontSize: '0.9rem' }}>👥 People also viewed</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Discover more creators like {user.fullName.split(' ')[0]}</p>
            <button onClick={() => navigate('/discover')} style={{
              marginTop: '0.8rem', width: '100%', background: 'transparent',
              border: '1px solid var(--accent)', color: 'var(--accent)',
              borderRadius: '20px', padding: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
            }}>Browse Creators</button>
          </div>
          {!isOwn && connectionStatus !== 'ACCEPTED' && token && (
            <div style={{ ...card, padding: '1rem' }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Connect with {user.fullName.split(' ')[0]}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.8rem' }}>{user.roles?.join(' & ')} · {user.city || 'India'}</p>
              {!connectionStatus && (
                <button onClick={sendConnection} style={{
                  width: '100%', background: 'var(--accent)', color: '#fff', border: 'none',
                  borderRadius: '20px', padding: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
                }}>🤝 Connect</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
