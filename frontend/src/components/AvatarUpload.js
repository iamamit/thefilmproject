import { useState, useRef } from 'react';
import api from '../api';

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
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      onMouseEnter={() => canEdit && setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => canEdit && fileRef.current?.click()}
      title={canEdit ? 'Click to change photo' : ''}
    >
      {user?.profilePhotoUrl ? (
        <img src={user.profilePhotoUrl} alt={user.fullName}
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-card)' }} />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: '50%', background: bgColor,
          border: '4px solid var(--bg-card)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: size * 0.35, fontWeight: 'bold', color: '#fff',
        }}>{firstLetter}</div>
      )}

      {/* Hover overlay */}
      {canEdit && (hover || uploading) && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          {uploading
            ? <span style={{ color: '#fff', fontSize: '0.65rem' }}>...</span>
            : <><span style={{ fontSize: size * 0.25 }}>📷</span><span style={{ color: '#fff', fontSize: '0.6rem', marginTop: '2px' }}>Edit</span></>
          }
        </div>
      )}

      {canEdit && <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />}
    </div>
  );
}

export default Avatar;
