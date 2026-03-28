import { useState, useRef } from 'react';
import api from '../api';
import './AvatarUpload.css';

function Avatar({ user, size = 60, editable = false, onUpdated }) {
  const [uploading, setUploading] = useState(false);
  const [hover, setHover] = useState(false);
  const fileRef = useRef();
  const myUsername = localStorage.getItem('username');
  const canEdit = editable && user?.username === myUsername;

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Photo must be under 2MB'); return; }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await api.put('/users/me/photo', { photo: reader.result });
        localStorage.setItem('profilePhoto', reader.result);
        if (onUpdated) onUpdated(reader.result);
      } catch (err) {
        alert('Upload failed: ' + (err.response?.data || err.message));
      } finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const firstLetter = user?.fullName?.charAt(0) || '?';
  const roleColors = {
    DIRECTOR: '#0a66c2', EDITOR: '#0073b1', MUSICIAN: '#9b59b6',
    PRODUCER: '#f39c12', ACTOR: '#1abc9c', CINEMATOGRAPHER: '#e67e22',
    VFX_ARTIST: '#3498db', WRITER: '#2ecc71'
  };
  const bgColor = roleColors[user?.roles?.[0]] || '#0a66c2';

  return (
    <div className="avatar__wrapper"
      style={{ width: size, height: size }}
      onMouseEnter={() => canEdit && setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => canEdit && fileRef.current?.click()}
      title={canEdit ? 'Click to change photo' : ''}
    >
      {user?.profilePhotoUrl ? (
        <img src={user.profilePhotoUrl} alt={user.fullName}
          className="avatar__img"
          style={{ width: size, height: size }} />
      ) : (
        /* background is data-driven (role color), kept inline */
        <div className="avatar__initials"
          style={{
            width: size,
            height: size,
            background: bgColor,
            fontSize: size * 0.35,
          }}>
          {firstLetter}
        </div>
      )}

      {/* Hover overlay */}
      {canEdit && (hover || uploading) && (
        <div className="avatar__overlay">
          {uploading
            ? <span className="avatar__overlay-uploading">...</span>
            : <>
                {/* font-size is dynamic (size * 0.25), kept inline */}
                <span style={{ fontSize: size * 0.25 }}>📷</span>
                <span className="avatar__overlay-edit-label">Edit</span>
              </>
          }
        </div>
      )}

      {canEdit && <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="avatar__file-input" />}
    </div>
  );
}

export default Avatar;
