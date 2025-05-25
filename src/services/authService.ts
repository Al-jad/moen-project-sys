import axiosInstance from '@/plugins/axios';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export class AuthService {
  private static instance: AuthService;
  private readonly baseUrl = '/api/auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        `${this.baseUrl}/login`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      // Enhance error with details from the response if available
      if (error.response?.data) {
        error.details = error.response.data;
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    await axiosInstance.post(`${this.baseUrl}/logout`);
  }
}

export const authService = AuthService.getInstance();
