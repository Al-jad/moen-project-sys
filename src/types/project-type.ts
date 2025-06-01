export interface ProjectType {
  id: number;
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectTypeRequest {
  name: string;
  description?: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateProjectTypeRequest extends Partial<CreateProjectTypeRequest> {
  id: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  projectTypeId: number;
  projectType?: ProjectType;
  status: number;
  startDate?: string;
  endDate?: string;
  cost: number;
  duration: number;
  lat: number;
  lng: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  projectTypeId: number;
  status?: number;
  startDate?: string;
  endDate?: string;
  cost: number;
  duration: number;
  lat: number;
  lng: number;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number;
}

export enum ProjectStatus {
  UNDER_STUDY = 0,
  IN_PROGRESS = 1,
  SUSPENDED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}
