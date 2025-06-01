import axiosInstance from '@/plugins/axios';
import type { LoginRequest, LoginResponse, ServiceResponse } from '@/types';

// Auth Operations
async function login(credentials: LoginRequest): ServiceResponse<LoginResponse> {
  const response = await axiosInstance.post('/api/auth/login', credentials);
  return response;
}

async function logout(): ServiceResponse<void> {
  const response = await axiosInstance.post('/api/auth/logout');
  return response;
}

async function getCurrentUser(): ServiceResponse<LoginResponse> {
  const response = await axiosInstance.get('/api/auth/me');
  return response;
}

export const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;
