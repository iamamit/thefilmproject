import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stunning-fishstick-9qqgjp5wrg9hp447-8080.app.github.dev/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
