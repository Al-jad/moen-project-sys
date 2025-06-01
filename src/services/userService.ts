import axiosInstance from '@/plugins/axios';
import type { ServiceResponse } from '@/types';
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types/users';

// User CRUD Operations
async function getAllUsers(): ServiceResponse<User[]> {
  const response = await axiosInstance.get('/api/Auth/users');
  return response;
}

async function getUserById(id: number): ServiceResponse<User> {
  const response = await axiosInstance.get(`/api/Auth/users/${id}`);
  return response;
}

async function createUser(userData: CreateUserPayload): ServiceResponse<User> {
  const response = await axiosInstance.post('/api/Auth/users', userData);
  return response;
}

async function updateUser(id: number, userData: UpdateUserPayload): ServiceResponse<User> {
  const response = await axiosInstance.put(`/api/Auth/users/${id}`, userData);
  return response;
}

async function deleteUser(id: number): ServiceResponse<void> {
  const response = await axiosInstance.delete(`/api/Auth/users/${id}`);
  return response;
}

// Auth Operations
async function getCurrentUser(): ServiceResponse<User> {
  const response = await axiosInstance.get('/api/auth/me');
  return response;
}

async function login(credentials: {
  email: string;
  password: string;
}): ServiceResponse<{ token: string; user: User }> {
  const response = await axiosInstance.post('/api/auth/login', credentials);
  return response;
}

async function logout(): ServiceResponse<void> {
  const response = await axiosInstance.post('/api/auth/logout');
  return response;
}

export const userService = {
  // CRUD Operations
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // Auth Operations
  getCurrentUser,
  login,
  logout,
};

export default userService;
