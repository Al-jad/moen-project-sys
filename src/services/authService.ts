import axiosInstance from '@/plugins/axios';
import type { LoginRequest, LoginResponse, ServiceResponse } from '@/types';

// Auth Operations
async function login(credentials: LoginRequest): ServiceResponse<LoginResponse> {
  const response = await axiosInstance.post('/users/login', credentials);
  return response;
}
async function getCurrentUser(userId: string): ServiceResponse<LoginResponse> {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response;
}

export const authService = {
  login,
  getCurrentUser,
};

export default authService;
