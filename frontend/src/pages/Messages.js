import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

function Messages() {
  const [inbox, setInbox] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const myUsername = localStorage.getItem('username');
  const location = useLocation();

  useEffect(() => {
    fetchInbox();
    // Check if coming from profile page with a user to message
    const params = new URLSearchParams(location.search);
    const userId = params.get('user');
    const userName = params.get('name');
    if (userId && userName) {
      setSelectedUser({ id: parseInt(userId), fullName: userName });
    }
  }, [location]);

  useEffect(() => {
    if (selectedUser) fetchConversation(selectedUser.id);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const fetchInbox = async () => {
    try {
      const res = await api.get('/messages/inbox');
      setInbox(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId) => {
    try {
      const res = await api.get(`/messages/conversation/${userId}`);
      setConversation(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await api.post(`/messages/send/${selectedUser.id}`, { content: newMessage });
      setConversation([...conversation, res.data]);
      setNewMessage('');
      fetchInbox();
    } catch (err) {
      alert(err.response?.data || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (message) => {
    return message.sender.username === myUsername ? message.receiver : message.sender;
  };

  return (
    <div style={{ background: '#0f0f1a', height: 'calc(100vh - 60px)', display: 'flex' }}>

      {/* Inbox Sidebar */}
      <div style={{ width: '300px', background: '#1a1a2e', borderRight: '1px solid #2a2a4a', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #2a2a4a' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>💬 Messages</h2>
        </div>

        {loading ? (
          <p style={{ color: '#888', padding: '1rem' }}>Loading...</p>
        ) : inbox.length === 0 ? (
          <p style={{ color: '#888', padding: '1rem', fontSize: '0.9rem' }}>
            No messages yet. Go to a connection's profile and click Message!
          </p>
        ) : (
          inbox.map(msg => {
            const other = getOtherUser(msg);
            return (
              <div key={msg.id} onClick={() => setSelectedUser(other)}
                style={{
                  padding: '1rem 1.5rem', cursor: 'pointer', borderBottom: '1px solid #2a2a4a',
                  background: selectedUser?.id === other.id ? '#2a2a4a' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 'bold', flexShrink: 0
                  }}>{other.fullName?.charAt(0)}</div>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ color: '#fff', margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>{other.fullName}</p>
                    <p style={{ color: '#888', margin: 0, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <div style={{ padding: '1rem 1.5rem', background: '#1a1a2e', borderBottom: '1px solid #2a2a4a', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'bold'
              }}>{selectedUser.fullName?.charAt(0)}</div>
              <div>
                <p style={{ color: '#fff', margin: 0, fontWeight: 'bold' }}>{selectedUser.fullName}</p>
                {selectedUser.username && <p style={{ color: '#888', margin: 0, fontSize: '0.8rem' }}>@{selectedUser.username}</p>}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {conversation.length === 0 && (
                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>No messages yet. Say hello! 👋</p>
              )}
              {conversation.map(msg => {
                const isMine = msg.sender.username === myUsername;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '60%', padding: '0.7rem 1rem',
                      borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMine ? 'var(--accent)' : '#1a1a2e',
                      border: isMine ? 'none' : '1px solid #2a2a4a'
                    }}>
                      <p style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>{msg.content}</p>
                      <p style={{ color: isMine ? 'rgba(255,255,255,0.6)' : '#666', margin: '0.3rem 0 0', fontSize: '0.75rem', textAlign: 'right' }}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#1a1a2e', borderTop: '1px solid #2a2a4a', display: 'flex', gap: '0.8rem' }}>
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message... (Enter to send)"
                style={{
                  flex: 1, padding: '0.7rem 1rem', borderRadius: '24px',
                  border: '1px solid #333', background: '#0f0f1a', color: '#fff', fontSize: '0.95rem'
                }}
              />
              <button onClick={sendMessage} disabled={sending} style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: '50%', width: '44px', height: '44px',
                cursor: 'pointer', fontSize: '1.2rem'
              }}>➤</button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '3rem' }}>💬</p>
            <p style={{ color: '#888' }}>Select a conversation or go to a profile to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
