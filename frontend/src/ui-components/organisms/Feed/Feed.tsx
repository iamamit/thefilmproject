import React from 'react';
import { Post } from '../../../types';
import { PostCard } from '../../molecules/PostCard/PostCard';
import './Feed.css';

interface FeedProps {
  posts: Post[];
  loading: boolean;
  myId: number | null;
  myUsername: string | null;
  myFullName?: string | null;
  myPhoto?: string | null;
  onLike: (postId: number) => void;
  onDelete: (postId: number) => void;
}

export function Feed({ posts, loading, myId, myUsername, myFullName, myPhoto, onLike, onDelete }: FeedProps) {
  if (loading) {
    return <div className="feed__loading">Loading feed...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="feed__empty">
        <p className="feed__empty-icon">🎬</p>
        <p className="feed__empty-title">No posts yet</p>
        <p className="feed__empty-sub">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          myId={myId}
          myUsername={myUsername}
          myFullName={myFullName}
          myPhoto={myPhoto}
          onLike={onLike}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
