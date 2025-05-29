export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'CLERK';

export interface User {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  userName: string;
  department: string;
  section: string;
  unit: string;
  projectId: number;
  projectName: string | null;
  role: UserRole;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  userName: string;
  department: string;
  section: string;
  unit: string;
  projectId: number;
  role: UserRole;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: number;
}
