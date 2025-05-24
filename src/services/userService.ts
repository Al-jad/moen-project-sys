import axiosInstance from '@/plugins/axios';
import { BaseApiService } from '@/services/base/BaseApiService';
import type {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  ServiceResponse,
  UpdateUserRequest,
  User,
  UserRole,
} from '@/types/api';

class UserService extends BaseApiService<User, CreateUserRequest, UpdateUserRequest> {
  constructor() {
    super(axiosInstance, '/api/User');
  }

  /**
   * Get all users
   * @returns Promise with the users data
   */
  async getAllUsers(): ServiceResponse<User[]> {
    return this.getAll();
  }

  /**
   * Get a user by ID
   * @param id - User ID
   * @returns Promise with the user data
   */
  async getUserById(id: number | string): ServiceResponse<User> {
    return this.getById(id);
  }

  /**
   * Create a new user
   * @param userData - User data
   * @returns Promise with the created user data
   */
  async createUser(userData: CreateUserRequest): ServiceResponse<User> {
    return this.create(userData);
  }

  /**
   * Update a user
   * @param id - User ID
   * @param userData - Updated user data
   * @returns Promise with the updated user data
   */
  async updateUser(id: number | string, userData: UpdateUserRequest): ServiceResponse<User> {
    return this.update(id, userData);
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns Promise with the deletion result
   */
  async deleteUser(id: number | string): ServiceResponse<void> {
    return this.delete(id);
  }

  /**
   * Get current authenticated user
   * @returns Promise with the current user data
   */
  async getCurrentUser(): ServiceResponse<User> {
    return axiosInstance.get('/api/auth/me');
  }

  /**
   * Login user
   * @param credentials - Login credentials
   * @returns Promise with login response
   */
  async login(credentials: LoginRequest): ServiceResponse<LoginResponse> {
    return axiosInstance.post('/api/auth/login', credentials);
  }

  /**
   * Logout user
   * @returns Promise with logout result
   */
  async logout(): ServiceResponse<void> {
    return axiosInstance.post('/api/auth/logout');
  }

  /**
   * Refresh authentication token
   * @returns Promise with new token
   */
  async refreshToken(): ServiceResponse<LoginResponse> {
    return axiosInstance.post('/api/auth/refresh');
  }

  /**
   * Change user password
   * @param id - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise with the result
   */
  async changePassword(
    id: number | string,
    currentPassword: string,
    newPassword: string
  ): ServiceResponse<void> {
    return axiosInstance.put(`${this.baseEndpoint}/${id}/password`, {
      currentPassword,
      newPassword,
    });
  }

  /**
   * Update user role
   * @param id - User ID
   * @param role - New role
   * @returns Promise with updated user
   */
  async updateUserRole(id: number | string, role: UserRole): ServiceResponse<User> {
    return this.patch(id, { role });
  }

  /**
   * Toggle user active status
   * @param id - User ID
   * @param isActive - Active status
   * @returns Promise with updated user
   */
  async toggleUserStatus(id: number | string, isActive: boolean): ServiceResponse<User> {
    return this.patch(id, { isActive });
  }

  /**
   * Search users by username or email
   * @param searchTerm - Search term
   * @returns Promise with matching users
   */
  async searchUsers(searchTerm: string): ServiceResponse<User[]> {
    return this.getAll({ search: searchTerm });
  }

  /**
   * Get users by role
   * @param role - User role
   * @returns Promise with users of specified role
   */
  async getUsersByRole(role: UserRole): ServiceResponse<User[]> {
    return axiosInstance.get(`${this.baseEndpoint}/role/${role}`);
  }

  /**
   * Get users with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with paginated users
   */
  async getUsersPaginated(page: number = 1, limit: number = 10) {
    return this.getPaginated({ page, limit });
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
