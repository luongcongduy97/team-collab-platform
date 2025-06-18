import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error?.name === 'TokenExpiredError') {
      console.warn('⏰ Token đã hết hạn, redirect về login...');
      localStorage.removeItem('token');
      window.location.href = '/login'; // hoặc navigate() nếu dùng react-router
    }
    return Promise.reject(error);
  },
);
export default api;
