import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { usePageMeta } from '../hooks/usePageMeta';
import './Home.css';

const roleColors = {
  DIRECTOR: '#0a66c2', EDITOR: '#0073b1', MUSICIAN: '#9b59b6',
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


const projectColors = {
  FILM:        { bg: '#0a66c2', light: '#e8f0fe', label: '🎬 Film Project' },
  MUSIC:       { bg: '#9b59b6', light: '#f3e8ff', label: '🎵 Music Project' },
  WRITING:     { bg: '#f39c12', light: '#fef3e2', label: '✍️ Writing Project' },
  PHOTOGRAPHY: { bg: '#1abc9c', light: '#e2faf5', label: '📸 Photography Project' },
  THEATRE:     { bg: '#e74c3c', light: '#fde8e8', label: '🎭 Theatre Project' },
  DIGITAL:     { bg: '#2ecc71', light: '#e2faeb', label: '🎮 Digital Project' },
};

function UserAvatar({ photoUrl, name, size = 44, color = '#0a66c2', onClick }) {
  const letter = name?.charAt(0)?.toUpperCase() || '?';
  const clickableClass = onClick ? 'user-avatar__img--clickable' : 'user-avatar__img--default';
  const fallbackClickableClass = onClick ? 'user-avatar__fallback--clickable' : 'user-avatar__fallback--default';

  return photoUrl ? (
    <img
      src={photoUrl}
      alt={name}
      onClick={onClick}
      className={`user-avatar__img ${clickableClass}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      onClick={onClick}
      className={`user-avatar__fallback ${fallbackClickableClass}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
    >
      {letter}
    </div>
  );
}

function PostCard({ post, myId, myUsername, fullName, onLike, onDelete, onCommentAdded }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const navigate = useNavigate();
  const isLiked = post.likedByUserIds?.includes(myId);
  const isOwner = post.author?.username === myUsername;
  const authorColor = roleColors[post.author?.roles?.[0]] || '#0a66c2';
  const projectInfo = post.project ? (projectColors[post.projectType] || projectColors.FILM) : null;
  const token = localStorage.getItem('token');

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await api.get(`/posts/${post.id}/comments`);
      setComments(res.data);
      setCommentCount(res.data.length);
    } catch (err) { console.error(err); }
    finally { setLoadingComments(false); }
  };

  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  const submitComment = async () => {
    if (!commentText.trim() || !token) return;
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: commentText });
      setComments([...comments, res.data]);
      setCommentCount(commentCount + 1);
      setCommentText('');
    } catch (err) { console.error(err); }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/posts/${post.id}/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
      setCommentCount(commentCount - 1);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="post-card">
      {projectInfo && (
        <div
          className="post-card__project-banner"
          style={{ background: `linear-gradient(90deg, ${projectInfo.bg} 0%, ${projectInfo.bg}cc 100%)` }}
        >
          <span className="post-card__project-label">{projectInfo.label}</span>
          <span className="post-card__project-collab">🔍 Looking for collaborators</span>
        </div>
      )}
      <div className="post-card__body">
        {/* Author */}
        <div className="post-card__author-row">
          <div className="post-card__author-info" onClick={() => navigate(`/profile/${post.author?.username}`)}>
            <UserAvatar photoUrl={post.author?.profilePhotoUrl} name={post.author?.fullName} size={44} color={authorColor} />
            <div>
              <p className="post-card__author-name">{post.author?.fullName}</p>
              <div className="post-card__author-meta">
                {post.author?.roles?.slice(0, 2).map(role => (
                  <span key={role} className="post-card__role-badge" style={{ color: authorColor }}>
                    {role.replace('_', ' ')}
                  </span>
                ))}
                {post.author?.city && <span className="post-card__meta-dot">· {post.author.city}</span>}
                <span className="post-card__meta-dot">· {timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          {isOwner && (
            <button onClick={() => onDelete(post.id)} className="post-card__btn-delete" title="Delete post">🗑️</button>
          )}
        </div>

        {/* Content */}
        {post.imageUrl && (
          <img src={post.imageUrl} alt="post" className="post-card__image" />
        )}
        <p className="post-card__content">{post.content}</p>

        {/* Stats row */}
        {(post.likedByUserIds?.length > 0 || commentCount > 0) && (
          <div className="post-card__stats">
            {post.likedByUserIds?.length > 0 && (
              <span className="post-card__like-count">❤️ {post.likedByUserIds.length}</span>
            )}
            {commentCount > 0 && (
              <span className="post-card__comment-count" onClick={toggleComments}>
                {commentCount} comment{commentCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="post-card__actions">
          <button
            onClick={() => onLike(post.id)}
            className={`post-card__action-btn ${isLiked ? 'post-card__action-btn--liked' : 'post-card__action-btn--like'}`}
          >
            👍 Like
          </button>
          <button
            onClick={toggleComments}
            className={`post-card__action-btn ${showComments ? 'post-card__action-btn--comment-active' : 'post-card__action-btn--comment'}`}
          >
            💬 Comment
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="post-card__comments">
          {loadingComments ? (
            <p className="post-card__comments-loading">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="post-card__comments-empty">No comments yet. Be first!</p>
          ) : (
            <div className="post-card__comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="post-card__comment">
                  <UserAvatar
                    photoUrl={comment.author?.profilePhotoUrl}
                    name={comment.author?.fullName}
                    size={32}
                    color={roleColors[comment.author?.roles?.[0]] || '#0a66c2'}
                    onClick={() => navigate(`/profile/${comment.author?.username}`)}
                  />
                  <div className="post-card__comment-bubble">
                    <div className="post-card__comment-header">
                      <span className="post-card__comment-author">{comment.author?.fullName}</span>
                      <div className="post-card__comment-meta">
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
            </div>
          )}

          {/* Add comment */}
          {token && (
            <div className="post-card__add-comment">
              <UserAvatar photoUrl={localStorage.getItem('profilePhoto')} name={fullName || myUsername} size={32} />
              <div className="post-card__add-comment-inputs">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitComment()}
                  placeholder="Add a comment..."
                  className="post-card__comment-input"
                />
                <button
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                  className={`post-card__btn-comment-submit ${commentText.trim() ? 'post-card__btn-comment-submit--active' : 'post-card__btn-comment-submit--disabled'}`}
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Home() {
  usePageMeta('Home');
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [posting, setPosting] = useState(false);
  const [showPostBox, setShowPostBox] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [projectType, setProjectType] = useState('FILM');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');
  const myId = parseInt(localStorage.getItem('userId'));

  useEffect(() => { fetchFeed(); }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/posts/feed');
      setPosts(res.data.content);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const submitPost = async () => {
    if (!postContent.trim()) return;
    setPosting(true);
    try {
      await api.post('/posts', { content: postContent, isProject: isProject, projectType: isProject ? projectType : null, imageUrl: postImageUrl || null });
      setPostContent('');
      setPostImageUrl('');
      setIsProject(false);
      setProjectType('FILM');
      setShowPostBox(false);
      fetchFeed();
    } catch (err) { console.error(err); }
    finally { setPosting(false); }
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

  return (
    <div className="home">
      <div className="home__grid">

        {/* Left Sidebar */}
        <div className="home__left">
          {token ? (
            <div className="home__card">
              <div className="home__profile-banner" />
              <div className="home__profile-body">
                <div className="home__profile-avatar-wrap">
                  <UserAvatar photoUrl={localStorage.getItem('profilePhoto')} name={fullName || username} size={56} />
                </div>
                <p className="home__profile-name">{fullName}</p>
                <p className="home__profile-username">@{username}</p>
                <div className="home__profile-actions">
                  <button onClick={() => navigate(`/profile/${username}`)} className="home__btn-profile">View Profile</button>
                  <button onClick={() => navigate('/connections')} className="home__btn-network">My Network</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="home__guest-card">
              <p className="home__guest-icon">🎬</p>
              <p className="home__guest-title">Join CollabNow</p>
              <p className="home__guest-subtitle">Connect with India's best film creators</p>
              <button onClick={() => navigate('/register')} className="home__btn-join">Join Now</button>
              <button onClick={() => navigate('/login')} className="home__btn-signin">Sign In</button>
            </div>
          )}
          <div className="home__quicknav">
            {[
              { icon: '🧭', label: 'Discover Creators', path: '/discover' },
              { icon: '🤝', label: 'My Network', path: '/connections' },
              { icon: '💬', label: 'Messages', path: '/messages' },
            ].map(({ icon, label, path }) => (
              <button key={path} onClick={() => navigate(path)} className="home__quicknav-btn">
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Feed */}
        <div className="home__feed">
          {token && (
            <div className="home__compose">
              <div className="home__compose-trigger">
                <UserAvatar photoUrl={localStorage.getItem('profilePhoto')} name={fullName || username} size={44} />
                <button onClick={() => setShowPostBox(true)} className="home__compose-trigger-btn">
                  Share something with the film community...
                </button>
              </div>
              {showPostBox && (
                <div className="home__compose-expanded">
                  <textarea
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    autoFocus
                    rows={4}
                    maxLength={3000}
                    className="home__compose-textarea"
                  />
                  <div className={`home__char-count ${postContent.length > 2800 ? 'home__char-count--warning' : ''}`}>
                    {postContent.length}/3000
                  </div>
                  <input
                    type="url"
                    placeholder="Image URL (optional)"
                    value={postImageUrl}
                    onChange={e => setPostImageUrl(e.target.value)}
                    className="home__image-url-input"
                  />
                  <div className="home__compose-footer">
                    {/* Project Toggle */}
                    <div className="home__compose-footer-left">
                      <button
                        onClick={() => setIsProject(!isProject)}
                        className={`home__btn-project ${isProject ? 'home__btn-project--on' : 'home__btn-project--off'}`}
                      >
                        🎬 Project Post
                      </button>
                      {isProject && (
                        <select
                          value={projectType}
                          onChange={e => setProjectType(e.target.value)}
                          className="home__project-select"
                        >
                          <option value="FILM">🎬 Film</option>
                          <option value="MUSIC">🎵 Music</option>
                          <option value="WRITING">✍️ Writing</option>
                          <option value="PHOTOGRAPHY">📸 Photography</option>
                          <option value="THEATRE">🎭 Theatre</option>
                          <option value="DIGITAL">🎮 Digital</option>
                        </select>
                      )}
                    </div>
                    <div className="home__compose-footer-right">
                      <button
                        onClick={() => { setShowPostBox(false); setPostContent(''); setIsProject(false); }}
                        className="home__btn-cancel"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitPost}
                        disabled={posting || !postContent.trim()}
                        className={`home__btn-post ${postContent.trim() ? 'home__btn-post--active' : 'home__btn-post--disabled'}`}
                      >
                        {posting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!showPostBox && (
                <div className="home__media-bar">
                  {[['🎬', 'Video'], ['📸', 'Photo'], ['✍️', 'Article']].map(([icon, label]) => (
                    <button key={label} onClick={() => setShowPostBox(true)} className="home__media-btn">
                      {icon} {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="home__loading">Loading feed...</div>
          ) : posts.length === 0 ? (
            <div className="home__empty">
              <p className="home__empty-icon">🎬</p>
              <p className="home__empty-title">No posts yet</p>
              <p className="home__empty-sub">Be the first to share something!</p>
            </div>
          ) : posts.map(post => (
            <PostCard key={post.id} post={post} myId={myId} myUsername={username}
              fullName={fullName} onLike={toggleLike} onDelete={deletePost} />
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="home__right">
          <div className="home__about-card">
            <p className="home__about-title">🎬 About CollabNow</p>
            <p className="home__about-text">
              India's professional network for film &amp; content creators. Connect, collaborate, and create.
            </p>
          </div>
          <div className="home__trending-card">
            <p className="home__trending-title">🔥 Trending Roles</p>
            {['VFX Artist', 'Content Creator', 'Music Composer', 'Script Writer'].map(role => (
              <div key={role} className="home__trending-item">
                <div className="home__trending-dot" />
                <p className="home__trending-role">{role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
