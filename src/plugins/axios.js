import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const API_CONFIG = {
  BASE_URL: 'https://pmsapi.alfakharco.com/',
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://pmsapi.alfakharco.com/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
export default axiosInstance;
