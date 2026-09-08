import axios from 'axios';

// Base URL backend, diambil dari file .env (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor: setiap kali ada request keluar, otomatis tempelkan token JWT
// (kalau ada) ke header Authorization. Jadi kita nggak perlu nulis ini
// berulang-ulang di tiap halaman.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: kalau backend jawab 401 (token invalid/expired),
// otomatis logout paksa dan lempar ke halaman login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;