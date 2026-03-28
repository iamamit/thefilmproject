import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { Message } from '../types';
import './Messages.css';

interface SelectedUser {
  id: number;
  fullName: string;
  username?: string;
}

function Messages() {
  const [inbox, setInbox] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const myUsername = localStorage.getItem('username');
  const location = useLocation();

  useEffect(() => {
    fetchInbox();
    const params = new URLSearchParams(location.search);
    const userId   = params.get('user');
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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchConversation = async (userId: number) => {
    try {
      const res = await api.get(`/messages/conversation/${userId}`);
      setConversation(res.data);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await api.post(`/messages/send/${selectedUser.id}`, { content: newMessage });
      setConversation(prev => [...prev, res.data]);
      setNewMessage('');
      fetchInbox();
    } catch (err: any) {
      alert(err.response?.data || 'Could not send message');
    } finally { setSending(false); }
  };

  const getOtherUser = (message: Message): SelectedUser =>
    message.sender.username === myUsername ? message.receiver : message.sender;

  return (
    <div className="messages">
      <div className="messages__sidebar">
        <div className="messages__sidebar-header">
          <h2 className="messages__sidebar-title">💬 Messages</h2>
        </div>

        {loading ? (
          <p className="messages__inbox-loading">Loading...</p>
        ) : inbox.length === 0 ? (
          <p className="messages__inbox-empty">
            No messages yet. Go to a connection's profile and click Message!
          </p>
        ) : inbox.map(msg => {
          const other = getOtherUser(msg);
          return (
            <div
              key={msg.id}
              onClick={() => setSelectedUser(other)}
              className={`messages__inbox-item${selectedUser?.id === other.id ? ' messages__inbox-item--active' : ''}`}
            >
              <div className="messages__inbox-row">
                <div className="messages__inbox-avatar">{other.fullName?.charAt(0)}</div>
                <div className="messages__inbox-text">
                  <p className="messages__inbox-name">{other.fullName}</p>
                  <p className="messages__inbox-preview">{msg.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="messages__chat">
        {selectedUser ? (
          <>
            <div className="messages__chat-header">
              <div className="messages__chat-avatar">{selectedUser.fullName?.charAt(0)}</div>
              <div>
                <p className="messages__chat-name">{selectedUser.fullName}</p>
                {selectedUser.username && (
                  <p className="messages__chat-username">@{selectedUser.username}</p>
                )}
              </div>
            </div>

            <div className="messages__conversation">
              {conversation.length === 0 && (
                <p className="messages__conversation-empty">No messages yet. Say hello! 👋</p>
              )}
              {conversation.map(msg => {
                const isMine = msg.sender.username === myUsername;
                return (
                  <div
                    key={msg.id}
                    className={`messages__bubble-row${isMine ? ' messages__bubble-row--mine' : ' messages__bubble-row--theirs'}`}
                  >
                    <div className={`messages__bubble${isMine ? ' messages__bubble--mine' : ' messages__bubble--theirs'}`}>
                      <p className="messages__bubble-content">{msg.content}</p>
                      <p className={`messages__bubble-time${isMine ? ' messages__bubble-time--mine' : ' messages__bubble-time--theirs'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="messages__input-bar">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message... (Enter to send)"
                className="messages__input"
              />
              <button
                onClick={sendMessage}
                disabled={sending}
                className="messages__send-btn"
              >
                ➤
              </button>
            </div>
          </>
        ) : (
          <div className="messages__empty-state">
            <p className="messages__empty-icon">💬</p>
            <p className="messages__empty-text">Select a conversation or go to a profile to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
