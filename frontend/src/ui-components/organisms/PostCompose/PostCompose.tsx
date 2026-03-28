import React, { useState } from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { ProjectType } from '../../../types/enums';
import api from '../../../utils/api';
import './PostCompose.css';

interface PostComposeProps {
  fullName?: string | null;
  username?: string | null;
  profilePhoto?: string | null;
  onPosted: () => void;
}

export function PostCompose({ fullName, username, profilePhoto, onPosted }: PostComposeProps) {
  const [showBox, setShowBox] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isProject, setIsProject] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>('FILM');
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await api.post('/posts', {
        content,
        isProject,
        projectType: isProject ? projectType : null,
        imageUrl: imageUrl || null,
      });
      setContent(''); setImageUrl(''); setIsProject(false); setProjectType('FILM'); setShowBox(false);
      onPosted();
    } catch { /* ignore */ }
    finally { setPosting(false); }
  };

  const cancel = () => { setShowBox(false); setContent(''); setIsProject(false); };

  return (
    <div className="post-compose">
      <div className="post-compose__trigger">
        <Avatar photoUrl={profilePhoto} name={fullName || username} size={44} />
        <button onClick={() => setShowBox(true)} className="post-compose__trigger-btn">
          Share something with the film community...
        </button>
      </div>

      {showBox && (
        <div className="post-compose__expanded">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's on your mind?"
            autoFocus
            rows={4}
            maxLength={3000}
            className="post-compose__textarea"
          />
          <div className={`post-compose__char-count ${content.length > 2800 ? 'post-compose__char-count--warning' : ''}`}>
            {content.length}/3000
          </div>
          <input
            type="url"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="post-compose__image-input"
          />
          <div className="post-compose__footer">
            <div className="post-compose__footer-left">
              <button
                onClick={() => setIsProject(p => !p)}
                className={`post-compose__project-btn ${isProject ? 'post-compose__project-btn--on' : 'post-compose__project-btn--off'}`}
              >
                🎬 Project Post
              </button>
              {isProject && (
                <select
                  value={projectType}
                  onChange={e => setProjectType(e.target.value as ProjectType)}
                  className="post-compose__project-select"
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
            <div className="post-compose__footer-right">
              <button onClick={cancel} className="post-compose__cancel-btn">Cancel</button>
              <button
                onClick={submit}
                disabled={posting || !content.trim()}
                className={`post-compose__post-btn ${content.trim() ? 'post-compose__post-btn--active' : 'post-compose__post-btn--disabled'}`}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showBox && (
        <div className="post-compose__media-bar">
          {[['🎬', 'Video'], ['📸', 'Photo'], ['✍️', 'Article']].map(([icon, label]) => (
            <button key={label} onClick={() => setShowBox(true)} className="post-compose__media-btn">
              {icon} {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
