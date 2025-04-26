import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.config.url === '/users/me') {
      return Promise.reject(err);
    }
    const msg =
      err.response?.data?.error ||
      err.message ||
      'Coś poszło nie tak';
    toast.error(msg);
    return Promise.reject(err);
  }
);

export default api;
