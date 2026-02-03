import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "";
const OWNER_API_BASE = `${API_ORIGIN.replace(/\/$/, '')}/api/owner`;

const api = axios.create({
  baseURL: OWNER_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      console.log('Attaching token to request headers', token);
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('equb_user');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;