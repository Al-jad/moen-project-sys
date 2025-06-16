import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { useAuthStore } from '../stores/auth';
import type { ApiError } from '../types';

export interface ApiConfig {
  BASE_URL: string;
  FILE_URL: string;
}

export const API_CONFIG: ApiConfig = {
  BASE_URL: 'https://moenapi.idara-iq.com',
  FILE_URL: 'https://encode.ibaity.com/uploads/raw',
};

interface AxiosInstanceConfig extends AxiosRequestConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
  headers: {
    'Content-Type': string;
    Accept: string;
    'Allow-Cross-Origin': string;
  };
}

const axiosConfig: AxiosInstanceConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Allow-Cross-Origin': '*',
  },
};

const axiosInstance: AxiosInstance = axios.create(axiosConfig);

// Create a separate instance for file uploads without credentials
export const fileUploadInstance: AxiosInstance = axios.create({
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
    };

    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      const authStore = useAuthStore();
      authStore.logout();
      // Optionally redirect to login page
    }

    return Promise.reject(apiError);
  }
);

export default axiosInstance;
