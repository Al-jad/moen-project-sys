import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://pmsapi.alfakharco.com/api',
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
