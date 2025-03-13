import axiosInstance from '@/plugins/axios';

export const userService = {
  async getAllUsers() {
    return await axiosInstance.get('/api/User');
  },

  async getUserById(id) {
    return await axiosInstance.get(`/api/User/${id}`);
  },

  async getCurrentUser() {
    return await axiosInstance.get('/api/auth/me');
  },
};
