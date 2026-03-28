import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { AppLayout }   from '../ui-components/templates/AppLayout/AppLayout';
import { LeftSidebar } from '../ui-components/organisms/LeftSidebar/LeftSidebar';
import { RightSidebar } from '../ui-components/organisms/RightSidebar/RightSidebar';
import { PostCompose }  from '../ui-components/organisms/PostCompose/PostCompose';
import { Feed }         from '../ui-components/organisms/Feed/Feed';
import { Post } from '../types';

function Home() {
  usePageMeta('Home');
  const navigate  = useNavigate();
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const fullName = localStorage.getItem('fullName');
  const myId     = parseInt(localStorage.getItem('userId') ?? '0');
  const profilePhoto = localStorage.getItem('profilePhoto');

  useEffect(() => { fetchFeed(); }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/feed');
      setPosts(res.data.content);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleLike = async (postId: number) => {
    if (!token) { navigate('/login'); return; }
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setPosts(prev => prev.map(p => p.id === postId ? res.data : p));
    } catch (err) { console.error(err); }
  };

  const deletePost = async (postId: number) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) { console.error(err); }
  };

  return (
    <AppLayout
      left={
        <LeftSidebar
          isLoggedIn={!!token}
          fullName={fullName}
          username={username}
          profilePhoto={profilePhoto}
        />
      }
      center={
        <>
          {token && (
            <PostCompose
              fullName={fullName}
              username={username}
              profilePhoto={profilePhoto}
              onPosted={fetchFeed}
            />
          )}
          <Feed
            posts={posts}
            loading={loading}
            myId={myId}
            myUsername={username}
            myFullName={fullName}
            myPhoto={profilePhoto}
            onLike={toggleLike}
            onDelete={deletePost}
          />
        </>
      }
      right={<RightSidebar />}
    />
  );
}

export default Home;
