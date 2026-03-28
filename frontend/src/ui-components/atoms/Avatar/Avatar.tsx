import React, { useRef, useState } from 'react';
import './Avatar.css';
import api from '../../../utils/api';

interface AvatarProps {
  photoUrl?: string | null;
  name?: string | null;
  size?: number;
  editable?: boolean;
  onUpdated?: (url: string) => void;
  onClick?: () => void;
}

export function Avatar({ photoUrl, name, size = 44, editable = false, onUpdated, onClick }: AvatarProps) {
  const letter = name?.charAt(0)?.toUpperCase() ?? '?';
  const [uploading, setUploading] = useState(false);
  const [hover, setHover] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        await api.put('/users/me/photo', { photo: dataUrl });
        localStorage.setItem('profilePhoto', dataUrl);
        onUpdated?.(dataUrl);
      } catch {
        // silently fail
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    position: 'relative',
    cursor: editable || onClick ? 'pointer' : 'default',
  };

  if (photoUrl) {
    return (
      <div
        style={containerStyle}
        onClick={editable ? () => fileRef.current?.click() : onClick}
        onMouseEnter={() => editable && setHover(true)}
        onMouseLeave={() => editable && setHover(false)}
      >
        <img src={photoUrl} alt={name ?? ''} className="avatar__img" style={{ width: size, height: size }} />
        {editable && hover && (
          <div className="avatar__overlay" style={{ fontSize: size * 0.2 }}>
            {uploading ? '...' : '📷'}
          </div>
        )}
        {editable && <input ref={fileRef} type="file" accept="image/*" className="avatar__file-input" onChange={handleFile} />}
      </div>
    );
  }

  return (
    <div
      className="avatar__initials"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      onClick={editable ? () => fileRef.current?.click() : onClick}
    >
      {letter}
      {editable && <input ref={fileRef} type="file" accept="image/*" className="avatar__file-input" onChange={handleFile} />}
    </div>
  );
}
