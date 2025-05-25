import type { User } from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  tokens: {
    access: string;
  };
  user: User;
  roles?: string[];
  expiresIn?: number;
}
