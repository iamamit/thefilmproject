import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Comment } from '../../../types';
import { timeAgo } from '../../../utils/timeAgo';
import { roleColors } from '../../../utils/roleColors';
import { projectColors } from '../../../utils/projectColors';
import { Avatar } from '../../atoms/Avatar/Avatar';
import api from '../../../utils/api';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  myId: number | null;
  myUsername: string | null;
  myFullName?: string | null;
  myPhoto?: string | null;
  onLike: (postId: number) => void;
  onDelete: (postId: number) => void;
}

export function PostCard({ post, myId, myUsername, myFullName, myPhoto, onLike, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const navigate = useNavigate();

  const isLiked = post.likedByUserIds?.includes(myId ?? -1);
  const isOwner = post.author?.username === myUsername;
  const authorColor = roleColors[post.author?.roles?.[0]] ?? '#0a66c2';
  const projectInfo = (post.project || post.isProject)
    ? (projectColors[post.projectType!] ?? projectColors.FILM)
    : null;
  const token = localStorage.getItem('token');

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await api.get(`/posts/${post.id}/comments`);
      setComments(res.data);
      setCommentCount(res.data.length);
    } catch { /* ignore */ }
    finally { setLoadingComments(false); }
  };

  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(s => !s);
  };

  const submitComment = async () => {
    if (!commentText.trim() || !token) return;
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: commentText });
      setComments(prev => [...prev, res.data]);
      setCommentCount(c => c + 1);
      setCommentText('');
    } catch { /* ignore */ }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await api.delete(`/posts/${post.id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setCommentCount(c => c - 1);
    } catch { /* ignore */ }
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
        <div className="post-card__author-row">
          <div className="post-card__author-info" onClick={() => navigate(`/profile/${post.author?.username}`)}>
            <Avatar photoUrl={post.author?.profilePhotoUrl} name={post.author?.fullName} size={44} />
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

        {post.imageUrl && <img src={post.imageUrl} alt="post" className="post-card__image" />}
        <p className="post-card__content">{post.content}</p>

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
                  <Avatar
                    photoUrl={comment.author?.profilePhotoUrl}
                    name={comment.author?.fullName}
                    size={32}
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

          {token && (
            <div className="post-card__comment-compose">
              <Avatar photoUrl={myPhoto} name={myFullName} size={32} />
              <div className="post-card__comment-input-wrap">
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
                  className={`post-card__comment-submit ${commentText.trim() ? 'post-card__comment-submit--active' : 'post-card__comment-submit--disabled'}`}
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
