import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useUnreadCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchCount = () => {
      api.get('/notifications/unread-count')
        .then(r => setCount(r.data?.count ?? 0))
        .catch(() => {});
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return count;
}
